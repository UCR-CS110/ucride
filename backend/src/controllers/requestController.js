const Request = require('../models/Request');
const Ride = require('../models/Ride');

exports.createRequest = async (req, res) => {
  try {
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.remainingSeats <= 0) {
      return res.status(400).json({ message: 'No seats available' });
    }

    const request = await Request.create({
      rideId,
      riderId: req.user.id
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const rides = await Ride.find({
      "requests.userId": req.user.id
    });

    const requests = rides.flatMap(ride =>
      ride.requests
        .filter(r => r.userId.toString() === req.user.id)
        .map(r => ({
          _id: r._id,
          status: r.status,
          rideId: {
            _id: ride._id,
            departureLocation: ride.departureLocation,
            destination: ride.destination,
            departureTime: ride.departureTime,
            seatPrice: ride.seatPrice,
          }
        }))
    );

    return res.json({
      success: true,
      data: requests
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const ride = await Ride.findById(request.rideId);

    if (ride.driverId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    if (status === 'accepted') {
      if (ride.remainingSeats <= 0) {
        return res.status(400).json({ message: 'No remaining seats to accept request' });
      }
      ride.remainingSeats -= 1;
      await ride.save();
    } else if (status === 'declined' && request.status === 'accepted') {
       ride.remainingSeats += 1;
       await ride.save();
    }

    request.status = status;
    await request.save();

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};