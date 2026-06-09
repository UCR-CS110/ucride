const Review = require('../models/Review');
const User = require('../models/User');
const Ride = require("../models/Ride");

exports.createReview = async (req, res) => {
  try {
    req.body.reviewerId = req.user.id;
    
    
    const existingReview = await Review.findOne({
        rideId: req.body.rideId,
        reviewerId: req.user.id,
        revieweeId: req.body.revieweeId
    });

    if (!req.body.revieweeId) {
      return res.status(400).json({ message: "revieweeId missing" });
    }
    
    if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this user for this ride' });
    }

    const review = await Review.create(req.body);

    await Ride.updateOne(
      {
        _id: req.body.rideId,
        "requests.userId": req.user.id
      },
      {
        $set: {
          "requests.$.reviewGiven": true
        }
      }
    );

    const reviews = await Review.find({ revieweeId: req.body.revieweeId });

    const avgRating = reviews.length === 0 ? 0 : reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    
    await User.findByIdAndUpdate(req.body.revieweeId, { avgRating });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);
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


exports.getCompletedRidesForUser = async (req, res) => {
  try {
    const rides = await Ride.find({
      status: "completed",
      "requests.userId": req.user.id,
      "requests.reviewGiven": { $ne: true }
    });

    res.json({ success: true, data: rides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.getPendingReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const rides = await Ride.find({
      status: "completed",
      $or: [
        { driverId: userId },
        { "requests.riderId": userId, "requests.status": "accepted" }
      ]
    }).populate("driverId").populate("requests.riderId");

    let reviewTargets = [];

    for (let ride of rides) {
      const isDriver = ride.driverId._id.toString() === userId;

      if (isDriver) {
        const acceptedRiders = ride.requests.filter(r => r.status === "accepted");

        for (let r of acceptedRiders) {
          const exists = await Review.findOne({
            rideId: ride._id,
            reviewerId: userId,
            revieweeId: r.riderId._id
          });

          if (!exists) {
            reviewTargets.push({
              rideId: ride._id,
              user: r.riderId,
              role: "rider"
            });
          }
        }
      } else {
        const exists = await Review.findOne({
          rideId: ride._id,
          reviewerId: userId,
          revieweeId: ride.driverId._id
        });

        if (!exists) {
          reviewTargets.push({
            rideId: ride._id,
            user: ride.driverId,
            role: "driver"
          });
        }
      }
    }

    res.json({ success: true, data: reviewTargets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};