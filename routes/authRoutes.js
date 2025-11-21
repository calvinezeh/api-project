const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');

// Register a new user
router.post('/', authController.createUser);

// User login
router.post('/login', authController.loginUser);

// Get all users (protected route if needed)
router.get('/users', authenticate, authController.getUsers);

// Get current logged-in user's profile
router.get('/me', authenticate, authController.getProfile);

module.exports = router;
