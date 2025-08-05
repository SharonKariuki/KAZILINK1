const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController'); // ✅ Import full controller

// Routes
router.post('/signup', authController.signup);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/set-role', authController.setRole);
router.post('/signin', authController.signin);

module.exports = router;
