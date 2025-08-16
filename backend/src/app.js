const express = require('express');
const connectDB = require('./config/dbConfig');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

connectDB();

// Routes
app.use(require('./routes')); // Load all routes from routes/index.js

// 404 Handler
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// General Error Handler
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        message: error.message || 'Something went wrong. Please try again.'
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server started on port', PORT));
