const express = require('express');
const router = express.Router();
const { getUserOrders, getAllOrders, getOrderById, placeOrder, updateOrderStatus, cancelOrder, generateBill, updateWaybillNumber } = require('../controllers/order.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');

// router.get('/', protect, getUserOrders);
router.post('/', protect, placeOrder);
router.get('/:id/generate-bill', protect, generateBill);
router.get('/:id', protect, getOrderById);
router.put('/:id/waybill', protect, updateWaybillNumber);

// Admin Routes
router.put('/:id', protect, admin, updateOrderStatus);
router.get('/', protect, admin, getAllOrders);
router.delete('/:id', protect, admin, cancelOrder);

module.exports = router;
