const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Address'
  },
  paymentMethod: { type: String, required: true },  
  paymentStatus: { type: String, default: 'Pending' }, 
  subtotal: { type: Number, required: true },
  discount: { type: Number, required: true },
  shippingFee: { type: Number, required: true },
  finalPrice: { type: Number, required: true },
  shippingStatus: { type: String, required: true, default: 'Not yet shipped' },
  deliveredAt: { type: Date },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
