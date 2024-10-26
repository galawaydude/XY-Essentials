const asyncHandler = require('express-async-handler');
const Order = require('../models/order.model');

// Get all orders for a user
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: '67162ddff162c40b40be0062' });
  res.json(orders);
});

// Create a new order
const placeOrder = asyncHandler(async (req, res) => {
  console.log('Request Body:', req.body); // Log the request body
  console.log('User Info:', req.user); // Log user information

  try {
      const orderData = {
          ...req.body, 
          user: '67162ddff162c40b40be0062', // Add the user's ID
      };

      console.log('Order Data:', orderData); // Log the combined order data

      const order = new Order(orderData); // Create a new order with the combined data

      const createdOrder = await order.save(); // Save the order to the database

      console.log('Created Order:', createdOrder); // Log the created order
      res.status(201).json(createdOrder); // Respond with the created order
  } catch (error) {
      console.error('Error creating order:', error); // Log any errors that occur
      res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});


// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email')
  .populate('orderItems.product') 
  .populate('shippingAddress');

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
