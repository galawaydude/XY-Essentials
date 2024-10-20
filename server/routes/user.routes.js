const express = require('express');
const passport = require('passport');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUsers } = require('../controllers/user.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');
const { getUserAddresses, createAddress, updateAddress, deleteAddress } = require('../controllers/address.controller.js');
const userValidator = require('../validations/user.validator.js');

// Protected Routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.get('/', protect, getUserAddresses);
router.post('/', protect, createAddress);
router.put('/:id', protect, updateAddress);
router.delete('/:id', protect, deleteAddress);

// Admin Routes
router.get('/', protect, admin, getUsers);

module.exports = router;
