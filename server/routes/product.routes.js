const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin Routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
