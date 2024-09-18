const express = require('express');
const router = express.Router();
const { getProductReviews, addReview, updateReview, deleteReview } = require('../controllers/review.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

// Public Routes
router.get('/product/:productId', getProductReviews);

// Protected Routes
router.post('/', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
