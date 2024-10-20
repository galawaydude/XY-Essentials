const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },  
  paymentId: { type: String, required: true },  // Razorpay payment ID
  status: { type: String, required: true },  // 'Completed', 'Failed', etc.
  amount: { type: Number, required: true },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
