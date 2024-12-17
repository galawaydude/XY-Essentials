const express = require('express');
const passport = require('passport');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUsers, getRole } = require('../controllers/user.controller.js');
const { getUserOrders, getOrderById, placeOrder, updateOrderStatus, cancelOrder } = require('../controllers/order.controller.js');
const { getUserAddresses, createAddress, updateAddress, deleteAddress } = require('../controllers/address.controller.js');
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cart.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');
const userValidator = require('../validations/user.validator.js');
const { requireAuth }  = require ('@clerk/express');

// Protected Routes
router.get('/profile', protect, getUserProfile);
router.get('/user/orders', protect, getUserOrders);
router.get('/user/addresses', protect, getUserAddresses);
router.get('/user/cart', protect, getCart);
router.put('/profile', protect, updateUserProfile);

// router.get('/profile', requireAuth(), getUserProfile);
// router.get('/user/orders', requireAuth(), getUserOrders);
// router.get('/user/addresses', requireAuth(), getUserAddresses);
// router.get('/user/cart', requireAuth(), getCart);
// router.put('/profile', requireAuth(), updateUserProfile);

// Admin Routes
router.get('/', protect, admin, getUsers);

module.exports = router;
