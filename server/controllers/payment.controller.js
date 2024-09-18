const asyncHandler = require('express-async-handler');
const Payment = require('../models/payment.model');

// Process a new payment
const processPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod, amount } = req.body;

  const payment = new Payment({
    user: req.user._id,
    order: orderId,
    paymentMethod,
    amount,
    paidAt: Date.now(),
  });

  const createdPayment = await payment.save();
  res.status(201).json(createdPayment);
});

// Get payment status by Order ID
const getPaymentStatus = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ order: req.params.orderId }).populate('user', 'name email');

  if (payment) {
    res.json({
      status: payment.status,
      paidAt: payment.paidAt,
      amount: payment.amount,
    });
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});

// Verify payment via Razorpay webhook
const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId, orderId } = req.body;

  const payment = await Payment.findOne({ order: orderId });

  if (payment && payment.paymentId === paymentId) {
    payment.isVerified = true;
    await payment.save();
    res.status(200).json({ message: 'Payment verified' });
  } else {
    res.status(400).json({ message: 'Payment verification failed' });
  }
});

module.exports = {
  processPayment,
  getPaymentStatus,
  verifyPayment,
};
