const asyncHandler = require('express-async-handler');
const Order = require('../models/order.model');

// Get all orders for a user
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// Create a new order
const placeOrder = asyncHandler(async (req, res) => {


    const order = new Order(req.body);

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
 
});

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// Update order status (Admin Only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = req.body.orderStatus || order.orderStatus;
    order.deliveredAt = req.body.orderStatus === 'Delivered' ? Date.now() : order.deliveredAt;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// Cancel an order (Admin Only)
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isCancelled = true;
    order.cancelledAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = {
  getUserOrders,
  placeOrder,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
