const asyncHandler = require('express-async-handler');
const Review = require('../models/review.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');

// Get all reviews
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
  .populate('product', 'name')
  .populate('user', 'name');
  res.json(reviews);
});

// Get all reviews for a product
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
  .populate('product', 'name')
  .populate('user', 'name')
    .sort({ createdAt: -1 });
    // console.log(reviews);
  res.json(reviews);
});

// Add a review
const addReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);

  // Create a new review with the productId included
  const review = new Review({
    ...req.body,        // Spread the existing body data
    user: user._id,     // Set the user field
    product: id  // Set the product field
  });

  const createdReview = await review.save();

  await Product.findByIdAndUpdate(id, {
    $push: { reviews: createdReview._id }
  });

  res.status(201).json(createdReview);
});

// Update a review
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if the user is the owner of the review
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this review');
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  const updatedReview = await review.save();

  // Populate user info before sending response
  await updatedReview.populate('user', 'name');
  res.json(updatedReview);
});

// Delete a review
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // If user is not admin, check if they own the review
  if (!req.user.isAdmin && review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  // Remove review reference from product
  if (review.product) {
    await Product.findByIdAndUpdate(review.product, {
      $pull: { reviews: reviewId }
    });
  }

  await review.deleteOne();
  res.json({ message: 'Review removed' });
});

module.exports = {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  getAllReviews
};
