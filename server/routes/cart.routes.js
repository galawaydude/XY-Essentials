const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cart.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const { requireAuth }  = require ('@clerk/clerk-sdk-node');

// Protected Routes
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:itemId', protect,  updateCartItem);
router.delete('/:itemId', protect, removeCartItem);
router.delete('/', protect, clearCart);

// router.get('/', requireAuth(), getCart);
// router.post('/', requireAuth(addToCart));
// router.put('/:itemId', requireAuth(),  updateCartItem);
// router.delete('/:itemId', requireAuth(), removeCartItem);
// router.delete('/', requireAuth(), clearCart);

module.exports = router;
