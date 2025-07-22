const mongoose = require('mongoose');

// Defines the schema for the claim history collection.
const claimHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // This is a special type for unique IDs in MongoDB.
        ref: 'User',                          // Creates a reference to the 'User' model. This links the history to a specific user.
        required: true,
    },
    pointsClaimed: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now, // Automatically sets the timestamp to the current time when a record is created.
    },
});

const ClaimHistory = mongoose.model('ClaimHistory', claimHistorySchema);

module.exports = ClaimHistory;
