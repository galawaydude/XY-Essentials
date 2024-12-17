const asyncHandler = require('express-async-handler');
const Address = require('../models/address.model');

// Get all addresses for a user
const getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
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
  // Log the incoming request body
  console.log('Incoming request body:', req.body);

  const isDefault = req.body.isDefault;

  if (isDefault) {
    // If it's default, set all other addresses for this user to not default
    await Address.updateMany(
      { user: req.user._id, isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  // Create a new address object
  const newAddress = new Address({
    ...req.body,
    user: req.user._id,
  });

  // Log the address object before saving
  console.log('Address object to be saved:', newAddress);

  // Save the address
  const createdAddress = await newAddress.save();

  // Log the created address
  console.log('Created address:', createdAddress);

  res.status(201).json(createdAddress);
});

// Update an existing address
const updateAddress = asyncHandler(async (req, res) => {
  const { isDefault, ...updateFields } = req.body; // Destructure isDefault and other fields

  const updatedAddress = await Address.findById(req.params.id);

  if (updatedAddress && updatedAddress.user.equals(req.user._id)) {
    // If isDefault is set to true, update others to not default
    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id, isDefault: true, _id: { $ne: updatedAddress._id } },
        { $set: { isDefault: false } }
      );
    }

    // Update the address fields, including the isDefault property
    Object.assign(updatedAddress, updateFields, { isDefault });

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
    await address.deleteOne();
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
