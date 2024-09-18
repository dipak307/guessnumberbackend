const express = require("express");
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000 // Default port if not defined

if (!PORT) {
    console.error('PORT environment variable is not defined');
    process.exit(1); // Exit the process with an error code
}

// Middleware
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware before any route handling

// CORS Configuration
const allowedOrigins = ['http://localhost:3000']; // Add your production URL here
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Absolute path to the routes directory
const routesPath = path.resolve(__dirname, 'routes');

// Check if the directory exists
const fs = require('fs');
if (!fs.existsSync(routesPath)) {
    console.error('Routes directory does not exist');
    process.exit(1);
}

// Routes
readdirSync(routesPath).forEach(route => {
    app.use('/api', require(path.join(routesPath, route)));
});

// Test route
app.get('/', (req, res) => {
    res.send("Hello world");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const startServer = async () => {
    try {
        await db(); // Ensure the database connection is established before starting the server
        app.listen(PORT, () => {
            console.log('Listening to port:', PORT);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit the process with an error code
    }
};

startServer();



















