const express = require('express');
const { createReview, getReviews, getCompletedRidesForUser, getPendingReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/', protect, getReviews);
router.get("/pending", protect, getCompletedRidesForUser);
router.get("/pending", protect, getPendingReviews);

module.exports = router;