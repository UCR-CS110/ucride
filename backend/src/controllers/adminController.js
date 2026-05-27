const User = require('../models/User');
const Review = require('../models/Review');
const Ride = require('../models/Ride');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyDriver = async (req, res) => {
  try {
    const { makeDriver } = req.body;
    const newRole = makeDriver ? 'verified_driver' : 'user';
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: newRole },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.moderateReview = async (req, res) => {
  try {
    const { isHidden } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { isHidden }, { new: true });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find().populate('driverId', 'fName lName email');
    res.status(200).json({ success: true, count: rides.length, data: rides });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('reviewerId', 'fName lName')
      .populate('revieweeId', 'fName lName');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRides = await Ride.countDocuments();
    
    const rides = await Ride.find();
    const routeCounts = {};
    rides.forEach(r => {
      const key = `${r.departureLocation} to ${r.destination}`;
      routeCounts[key] = (routeCounts[key] || 0) + 1;
    });

    const topRoutes = Object.entries(routeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const topDrivers = await User.find({ role: 'verified_driver' }).sort({ avgRating: -1 }).limit(5).select('fName lName avgRating');

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRides,
        topRoutes: topRoutes.map(r => ({ route: r[0], count: r[1] })),
        topDrivers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};