const express = require('express');
const router = express.Router();
const { getUserOrders, getOrderById, placeOrder, updateOrderStatus, cancelOrder } = require('../controllers/order.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');

// User Routes
router.get('/', getUserOrders);
router.post('/', placeOrder);
router.get('/:id',getOrderById);

// Admin Routes
router.put('/:id', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, cancelOrder);

module.exports = router;
