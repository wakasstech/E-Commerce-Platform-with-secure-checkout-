const Coupon = require('../modals/couponModel');  
const EmailCouponUsage = require('../modals/emailUsageCouponModel');  
// Create a new coupon
const createCoupon = async (req, res) => {
  try {
    const { code, discountAmount, discountType, expirationDate } = req.body;

    const newCoupon = new Coupon({
      code,
      discountAmount,
      discountType,
      expirationDate,
    });

    await newCoupon.save();
    return res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating coupon', error: error.message });
  }
};

// Get all coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    return res.status(200).json({ coupons });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching coupons', error: error.message });
  }
};

// Get a single coupon by ID
const getCouponById = async (req, res) => {
  try {
    const { id } = req.query;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    return res.status(200).json({ coupon });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching coupon', error: error.message });
  }
};

// Update a coupon by ID
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.query;
    const { code, discountAmount, discountType, expirationDate, isActive } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discountAmount, discountType, expirationDate, isActive },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    return res.status(200).json({ message: 'Coupon updated successfully', coupon: updatedCoupon });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating coupon', error: error.message });
  }
};

// Delete a coupon by ID
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    return res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting coupon', error: error.message });
  }
};

// Apply a coupon by email during order placement
const applyCouponByEmail = async (req, res) => {
  try {
    const { email, couponCode, orderTotal } = req.body;

    // Find coupon by code
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ message: 'Invalid or inactive coupon' });
    }

    // Check expiration date
    if (new Date() > coupon.expirationDate) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    // Check if the email has already used this coupon
    const emailCouponUsage = await EmailCouponUsage.findOne({ email, couponId: coupon._id, used: true });
    if (emailCouponUsage) {
      return res.status(400).json({ message: 'Coupon already used by this email' });
    }

    // Calculate discount
    let discount;
    if (coupon.discountType === 'percentage') {
      discount = (coupon.discountAmount / 100) * orderTotal;
    } else {
      discount = coupon.discountAmount;
    }

    // Ensure discount does not exceed the order total
    const finalAmount = Math.max(orderTotal - discount, 0);

    // Mark coupon as used for this email
    await EmailCouponUsage.findOneAndUpdate(
      { email, couponId: coupon._id },
      { used: true },
      { upsert: true }  // Creates a new record if one doesn’t exist
    );

    return res.status(200).json({
      message: 'Coupon applied successfully',
      discount,
      finalAmount,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error applying coupon', error: error.message });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCouponByEmail,
};
