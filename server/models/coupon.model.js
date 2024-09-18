const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },  // Unique coupon code
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },  // Percentage or fixed amount
  discountValue: { type: Number, required: true },  // The discount amount (either a percentage or fixed value)
  expirationDate: { type: Date, required: true },  // When the coupon expires
  minimumPurchaseAmount: { type: Number, default: 0 },  // Minimum amount for applying the coupon
  maxDiscountAmount: { type: Number },  // Max cap on discount (optional for percentage-based coupons)
  usageLimit: { type: Number, default: 1 },  // Limit the number of times a coupon can be used
  isActive: { type: Boolean, default: true },  // Whether the coupon is active or not
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
