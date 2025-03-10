const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },     
  discountAmount: { type: Number, required: true },         
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  expirationDate: { type: Date, required: true },           
  isActive: { type: Boolean, default: true },               
  maxUsage: { type: Number, default: 1 },                  
  usageCount: { type: Number, default: 0 },                
});
const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
