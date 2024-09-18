const mongoose = require('mongoose');
const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  // Reference to product
  quantityInStock: { type: Number, required: true },  // Number of units available
  lowStockThreshold: { type: Number, default: 10 },  // Notification when stock goes below this value
}, { timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
