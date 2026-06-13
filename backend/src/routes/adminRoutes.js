const express = require('express');
const { 
  getAllUsers, updateUser, deleteUser, verifyDriver, 
  moderateReview, deleteReview, getAllRides, getAnalytics,
  getAllReviews
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/verify', verifyDriver);

router.get('/reviews', getAllReviews);
router.put('/reviews/:id/moderate', moderateReview);
router.delete('/reviews/:id', deleteReview);

router.get('/rides', getAllRides);
router.get('/analytics', getAnalytics);

module.exports = router;