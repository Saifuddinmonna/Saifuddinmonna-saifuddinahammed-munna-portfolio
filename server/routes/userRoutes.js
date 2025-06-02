const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

// Guest routes
router.post('/guest', userController.createGuestUser);

// Optional registration routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', isAuthenticated, userController.getCurrentUser);
router.get('/:id', isAuthenticated, userController.getUserById);

module.exports = router; 