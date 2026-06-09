const Ride = require("../models/Ride");
const User = require("../models/User");
const Review = require("../models/Review");

exports.createRide = async (req, res) => {
  try {
    req.body.driverId = req.user.id;
    const ride = await Ride.create(req.body);
    res.status(201).json({ success: true, data: ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRides = async (req, res) => {
  try {
    const { departureLocation, destination, date, price, driverId } = req.query;
    let query = {};

    if (departureLocation)
      query.departureLocation = { $regex: departureLocation, $options: "i" };
    if (destination) query.destination = { $regex: destination, $options: "i" };
    if (price) query.seatPrice = { $lte: Number(price) };
    if (driverId) query.driverId = driverId;
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.departureTime = { $gte: searchDate, $lt: nextDay };
    }

    let rides = await Ride.find(query)
      .populate("driverId", "fName lName avgRating profilePictureUrl")
      .lean();

    rides = rides.map(r => ({
      ...r,
      requests: r.requests || []
    }));

    return res.status(200).json({
      success: true,
      count: rides.length,
      data: rides,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.driverId.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this ride" });
    }

    const updatedRide = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedRide });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.driverId.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this ride" });
    }

    await ride.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.requestRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const userId = (req.user._id || req.user.id).toString();

    const alreadyRequested = ride.requests.some(
      (r) => r.userId.toString() === userId
    );

    if (alreadyRequested) {
      return res.status(400).json({ message: "Already requested this ride" });
    }

    ride.requests.push({
      userId,
      status: "pending",
    });

    await ride.save();

    res.status(200).json({
      success: true,
      message: "Ride requested successfully",
      data: ride,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getRideRequests = async (req, res) => {
  try {
    const rides = await Ride.find({ driverId: req.user.id })
      .populate("requests.userId", "fName lName profilePicture avgRating");

    const allRequests = rides.flatMap((ride) =>
      ride.requests.map((r) => ({
        _id: r._id,
        status: r.status,
        createdAt: r.createdAt,
        riderId: r.userId,
        rideId: {
          _id: ride._id,
          departureLocation: ride.departureLocation,
          destination: ride.destination,
          departureTime: ride.departureTime,
          seatPrice: ride.seatPrice,
        },
      }))
    );

    res.json({ success: true, data: allRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ride = await Ride.findById(req.params.id)
      .populate("requests.userId", "fName lName profilePicture avgRating");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (
      ride.driverId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    ride.status = status;

    if (status === "completed") {
      ride.completedAt = new Date();

      ride.reviewTargets = ride.requests
        .filter(r => r.status === "accepted")
        .map(r => ({
          userId: r.userId, 
          reviewed: false
        }));
    }

    await ride.save();

    const updatedRide = await Ride.findById(ride._id)
      .populate("requests.userId", "fName lName profilePicture avgRating");

    return res.status(200).json({
      success: true,
      data: updatedRide
    });

  } catch (error) {
    console.error("updateRideStatus error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ride = await Ride.findOne({ "requests._id": id });

    if (!ride) return res.status(404).json({ message: "Request not found" });

    const request = ride.requests.id(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (status === "accepted") {
      request.status = "accepted";

      if (ride.remainingSeats > 0) {
        ride.remainingSeats -= 1;
      }
    } else if (status === "declined") {
      request.status = "declined";
    } else {
      request.status = status;
    }

    await ride.save();

    return res.json({
      success: true,
      data: request,
      remainingSeats: ride.remainingSeats
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyAcceptedRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      requests: {
        $elemMatch: {
          userId: req.user.id,
          status: "accepted"
        }
      }
    }).populate("driverId", "fName lName avgRating profilePicture");

    const reviews = await Review.find({
      reviewerId: req.user.id
    });

    const result = rides.map((ride) => {
      const reviewed = reviews.some(
        (r) =>
          r.rideId?.toString() === ride._id.toString() &&
          r.revieweeId?.toString() === ride.driverId._id.toString()
      );

      return {
        ...ride.toObject(),
        reviewed
      };
    });

    return res.json({
      success: true,
      data: result
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};