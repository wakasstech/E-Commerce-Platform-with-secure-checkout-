const mongoose = require('mongoose');
const emailCouponUsageSchema = new mongoose.Schema({
    email: { type: String, required: true },               // Email used for the coupon
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true },
    used: { type: Boolean, default: false },
  });
  
  const EmailCouponUsage = mongoose.model('EmailCouponUsage', emailCouponUsageSchema);
  module.exports = EmailCouponUsage;
  