const asyncHandler = require('express-async-handler');
const Coupon = require('../models/coupon.model');

// Get all coupons (Admin only)
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
});

// Apply a coupon (Public route, no authentication)
const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const coupon = await Coupon.findOne({ code });

  if (coupon) {
    // You might want to add additional logic here to check if the coupon is valid, not expired, etc.
    res.json(coupon);
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// Create a new coupon (Admin only)
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, expiresAt } = req.body;

  const coupon = new Coupon({
    code,
    discount,
    expiresAt,
  });

  const createdCoupon = await coupon.save();
  res.status(201).json(createdCoupon);
});

// Update a coupon (Admin only)
const updateCoupon = asyncHandler(async (req, res) => {
  const { code, discount, expiresAt } = req.body;

  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    coupon.code = code || coupon.code;
    coupon.discount = discount || coupon.discount;
    coupon.expiresAt = expiresAt || coupon.expiresAt;

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// Delete a coupon (Admin only)
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    await coupon.remove();
    res.json({ message: 'Coupon removed' });
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

module.exports = {
  getAllCoupons,
  applyCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
