const express = require('express');
const { register, login, logout, googleAuth } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/logout', logout);

module.exports = router;