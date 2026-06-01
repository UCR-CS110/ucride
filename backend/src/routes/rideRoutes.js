const express = require('express');
const { createRide, getRides, updateRideStatus, updateRide, deleteRide, requestRide, getRideRequests, updateRequestStatus,  } = require('../controllers/rideController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('verified_driver', 'admin'), createRide);
router.get('/', protect, getRides);
router.put('/:id/status', protect, authorize('verified_driver', 'admin'), updateRideStatus);
router.put('/:id', protect, authorize('verified_driver', 'admin'), updateRide);
router.delete('/:id', protect, authorize('verified_driver', 'admin'), deleteRide);
router.post("/:id/request", protect, requestRide);
router.get("/requests", protect, getRideRequests);
router.put("/requests/:id/status", protect, updateRequestStatus);

module.exports = router;