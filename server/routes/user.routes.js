const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, updateUserProfile, getUsers} = require('../controllers/user.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');

// Public Routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Protected Routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin Routes
router.get('/', protect, admin, getUsers);
// router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
