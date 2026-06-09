const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  res.status(statusCode).cookie('jwt', token, options).json({
    success: true,
    token,
    user: {
      _id: user._id,
      fName: user.fName,
      lName: user.lName,
      email: user.email,
      role: user.role
    }
  });
};

exports.register = async (req, res) => {
  try {
    const { fName, lName, email, password, role } = req.body;

    if (!email.endsWith('@ucr.edu')) {
      return res.status(400).json({ message: 'Only @ucr.edu emails are allowed' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const allowedRoles = ['user', 'verified_driver', 'admin'];
    const assignedRole = (role && allowedRoles.includes(role)) ? role : 'user';

    const user = await User.create({
      fName,
      lName,
      email,
      password: hashedPassword,
      role: assignedRole
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Provide an email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Missing Google credential' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Google sign-in is not configured on the server' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid Google credential' });
    }

    const { email, email_verified, given_name, family_name, sub } = payload;

    if (!email || !email_verified) {
      return res.status(401).json({ message: 'Google account email is not verified' });
    }

    if (!email.endsWith('@ucr.edu')) {
      return res.status(400).json({ message: 'Only @ucr.edu emails are allowed' });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = sub;
        await user.save();
      }
    } else {
      user = await User.create({
        fName: given_name || 'UCR',
        lName: family_name || 'User',
        email,
        googleId: sub,
        role: 'user'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};