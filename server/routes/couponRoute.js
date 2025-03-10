const express = require('express');
const router = express.Router();
const couponController = require('../Controllers/couponController');
router.post('/createCoupon', couponController.createCoupon);
router.get('/getAll', couponController.getAllCoupons);
router.get('/getById', couponController.getCouponById);
router.put('/update', couponController.updateCoupon);
router.delete('/delete', couponController.deleteCoupon);
router.post('/apply', couponController.applyCouponByEmail);
module.exports = router;
