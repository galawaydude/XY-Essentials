const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken.js');
const passport = require('passport');

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



module.exports = {
  getUserProfile,
  updateUserProfile,
  getUsers
};
