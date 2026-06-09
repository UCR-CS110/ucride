#!/bin/bash
set -e

BACKEND_DIR="$(cd "$(dirname "$0")/backend" && pwd)"
cd "$BACKEND_DIR"

node << 'NODEJS'
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const User    = require('./src/models/User');
const Ride    = require('./src/models/Ride');
const Request = require('./src/models/Request');
const Review  = require('./src/models/Review');
const Message = require('./src/models/Message');

async function populate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  console.log('Database name:', mongoose.connection.db.databaseName);

  await Promise.all([
    User.deleteMany({}),
    Ride.deleteMany({}),
    Request.deleteMany({}),
    Review.deleteMany({}),
    Message.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // --- Users ---
  const salt      = await bcrypt.genSalt(10);
  const pass      = await bcrypt.hash('password123', salt);
  const adminPass = await bcrypt.hash('admin123', salt);

  const [alice, bob, carol, dave, eve, frank] = await User.insertMany([
    {
      fName: 'Alice', lName: 'Chen',
      email: 'alice.chen@ucr.edu',
      password: pass,
      role: 'verified_driver',
      vehicle: { make: 'Toyota', model: 'Camry', color: 'Blue', licensePlate: 'ABC1234' },
    },
    {
      fName: 'Bob', lName: 'Martinez',
      email: 'bob.martinez@ucr.edu',
      password: pass,
      role: 'verified_driver',
      vehicle: { make: 'Honda', model: 'Civic', color: 'Silver', licensePlate: 'XYZ5678' },
    },
    {
      fName: 'Carol', lName: 'Kim',
      email: 'carol.kim@ucr.edu',
      password: pass,
      role: 'user',
    },
    {
      fName: 'Dave', lName: 'Patel',
      email: 'dave.patel@ucr.edu',
      password: pass,
      role: 'user',
    },
    {
      fName: 'Eve', lName: 'Johnson',
      email: 'eve.johnson@ucr.edu',
      password: pass,
      role: 'user',
    },
    {
      fName: 'Frank', lName: 'Rivera',
      email: 'frank.rivera@ucr.edu',
      password: adminPass,
      role: 'admin',
    },
  ]);
  console.log('Created 6 users');

  // --- Rides ---
  const now    = new Date();
  const past   = (h) => new Date(now - h * 3_600_000);
  const future = (h) => new Date(now.getTime() + h * 3_600_000);

  const UCR_CAMPUS      = { name: 'UC Riverside Campus, Riverside, CA', lat: 33.9737, lng: -117.3281 };
  const DOWNTOWN_RIV    = { name: 'Downtown Riverside, Riverside, CA',   lat: 33.9806, lng: -117.3755 };
  const CANYON_CREST    = { name: 'Canyon Crest Drive, Riverside, CA',   lat: 33.9643, lng: -117.3114 };
  const UNIVERSITY_AVE  = { name: 'University Avenue, Riverside, CA',    lat: 33.9750, lng: -117.3619 };
  const CORONA          = { name: 'Corona, CA',                           lat: 33.8753, lng: -117.5664 };
  const ONTARIO_AIRPORT = { name: 'Ontario International Airport, Ontario, CA', lat: 34.0559, lng: -117.6009 };

  const [ride1, ride2, ride3, ride4] = await Ride.insertMany([
    {
      driverId: alice._id,
      departureLocation: UCR_CAMPUS,
      destination: DOWNTOWN_RIV,
      departureTime: past(48),
      remainingSeats: 0,
      seatPrice: 5,
      status: 'completed',
      requests: [
        { userId: carol._id, status: 'accepted' },
        { userId: dave._id,  status: 'accepted' },
      ],
    },
    {
      driverId: alice._id,
      departureLocation: CANYON_CREST,
      destination: UCR_CAMPUS,
      departureTime: future(24),
      remainingSeats: 3,
      seatPrice: 4,
      status: 'open',
      requests: [
        { userId: carol._id, status: 'pending' },
        { userId: eve._id,   status: 'pending' },
      ],
    },
    {
      driverId: bob._id,
      departureLocation: UNIVERSITY_AVE,
      destination: CORONA,
      departureTime: past(72),
      remainingSeats: 0,
      seatPrice: 8,
      status: 'completed',
      requests: [
        { userId: eve._id, status: 'accepted' },
      ],
    },
    {
      driverId: bob._id,
      departureLocation: UCR_CAMPUS,
      destination: ONTARIO_AIRPORT,
      departureTime: past(1),
      remainingSeats: 1,
      seatPrice: 15,
      status: 'inprogress',
      requests: [
        { userId: dave._id, status: 'accepted' },
      ],
    },
  ]);
  console.log('Created 4 rides');

  // --- Requests ---
  await Request.insertMany([
    { rideId: ride1._id, riderId: carol._id, status: 'accepted' },
    { rideId: ride1._id, riderId: dave._id,  status: 'accepted' },
    { rideId: ride3._id, riderId: eve._id,   status: 'accepted' },
    { rideId: ride2._id, riderId: carol._id, status: 'pending' },
    { rideId: ride2._id, riderId: eve._id,   status: 'pending' },
    { rideId: ride4._id, riderId: dave._id,  status: 'inprogress' },
  ]);
  console.log('Created 6 requests');

  // --- Reviews (only for completed rides) ---
  await Review.insertMany([
    { rideId: ride1._id, reviewerId: carol._id, revieweeId: alice._id, rating: 5, content: 'Great driver, very punctual!' },
    { rideId: ride1._id, reviewerId: dave._id,  revieweeId: alice._id, rating: 4, content: 'Smooth ride, great music.' },
    { rideId: ride1._id, reviewerId: alice._id, revieweeId: carol._id, rating: 5, content: 'Excellent passenger!' },
    { rideId: ride1._id, reviewerId: alice._id, revieweeId: dave._id,  rating: 5, content: 'Very respectful, would ride again.' },
    { rideId: ride3._id, reviewerId: eve._id,   revieweeId: bob._id,   rating: 3, content: 'Decent ride, a bit late though.' },
    { rideId: ride3._id, reviewerId: bob._id,   revieweeId: eve._id,   rating: 4, content: 'Good passenger, easy going.' },
  ]);
  console.log('Created 6 reviews');

  // Update avgRating: alice 4.5, bob 3, carol 5, dave 5, eve 4
  await Promise.all([
    User.findByIdAndUpdate(alice._id, { avgRating: 4.5 }),
    User.findByIdAndUpdate(bob._id,   { avgRating: 3   }),
    User.findByIdAndUpdate(carol._id, { avgRating: 5   }),
    User.findByIdAndUpdate(dave._id,  { avgRating: 5   }),
    User.findByIdAndUpdate(eve._id,   { avgRating: 4   }),
  ]);
  console.log('Updated avgRatings');

  // --- Messages ---
  await Message.insertMany([
    { senderId: carol._id, rideId: ride1._id, content: 'Are we still on for the ride tomorrow?' },
    { senderId: alice._id, rideId: ride1._id, content: "Yes! I'll pick you up at the main entrance." },
    { senderId: dave._id,  rideId: ride1._id, content: 'Where exactly should I wait for pickup?' },
    { senderId: alice._id, rideId: ride1._id, content: 'Meet me at the Lot 30 parking structure.' },
    { senderId: eve._id,   rideId: ride3._id, content: 'Can you accommodate one extra bag?' },
    { senderId: bob._id,   rideId: ride3._id, content: 'Sure, I have space in the trunk.' },
  ]);
  console.log('Created 6 messages');

  console.log('\n=== Populate complete ===');
  console.log('Credentials (password: password123 unless noted):');
  console.log('  alice.chen@ucr.edu     — verified_driver');
  console.log('  bob.martinez@ucr.edu   — verified_driver');
  console.log('  carol.kim@ucr.edu      — user');
  console.log('  dave.patel@ucr.edu     — user');
  console.log('  eve.johnson@ucr.edu    — user');
  console.log('  frank.rivera@ucr.edu   — admin (password: admin123)');

  await mongoose.disconnect();
}

populate().catch((err) => {
  console.error('Populate failed:', err.message);
  process.exit(1);
});
NODEJS
