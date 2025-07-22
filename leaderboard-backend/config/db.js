const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Establishes a connection to the MongoDB database using the URI
 * stored in the environment variables.
 */
const connectDB = async () => {
    try {
        // The new Mongoose versions don't require the extra options
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected... 🔗');
    } catch (err) {
        console.error('Database connection error:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

// This is the most important line.
// It exports the function directly, not as an object.
module.exports = connectDB;
