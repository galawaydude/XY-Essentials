const express = require('express');
const router = express.Router();
const { processRazorpay, getPaymentStatus, verify, handleRazorpayWebhook } = require('../controllers/payment.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

// Protected Routes
router.post('/razorpay', processRazorpay);
router.get('/status/:orderId', protect, getPaymentStatus);

// Razorpay Webhook for payment verification
router.post('/verify', verify);
router.post('/razorpayWebhook', handleRazorpayWebhook);

module.exports = router;
