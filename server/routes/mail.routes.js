// app.js or server.js
const express = require('express');
const router = express.Router();
const {sendWelcomeEmail, sendBulkEmail, sendCustomEmail, sendFilteredEmail} = require('../controllers/mail.controller');

// Use routes
// router.post('/contact', sendContactEmail);
// router.post('/broadcast', sendBulkEmails);
router.post('/welcome', sendWelcomeEmail);
router.post('/bulk',  sendBulkEmail);
router.post('/custom',  sendCustomEmail);
router.post('/filtered',  sendFilteredEmail);

module.exports = router;