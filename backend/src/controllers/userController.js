const User = require('../models/User');
const bcrypt = require("bcryptjs");
const Ride = require("../models/Ride");
const Review = require("../models/Review");

exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { fName, lName, profilePicture, vehicle } = req.body;

    if (fName) user.fName = fName;
    if (lName) user.lName = lName;
    if (profilePicture) user.profilePicture = profilePicture;
    if (vehicle) {
      user.vehicle = {
        vehicleMake: vehicle.vehicleMake ?? user.vehicle?.vehicleMake,
        vehicleModel: vehicle.vehicleModel ?? user.vehicle?.vehicleModel,
        vehicleColor: vehicle.vehicleColor ?? user.vehicle?.vehicleColor,
        licensePlate: vehicle.licensePlate ?? user.vehicle?.licensePlate,
      };
    }

    await user.save();
    res.status(200).json({ success: true, data: user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const ridesGiven = await Ride.countDocuments({
      driverId: user._id,
      status: "completed",
    });

    const reviews = await Review.find({
      revieweeId: user._id,
      isHidden: false,
    }).populate(
      "reviewerId",
      "fName lName profilePicture"
    );

    const avgRating =
      reviews.length > 0
        ? reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / reviews.length
        : 0;

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        stats: {
          ridesGiven,
          reviewCount: reviews.length,
          avgRating,
        },
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    user.profilePicture = `http://localhost:5000/uploads/${req.file.filename}`;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
