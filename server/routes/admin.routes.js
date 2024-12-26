const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware.js');
const { getDashboardStats } = require('../controllers/admin.controller.js');

router.get('/', protect, getDashboardStats);

module.exports = router;