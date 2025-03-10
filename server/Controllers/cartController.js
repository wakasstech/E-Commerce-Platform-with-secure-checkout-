const Cart = require('../modals/cartModel');

// Add items to the cart with color, unitPrice, and image support
exports.addToCart = async (req, res) => {
    try {
        const {  quantity, color,size, unitAmount, image, title } = req.body;
        const userId = req.user.id;

        // Find active cart for the user
        let cart = await Cart.findOne({ userId, status: 'active' });

        // If no cart exists, create a new one
        if (!cart) {
            cart = new Cart({ userId, lineItems: [] });
        }
        console.log(cart.lineItems)
        // Check if the product with the same color already exists in the cart
          // Check if the product with the same name, color, and size already exists in the cart
          const existingItem = cart.lineItems.find(
            item => item.productName === title && item.color === color && item.size === size
        );
        console.log("existingItem",existingItem)

        if (existingItem) {
          
            return res.status(200).json({
                message: "Product already exists in your cart. Please update the item on the cart page."
            });
        }
 else {
            // If product doesn't exist, add it as a new line item
            cart.lineItems.push({
                productName: title,
                color: color,
                quantity: quantity,
                unitAmount: unitAmount,
                image: image,
                size:size,
                currency: "usd"
            });
        }

        // Save the cart with updated line items
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch the active cart for the user
        const cart = await Cart.findOne({ userId, status: 'active' });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found', success: false });
        }

        // Calculate the total amount dynamically based on line items
        const totalAmount = cart.lineItems.reduce((total, item) => total + (item.unitAmount * item.quantity), 0);

        res.status(200).json({
            data: {
                userId: cart.userId,
                lineItems: cart.lineItems,
                totalAmount: totalAmount,
                currency: cart.currency || "usd",
                status: cart.status,
                _id: cart._id,
                createdAt: cart.createdAt
            },
            success: true
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal Server Error', success: false });
    }
};


// Update cart items
exports.updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity, color } = req.body;

        const cart = await Cart.findOne({ userId, status: 'active' });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found', success: false });
        }

        const itemToUpdate = cart.lineItems.find(item =>
            item._id.toString() === productId && item.color === color
        );

        if (itemToUpdate) {
            itemToUpdate.quantity = quantity;
        } else {
            return res.status(404).json({ message: 'Product not found in cart', success: false });
        }

        await cart.save();
        res.status(200).json({ data: cart, message: 'Cart updated', success: true });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Internal Server Error', success: false });
    }
};

// Remove items from the cart
exports.deleteCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, color } = req.body;

        const cart = await Cart.findOne({ userId, status: 'active' });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found', success: false });
        }

        cart.lineItems = cart.lineItems.filter(item =>
            !(item._id.toString() === productId && item.color === color)
        );

        await cart.save();
        res.status(200).json({ message: 'Product removed from cart', success: true });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ error: 'Internal Server Error', success: false });
    }
};

// Clear the entire cart
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId, status: 'active' });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found', success: false });
        }

        cart.lineItems = [];
        await cart.save();

        res.status(200).json({ message: 'Cart cleared', success: true });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Internal Server Error', success: false });
    }
};
