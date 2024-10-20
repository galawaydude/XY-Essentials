const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');
const { productSchema } = require('../validations/product.validator.js');
const validateRequest = require('../middlewares/validate.middleware.js');
const { getProductReviews, addReview, updateReview, deleteReview } = require('../controllers/review.controller.js');
const { upload } = require('../middlewares/multer.middleware.js');

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin Routes
router.post('/', upload.fields([{ name: 'productImages' }]), createProduct);
router.put('/:id',upload.fields([{ name: 'productImages' }]), updateProduct);
router.delete('/:id', deleteProduct);

router.get('/:id/reviews', getProductReviews);

router.post('/:id/reviews', addReview);
router.post('/:id/reviews/:id', updateReview);

module.exports = router;
