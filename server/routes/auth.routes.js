const express = require('express');
const router = express.Router();
const { registerUser, authUser, authAdmin, googleLogin, adminGoogleLogin, sendOTP, verifyOTP, verifyAuth, logout } = require('../controllers/auth.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/google', googleLogin);
router.post('/logout', logout);

router.post('/admin-login', authAdmin);
router.get('/admin-google', adminGoogleLogin);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/verify', protect, verifyAuth);

module.exports = router;