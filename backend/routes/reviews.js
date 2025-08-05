const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware'); // ✅ FIXED import

// Add review (only for logged-in users)
router.post('/', protect, reviewController.addReview);

// Get reviews for a user
router.get('/', reviewController.getReviewsForUser);

module.exports = router;
