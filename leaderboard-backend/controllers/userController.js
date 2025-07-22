const User = require('../models/userModel');
const ClaimHistory = require('../models/claimHistoryModel');

/**
 * @desc    Get all users for the selection dropdown
 * @route   GET /api/users
 * @access  Public
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Find all users and select only their name and ID for efficiency
        const users = await User.find().select('name _id');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Server error while fetching users.' });
    }
};

/**
 * @desc    Add a new user
 * @route   POST /api/users
 * @access  Public
 */
exports.addUser = async (req, res) => {
    try {
        const { name } = req.body;

        // Basic validation
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'User name cannot be empty.' });
        }

        // Check if user already exists (case-insensitive)
        const existingUser = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingUser) {
            return res.status(409).json({ message: 'A user with this name already exists.' });
        }

        const newUser = new User({ name: name.trim() });
        await newUser.save();
        
        res.status(201).json({ message: 'User added successfully!', user: newUser });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Server error while adding user.' });
    }
};

/**
 * @desc    Claim random points for a selected user
 * @route   POST /api/users/:userId/claim
 * @access  Public
 */
exports.claimPoints = async (req, res) => {
    try {
        const { userId } = req.params;
        const randomPoints = Math.floor(Math.random() * 10) + 1; // Random points from 1 to 10

        // Find the user and atomically increment their points
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { totalPoints: randomPoints } }, // $inc is an atomic operation, good for concurrency
            { new: true } // This option returns the updated document
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Create a history record of this claim
        const historyRecord = new ClaimHistory({
            userId: user._id,
            pointsClaimed: randomPoints,
        });
        await historyRecord.save();
        
        res.status(200).json({ 
            message: `🎉 ${user.name} was awarded ${randomPoints} points!`, 
            user: user 
        });
    } catch (error) {
        console.error('Error claiming points:', error);
        res.status(500).json({ message: 'Server error while claiming points.' });
    }
};

/**
 * @desc    Get the leaderboard (users ranked by points)
 * @route   GET /api/leaderboard
 * @access  Public
 */
exports.getLeaderboard = async (req, res) => {
    try {
        // Find all users and sort them by totalPoints in descending order
        const leaderboard = await User.find().sort({ totalPoints: -1 });
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        res.status(500).json({ message: 'Server error while fetching the leaderboard.' });
    }
};
