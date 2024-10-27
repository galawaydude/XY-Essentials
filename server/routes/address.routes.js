const express = require('express');
const router = express.Router();
const { getUserAddresses, createAddress, updateAddress, deleteAddress } = require('../controllers/address.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

router.get('/', protect, getUserAddresses)
router.post('/', protect, createAddress)

module.exports = router;
