const express = require('express');
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createRequest);
router.get('/', protect, getRequests);
router.put('/:id/status', protect, updateRequestStatus);

module.exports = router;