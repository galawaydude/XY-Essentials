const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart , getCarts} = require('../controllers/cart.controller.js');
const { protect , admin} = require('../middlewares/auth.middleware.js');

// Protected Routes
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:itemId', protect,  updateCartItem);
router.delete('/:itemId', protect, removeCartItem);
router.delete('/', protect, clearCart);


router.get('/get-all-carts', protect, admin, getCarts);

module.exports = router;
