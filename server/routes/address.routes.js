const express = require('express');
const router = express.Router();
const { getUserAddresses, createAddress, updateAddress, deleteAddress } = require('../controllers/address.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');

router.post('/', protect, createAddress);
router.put('/:id', protect, updateAddress);
router.delete('/:id', protect, deleteAddress);

router.get('/', protect, admin, getUserAddresses);

module.exports = router;