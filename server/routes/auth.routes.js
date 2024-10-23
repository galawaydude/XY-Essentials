const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, authUser, googleLogin, sendOTP, verifyOTP } = require('../controllers/auth.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/google', googleLogin);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;