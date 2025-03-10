  const Order = require('../modals/orderModel');
  const fs = require('fs'); 
  const emailController = require("../Controllers/emailController");
// Controller to get all orders
const { uploadOnCloudinary, deleteOnCloudinary } = require('../utils/cloudinary.js');
const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find(); // Fetch all orders from the database
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error });
    }
  };
  // Controller to get orders of a specific user
  const getUserOrders = async (req, res) => {
    const userId = req.query.userId; 
    try {
      const orders = await Order.find({ user: userId }); // Fetch orders for the specific user
      if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user orders', error });
    }
  };
  const createOrder = async (req, res) => {
    try {
      const { shippingContact } = req.body;
      // Validate required fields
      if (!shippingContact || !shippingContact.email || !shippingContact.phone) {
        return res.status(400).json({
          message: 'Shipping contact information is required, including email and phone.',
        });
      }
  console.log(shippingContact,"shippingContact")
      // Create the order with pending status
      const newOrder = new Order({
        shippingContact ,
        orderStatus: 'pending',
      });
  console.log(newOrder,"new Order")
      // Save the new order to the database
      const savedOrder = await newOrder.save();
      return res.status(201).json({
        message: 'Order created successfully',
        order: savedOrder,
      });
  
    } catch (error) {
      console.error('Error creating order:', error);
  
      // Determine the type of error (validation, database, etc.)
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Validation error. Check the input fields.',
          error: error.message,
        });
      } else {
        return res.status(500).json({
          message: 'Internal server error. Could not create order.',
          error: error.message,
        });
      }
    }
  };
  const updateOrderWithAddress = async (req, res) => {
  try {
    const { orderId, shippingAddress } = req.body;
    // Validate that shippingAddress is provided
    if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.lastName ||!shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({
        message: 'Shipping address is required.',
      });
    }
    // Find the order and update it with the shipping address
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { shippingAddress },
      { new: true }  // Return the updated document
    );
    if (!updatedOrder) {
      return res.status(404).json({
        message: 'Order not found.',
      });
    }
    return res.status(200).json({
      message: 'Shipping address added successfully.',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order with address:', error);
    return res.status(500).json({
      message: 'Internal server error.Could not update order with address.',
      error: error.message,
    });
  }
};
// const updateOrderMethod = async (req, res) => {
//   try {
//     const { orderId, paymentType } = req.body;
//     // Validate that shippingAddress is provided
//     if (!paymentType || !orderId ) {
//       return res.status(400).json({
//         message: 'The selected method and orderId is required.',
//       });
//     }
//     // Find the order and update it with the shipping address
//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { paymentType },
//       { new: true }  // Return the updated document
//     );
//     console.log(updatedOrder)
//     if (!updatedOrder) {
//       return res.status(404).json({
//         message: 'Order not found.',
//       });
//     }
//     return res.status(200).json({
//       message: 'Shipping address added successfully.',
//       order: updatedOrder,
//     });
//   } catch (error) {
//     console.error('Error updating order with address:', error);
//     return res.status(500).json({
//       message: 'Internal server error.Could not update order with address.',
//       error: error.message,
//     });
//   }
// };
const uploadPaymentReceipt = async (req, res) => {
  try {
    const { orderId } = req.query;

    // Check if file and orderId are provided
    if (!req.file || !orderId) {
      return res.status(400).json({
        message: 'Payment receipt image and order ID are required.',
      });
    }
console.log('Payment receipt image and order ID',req.file, orderId)

    let paymentReceipt = null;
    // Upload image to Cloudinary if provided
    if (req.file) {
      const cloudinary_res = await uploadOnCloudinary(req.file.path);
      paymentReceipt = cloudinary_res.url;
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting file from local system:', err);
        } else {
          console.log('File deleted from local system');
        }
      });
    }

    // Find the order and update it with the payment receipt URL
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentReceipt }, // Add the Cloudinary image URL
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: 'Order not found.',
      });
    }

    // Prepare email payload
    const emailPayload = {
      userEmail: updatedOrder.shippingContact.email,
      userNumber: updatedOrder.shippingContact.phone,
      userFirstName: updatedOrder.shippingAddress.firstName,
      userLastName: updatedOrder.shippingAddress.lastName,
      products: updatedOrder.products, // assuming products are stored in the order
      totalAmount: updatedOrder.totalAmount,
      paymentStatus: "pending", // Assuming "pending" if not explicitly set by a session
    };

    // Send emails to both admin and client
    const sendEmailonPaymentAdmin = await emailController.sendEasyPaisaOrderConfirmationAdmin(emailPayload);
    const sendEmailonPaymentClient = await emailController.sendEasyPaisaOrderConfirmationClient(emailPayload);
    console.log('Admin Email:', sendEmailonPaymentAdmin);
    console.log('Client Email:', sendEmailonPaymentClient);

    return res.status(200).json({
      message: 'Payment receipt uploaded and email sent successfully.',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error uploading payment receipt:', error);
    return res.status(500).json({
      message: 'Internal server error. Could not upload payment receipt.',
      error: error.message,
    });
  }
};
const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    // Validate that orderId is provided
    if (!orderId) {
      return res.status(400).json({
        message: 'Order ID is required.',
      });
    }
    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: 'Order not found.',
      });
    }
    
    if (!order.paymentReceipt) {
      return res.status(400).json({
        message: 'No payment receipt found for this order.',
      });
    }
    order.orderStatus = 'completed';
    const updatedOrder = await order.save();
    return res.status(200).json({
      message: ' Thanks Order confirmed and successfully completed!',
      orderId: updatedOrder._id,
    });
  } catch (error) {
    console.error('Error confirming order:', error);
    return res.status(500).json({
      message: 'Internal server error. Could not confirm the order.',
      error: error.message,
    });
  }
};
const updateOrder = async (req, res) => {
  try {
    const { orderId, paymentType, line_items,DiscountedAmount } = req.body;

    // Find the existing order by its ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }


    const products = line_items.map(item => {
      const productData = item.price_data.product_data.metadata;
      return {
        name: item.price_data.product_data.name,
        quantity: item.quantity,
        price: item.price_data.unit_amount / 100, 
        size: productData.size || null,
        color: productData.color || null,
      };
    });

    // Update order fields
    order.paymentType = paymentType || order.paymentType;
    order.DiscountedAmount = DiscountedAmount || 0;
    order.products = products || order.products;

    // Save the updated order
    await order.save();
   // Prepare email payload
  
    res.status(200).json({
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  // Export the controller functions
  module.exports = {
    getAllOrders,
    getUserOrders,
    createOrder,
    updateOrderWithAddress,
   
    updateOrder,
 uploadPaymentReceipt,
 confirmOrder
  };