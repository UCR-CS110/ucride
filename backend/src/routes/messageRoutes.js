const express = require('express');
const { sendMessage, getConversation } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversation', protect, getConversation);

module.exports = router;