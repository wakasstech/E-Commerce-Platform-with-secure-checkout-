
const moment = require('moment');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const session = require("express-session");
const emailController = require("../Controllers/emailController");
const axios = require("axios");
const cors = require("cors");
const app = express(); 
const { JSDOM } = require('jsdom'); 
app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'application/json' }));
// const endpointSecret = 'we_1OMAsFKQiLOn1OUqeZtUV1mA';
//const stripe = require('stripe')('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');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {User} = require("../modals/userModel.js");
const Order = require('../modals/orderModel'); // Assuming you have an Order model
var ourUser;
const Cart = require('../modals/cartModel'); 
async function sessionStripe(req, res) {
  try {
   const deliveryCharges = 150;  
   console.log("in the  sesstion")
 
    // user.stripe_session=session.id;
    //  await user.save();
    const session = await stripe.checkout.sessions.create({
      line_items: [
        // Product items
        ...req.body.line_items.map(item => ({
          price_data: {
            currency: item.price_data.currency,
            product_data: {
              name: item.price_data.product_data.name,
              metadata: {
                product_id: item.price_data.product_data.metadata.product_id,
                color: item.price_data.product_data.metadata.color,
                size: item.price_data.product_data.metadata.size,
              }
            },
            unit_amount: item.price_data.unit_amount * 100  // Convert to cents if necessary
          },
          quantity: item.quantity
        })),
        // Delivery charges as a separate line item
        {
          price_data: {
            currency: 'pkr',  // Set to your currency
            product_data: {
              name: 'Delivery Charges',
            },
            unit_amount: deliveryCharges,  
          },
          quantity: 1  // Fixed quantity for delivery charges
        }
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
      allow_promotion_codes: true, 
      metadata: {
        order_id: req.body.orderId,
      }
    });
    console.log(session.url,"session");
    // Sending the URL in the response
     //res.status(200).json({ url: session.url,session_id: session.id });
    res.status(200).json({stripeUrl: session.url});
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function statusStripe(req, res) {
    const result = Promise.all([
        stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
        stripe.checkout.sessions.listLineItems(req.query.session_id)
    ])
    console.log("success")
    res.send('Your payment was successful')
};
async function cancelStripe(req, res) {
    console.log("object")
    res.send('Your cancel payment')
};


const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    if (session.payment_status === 'paid' && session.status === 'complete') {
      const orderId = session.metadata.order_id;

      try {
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({ message: "Order not found", status: false });
        }

        // Idempotency check: if the order is already marked as completed, exit
        if (order.paymentDetails?.paymentStatus === 'paid') {
          console.log(`Order ${orderId} has already been processed.`);
          return res.status(200).json({ message: 'Order already processed.' });
        }

        // Retrieve line items with additional information
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items.data.price.product'],
        });

        const lineItems = sessionWithLineItems.line_items.data;

        // Prepare product details for order and email
        const products = lineItems.map(item => ({
          name: item.description,
          quantity: item.quantity,
          price: item.price.unit_amount / 100,
          size: item.price.product.metadata.size,
          color: item.price.product.metadata.color,
        }));

        // Update order with product and payment details
        order.products = products;
        order.totalAmount = session.amount_total / 100;
        order.paymentDetails = {
          paymentIntentId: session.payment_intent,
          paymentMethod: session.payment_method_types[0],
          paymentStatus: session.payment_status,
        };

        await order.save();
        console.log(`Order ${orderId} updated with payment details`);

        // Email payload preparation
        const emailPayload = {
          userEmail: order.shippingContact.email,
          userNumber: order.shippingContact.phone,
          userFirstName: order.shippingAddress.firstName,
          userLastName: order.shippingContact.lastName,
          products: products,
          totalAmount: order.totalAmount,
          paymentStatus: session.payment_status,
        };
        
        // Send emails
        const sendEmailonPaymentAdmin = await emailController.sendEmailonPaymentAdmin(emailPayload);
        const sendEmailonPaymentClient = await emailController.sendEmailonPaymentClient(emailPayload);
        console.log('Admin Email:', sendEmailonPaymentAdmin);
        console.log('Client Email:', sendEmailonPaymentClient);
        // Respond immediately after processing
        return res.status(200).json({ message: 'Order updated and emails sent successfully.' });
      } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({
          message: 'Error updating the order with payment details.',
          error: error.message,
        });
      }
    } else {
      console.log('Payment status or session status did not meet the criteria for processing.');
      return res.status(403).json({ message: "Webhook call from Stripe did not meet criteria", status: false });
    }
  }
  // Respond with 200 for other event types to acknowledge receipt
  res.status(200).json({ received: true });
};
module.exports =  {
    webhook, 
    sessionStripe,
    statusStripe,
    cancelStripe
}