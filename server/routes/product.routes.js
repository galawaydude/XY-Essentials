const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');
const { productSchema } = require('../validations/product.validator.js');
const validateRequest = require('../middlewares/validate.middleware.js');
const { getProductReviews, addReview, updateReview, deleteReview } = require('../controllers/review.controller.js');
const { upload } = require('../middlewares/multer.middleware.js');

// User Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, addReview);
router.post('/:id/reviews/:id', protect, updateReview);

// Admin Routes
router.post('/', upload.fields([{ name: 'productImages' }]), createProduct);
router.put('/:id', upload.fields([{ name: 'productImages' }]), updateProduct);
router.delete('/:id', deleteProduct);



module.exports = router;
