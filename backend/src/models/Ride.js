const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  departureLocation: { 
    type: String, 
    required: true 
  },
  destination: { 
    type: String, 
    required: true 
  },
  departureTime: { 
    type: Date, 
    required: true 
  },
  remainingSeats: { 
    type: Number, 
    required: true 
  },
  seatPrice: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['open', 'full', 'inprogress', 'completed'], 
    default: 'open' 
  },
  requests: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, default: "pending" } // pending, accepted, rejected
    }
  ],
  reviewTargets: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reviewed: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
