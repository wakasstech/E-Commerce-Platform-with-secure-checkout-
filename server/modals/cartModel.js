const mongoose = require('mongoose');

// Schema for individual line items in the cart
const lineItemSchema = new mongoose.Schema({
    productName: { 
        type: String,
        required: true 
    },
    currency: { 
        type: String, 
        default: 'usd',
        required: true 
    },
    unitAmount: { 
        type: Number,
        required: true, 
        min: 0 
    },
    quantity: { 
        type: Number,
        required: true, 
        min: 1 
    },
    color: { 
        type: String,
        required: true,
        trim: true
    },
    size: {
        type: String,
    },
    image: {
        type: String,
    },
});

// Main Cart Schema
const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
        index: true 
    },
    lineItems: [lineItemSchema],
    totalAmount: {
        type: Number,
        default: 0, 
    },
    currency: {
        type: String,
      
    },
 
    status: { 
        type: String,
        enum: ['active', 'completed', 'cancelled'], 
        default: 'active'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

cartSchema.pre('save', function (next) {
    const cart = this;
    
    // Calculate total amount based on line items
    cart.totalAmount = cart.lineItems.reduce((total, item) => {
        return total + (item.unitAmount * item.quantity);
    }, 0);
    
    next();
});
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
