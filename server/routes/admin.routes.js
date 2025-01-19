const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth.middleware.js');
const { 
    getDashboardStats,
    getSalesAnalytics,
    getProductAnalytics,
    getCustomerAnalytics,
    getInventoryAnalytics,
    getRevenueMetrics,
    getPerformanceMetrics
} = require('../controllers/admin.controller.js');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/sales', protect, admin, getSalesAnalytics);
router.get('/products', protect, admin, getProductAnalytics);
router.get('/customers', protect, admin, getCustomerAnalytics);
router.get('/inventory', protect, admin, getInventoryAnalytics);
router.get('/revenue', protect, admin, getRevenueMetrics);
router.get('/performance', protect, admin, getPerformanceMetrics);

module.exports = router;