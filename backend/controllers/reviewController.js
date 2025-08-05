// backend/controllers/reviewController.js

const Review = require('../models/Review');

// ✅ Add Review
exports.addReview = async (req, res) => {
  const { reviewedUserId, rating, comment } = req.body;
  try {
    const review = await Review.create({
      reviewer: req.user._id,
      reviewedUser: reviewedUserId,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to add review", error });
  }
};

// ✅ Get Reviews for a User
exports.getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.query.userId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
};
