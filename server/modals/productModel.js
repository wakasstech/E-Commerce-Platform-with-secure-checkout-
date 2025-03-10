const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
    }, 
    image: 
        {
             type: String }
        ,
        color: {
            type: Array, 
            default: [],   
          },
    rating: {
        type: Number,
        default: () => Math.floor(Math.random() * (5 - 4 + 1)) + 4 // Random rating between 4 and 5
    },
    category: {
        type:String
    },
    collection:{
        type:String
    },
  
    description: {
        type: String,
        trim: true
    },
    size: {
        type: Array, 
        default: [],   
      },
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
