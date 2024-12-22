const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken.js');
//  

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user) {
    // res.json({
    //     _id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     isAdmin: user.isAdmin,
    // });
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Get all users (Admin only)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});


// Clerk

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from Clerk
    const clerkUsers = await clerkClient.users.getUserList();

    // Fetch custom data from MongoDB
    const mongoUsers = await User.find();

    // Combine Clerk data with MongoDB data
    const combinedUsers = clerkUsers.map(clerkUser => {
      const mongoUser = mongoUsers.find(user => user.clerkId === clerkUser.id);
      return {
        id: clerkUser.id,
        name: clerkUser.firstName + ' ' + clerkUser.lastName,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        addresses: mongoUser?.addresses || [],
        orders: mongoUser?.orders || [],
        createdAt: clerkUser.createdAt,
      };
    });

    res.status(200).json(combinedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
};

// Fetch a particular user by clerkId
const getUserById = async (req, res) => {
  const { clerkId } = req.params;

  try {
    // Fetch user from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkId);

    // Fetch custom data from MongoDB
    const mongoUser = await User.findOne({ clerkId }).populate('orders addresses');

    // Combine Clerk data with MongoDB data
    const user = {
      id: clerkUser.id,
      name: clerkUser.firstName + ' ' + clerkUser.lastName,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      addresses: mongoUser?.addresses || [],
      orders: mongoUser?.orders || [],
      createdAt: clerkUser.createdAt,
    };

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(404).send('User not found');
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUsers,
  getAllUsers, 
  getUserById
};
