const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User model
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  // Reference to Product
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  paymentMethod: { type: String, required: true },  // E.g., 'Credit Card', 'UPI', etc.
  paymentStatus: { type: String, default: 'Pending' },  // 'Paid', 'Pending', 'Failed'
  totalPrice: { type: Number, required: true },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
