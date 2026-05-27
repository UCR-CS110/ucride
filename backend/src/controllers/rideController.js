const Ride = require("../models/Ride");
const User = require("../models/User");

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

    let rides = await Ride.find(query).populate(
      "driverId",
      "fName lName avgRating profilePictureUrl",
    );

    res.status(200).json({ success: true, count: rides.length, data: rides });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.driverId.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this ride" });
    }

    ride.status = status;
    await ride.save();

    res.status(200).json({ success: true, data: ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
