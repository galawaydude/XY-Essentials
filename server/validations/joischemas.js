const Joi = require('joi');

// User Registration Schema
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
});

// User Login Schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// Product Creation Schema
const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().min(10).required(),
  quantity: Joi.number().integer().min(0).required(),
  category: Joi.string().required(),
});

// Cart Item Schema
const cartItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

// Checkout Schema
const checkoutSchema = Joi.object({
  addressId: Joi.string().required(),
  paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'razorpay').required(),
});

// Export all schemas
module.exports = {
  registerSchema,
  loginSchema,
  productSchema,
  cartItemSchema,
  checkoutSchema,
};
