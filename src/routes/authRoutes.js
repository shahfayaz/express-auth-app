const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes examples
router.get('/profile-jwt', authMiddleware.verifyToken, authController.getProfile);
router.get('/profile-session', authMiddleware.checkSession, authController.getProfile);

module.exports = router;
