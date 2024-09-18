const express = require('express');
const router = express.Router();
const { getUserAddresses, createAddress, updateAddress, deleteAddress } = require('../controllers/address.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

// Protected Routes
router.get('/', protect, getUserAddresses);
router.post('/', protect, createAddress);
router.put('/:id', protect, updateAddress);
router.delete('/:id', protect, deleteAddress);

module.exports = router;
