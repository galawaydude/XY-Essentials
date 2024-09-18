const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },  // Categories like skincare, facewash, etc.
  stock: { type: Number, required: true },  // Inventory management
  images: [{ type: String, required: true }],  // Array of image URLs
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
