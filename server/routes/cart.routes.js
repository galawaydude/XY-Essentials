const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cart.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

// Protected Routes
router.get('/',  getCart);
router.post('/', addToCart);
router.put('/:itemId',  updateCartItem);
router.delete('/:itemId', removeCartItem);
router.delete('/', protect, clearCart);

module.exports = router;
