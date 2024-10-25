const asyncHandler = require('express-async-handler');
const Address = require('../models/address.model');

// Get all addresses for a user
const getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: '67162ddff162c40b40be0062' });
  res.json(addresses);
});

// Get a specific address by ID
const getAddressById = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (address && address.user.equals(req.user._id)) {
    res.json(address);
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});

// Create a new address
const createAddress = asyncHandler(async (req, res) => {
  const newAddress = new Address({
    ...req.body, 
    // user = '67162ddff162c40b40be0062'
  });

  const createdAddress = await newAddress.save();
  res.status(201).json(createdAddress);
});


// Update an existing address
const updateAddress = asyncHandler(async (req, res) => {
  const { address, city, postalCode, country } = req.body;

  const updatedAddress = await Address.findById(req.params.id);

  if (updatedAddress && updatedAddress.user.equals(req.user._id)) {
    updatedAddress.address = address || updatedAddress.address;
    updatedAddress.city = city || updatedAddress.city;
    updatedAddress.postalCode = postalCode || updatedAddress.postalCode;
    updatedAddress.country = country || updatedAddress.country;

    const savedAddress = await updatedAddress.save();
    res.json(savedAddress);
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});

// Delete an address
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (address && address.user.equals(req.user._id)) {
    await address.remove();
    res.json({ message: 'Address removed' });
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});

module.exports = {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
