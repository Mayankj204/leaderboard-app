const mongoose = require('mongoose');

// Defines the schema for the User collection.
// A schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        unique: true,   // Each user must have a unique name to avoid duplicates.
        trim: true,     // Removes whitespace from both ends of the 'name' string.
    },
    totalPoints: {
        type: Number,
        default: 0,     // New users will automatically have 0 points.
        min: 0          // Ensures points can't be negative.
    },
}, { 
    // Adds `createdAt` and `updatedAt` fields to the schema automatically.
    timestamps: true 
});

// Creates a model from the schema. A model is a class with which we construct documents.
// In this case, each document will be a user with properties and behaviors as declared in our schema.
const User = mongoose.model('User', userSchema);

module.exports = User;
