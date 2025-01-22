const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart , getCarts, removeCartItemByProductId } = require('../controllers/cart.controller.js');
const { protect , admin} = require('../middlewares/auth.middleware.js');

// Protected Routes
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:itemId', protect,  updateCartItem);
router.delete('/:productId', protect, removeCartItemByProductId);
router.delete('/:itemId', protect, removeCartItem);
router.delete('/', protect, clearCart);

// Admin Routes
router.get('/get-all-carts', protect, admin, getCarts);

module.exports = router;
