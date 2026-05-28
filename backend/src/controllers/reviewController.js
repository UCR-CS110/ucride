const Review = require('../models/Review');
const User = require('../models/User');

exports.createReview = async (req, res) => {
  try {
    req.body.reviewerId = req.user.id;
    
    const existingReview = await Review.findOne({
        rideId: req.body.rideId,
        reviewerId: req.user.id,
        revieweeId: req.body.revieweeId
    });

    if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this user for this ride' });
    }

    const review = await Review.create(req.body);
    const reviews = await Review.find({ revieweeId: req.body.revieweeId });
    const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
    
    await User.findByIdAndUpdate(req.body.revieweeId, { avgRating });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const query = { isHidden: false };
    if (req.query.userId) {
        query.revieweeId = req.query.userId;
    }
    
    const reviews = await Review.find(query).populate('reviewerId', 'fName lName profilePictureUrl');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};