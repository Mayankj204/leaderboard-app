const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// --- API Routes ---

// @route   GET /api/users
// @desc    Get a list of all users
// @access  Public
router.get('/users', userController.getAllUsers);

// @route   POST /api/users
// @desc    Add a new user
// @access  Public
router.post('/users', userController.addUser);

// @route   POST /api/users/:userId/claim
// @desc    Claim points for a specific user
// @access  Public
router.post('/users/:userId/claim', userController.claimPoints);

// @route   GET /api/leaderboard
// @desc    Get the ranked leaderboard
// @access  Public
router.get('/leaderboard', userController.getLeaderboard);


module.exports = router;
