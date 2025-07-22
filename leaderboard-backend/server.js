const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from a .env file into process.env

const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

// --- Initial Setup ---
const app = express();
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// --- Database Connection ---
connectDB();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) so your React frontend can make requests to this backend.
app.use(cors());

// Enable Express to parse JSON formatted request bodies.
// This is how you get data from POST requests (e.g., req.body.name).
app.use(express.json());

// --- API Routes ---
// Tell the app to use the routes defined in './routes/api.js' for any URL starting with '/api'.
app.use('/api', apiRoutes);

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
