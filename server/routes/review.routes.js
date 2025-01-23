const express = require('express');
const router = express.Router();
const { getProductReviews, addReview, updateReview, deleteReview, getAllReviews } = require('../controllers/review.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');

// Public Routes
router.get('/product/:productId', getProductReviews);

// Admin Routes
router.get('/', protect, admin, getAllReviews);
router.delete('/:reviewId', protect, admin, deleteReview);

// User Routes
router.post('/', protect, addReview);
router.put('/:reviewId', protect, updateReview);
router.delete('/product/:productId/reviews/:reviewId', protect, deleteReview);

module.exports = router;
