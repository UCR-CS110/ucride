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
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['driver', 'rider', 'admin'], 
    required: true 
  },
  profilePictureUrl: { 
    type: String 
  },
  avgRating: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  vehicle: {
    make: { 
      type: String 
    },
    model: { 
      type: String 
    },
    color: { 
      type: String 
    },
    licensePlate: { 
      type: String 
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

