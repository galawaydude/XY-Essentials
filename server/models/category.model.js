const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // Category name
  description: { type: String },
  isActive: { type: Boolean, default: true },  // Is the category active or hidden
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },  // For nested categories (optional)
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
