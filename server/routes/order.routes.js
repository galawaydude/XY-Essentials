const express = require('express');
const router = express.Router();
const { getUserOrders, getAllOrders, getOrderById, placeOrder, updateOrderStatus, cancelOrder } = require('../controllers/order.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');

// User Routes
// router.get('/', protect, getUserOrders);
router.get('/', protect, getAllOrders);
router.post('/', protect, placeOrder);
router.get('/:id', protect, getOrderById);

// Admin Routes
router.put('/:id', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, cancelOrder);

module.exports = router;
