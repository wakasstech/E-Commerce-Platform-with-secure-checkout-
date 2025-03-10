const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  street: {
    type: String,
  },
  city: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  country: {
    type: String,
  },
  phone: {
    type: String,
   
  }
});
const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
   
  }
});
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  otp: {
    type: String,
},
otpUsed: {
    type: Boolean,
    default: false,
},
  user_address:{
    type:String
  },
  shippingAddress: {
    type: addressSchema,  // Nested address schema
  },
  shippingContact: {
    type: contactSchema,  // Nested contact schema
    required: true
  },
  products: [
    {
      name: {
        type: String,
        
      },
      quantity: {
        type: Number,
        
      },
      price: {
        type: Number,
      
      },
    
      shippingAddress: {
        type: addressSchema,  
        
      },
      shippingContact: {
        type: contactSchema,  
     
      },
      size: {
        type: String,  // Optional size
        default: null,
      },
      color: {
        type: String,  // Optional color
        default: null,
      }
    }
  ],
  totalAmount: {
    type: Number,
  },
 
  paymentDetails: {
    paymentIntentId: {
      type: String,
      
    },
    paymentMethod: {
      type: String,
  
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'pending', 'failed'],  // Example statuses 
    }
  },
  paymentType: {
    type: String,
    enum: ['COD', 'JazzCash/EasyPaisa', 'Stripe'],
    validate: {
      validator: function(v) {
        return ['COD', 'JazzCash/EasyPaisa', 'Stripe'].includes(v);
      },
      message: props => `${props.value} is not a valid payment type`
    },
  },
  DiscountedAmount: {
    type: Number,
  },
  paymentReceipt: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});
// Add a pre-save hook to automatically update the updatedAt field
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
