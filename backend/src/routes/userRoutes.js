const express = require('express');
const { getProfile, updateProfile, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require("../middleware/upload");
const { updateProfilePicture } = require("../controllers/userController");
const { changePassword } = require("../controllers/userController");
const router = express.Router();


router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/:id', protect, getUserById);
router.put( "/profile-picture", protect, upload.single("image"), updateProfilePicture);
router.put("/change-password", protect, changePassword);

module.exports = router;

