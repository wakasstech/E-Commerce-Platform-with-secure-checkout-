const express = require('express');
const cartController = require('../Controllers/cartController');
const auth = require('../MiddleWares/auth'); 
const router = express.Router();
router.post('/add', auth.verifyJWT,cartController.addToCart);
router.get('/get',auth.verifyJWT,  cartController.getCart);
 router.put('/update', cartController.updateCart);
router.delete('/delete',  cartController.deleteCartItem);
module.exports = router;
