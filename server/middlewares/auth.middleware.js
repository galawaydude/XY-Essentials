const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  console.log('Cookies:', req.cookies);
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded._id);

      console.log(req.user);
    } catch (error) {
      console.error(error);
      return res.redirect('/'); // Redirect on token verification failure
    }
  } else {
    return res.redirect('/'); // Redirect if no token found
  }
});

// Admin middleware (only for users with admin role)
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };
