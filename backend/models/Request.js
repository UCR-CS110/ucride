const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  rideId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ride', 
    required: true 
  },
  riderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined', 'inprogress'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
