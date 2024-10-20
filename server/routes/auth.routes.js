const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, authUser, googleLogin } = require('../controllers/auth.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/google', googleLogin)

module.exports = router;