const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },  // To differentiate between customer and admin
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],  // Reference to Order model
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Reference to Product model
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
