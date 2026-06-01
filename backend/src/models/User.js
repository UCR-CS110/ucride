const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fName: { 
    type: String, 
    required: true 
  },
  lName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    match: /@ucr\.edu$/ 
  },
  profilePicture: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['user', 'verified_driver', 'admin'],
    required: true
  },
  avgRating: {
    type: Number,
    min: 1,
    max: 5
  },
  vehicle: {
    vehicleMake: { 
      type: String 
    },
    vehicleModel: { 
      type: String 
    },
    vehicleColor: { 
      type: String 
    },
    licensePlate: { 
      type: String 
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

