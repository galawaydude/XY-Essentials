const asyncHandler = require('express-async-handler');
const Payment = require('../models/payment.model');
const {razorpayInstance} = require('../config/razorpayConfig');

// Process a new payment
const processRazorpay = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  // Log the incoming request body
  console.log("Received request to create Razorpay order:", req.body);

  // Create a new order in Razorpay
  const options = {
    amount: amount * 100, // Amount in paise
    currency: "INR",
    receipt: "receipt#1",
    payment_capture: 1, 
  };

  console.log("Order options:", options); // Log the options being sent to Razorpay

  try {
    const order = await razorpayInstance.orders.create(options);
    console.log("Order created successfully:", order); // Log the order details
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error); // Log the error
    res.status(500).json({ message: "Error creating order" });
  }
});


const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod, amount } = req.body;

  // Logic to save payment details
  const payment = new Payment({
    user: req.user._id,
    order: orderId,
    paymentMethod,
    amount,
    paidAt: Date.now(),
  });

  await payment.save();
  res.status(201).json(payment);
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

module.exports = {
  processRazorpay,
  getPaymentStatus,
  verifyPayment,
};
