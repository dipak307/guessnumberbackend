const express = require('express');
const router = express.Router();
const authenticateToken = require("../middleware/middleware"); // Ensure correct middleware import
const { login, register, updateMaxScore, getMaxScore, topUsers } = require("../controllers/controller");

// User routes
router.post("/login", login);
router.post("/register", register);

// Profile route
router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: "User profile",
        user: {
            id: req.user.id,
            email: req.user.email,
            username: req.user.username
        }
    });
});

// Max Score routes

router.post('/updateMaxScore', authenticateToken, updateMaxScore);
router.get('/getMaxScore', authenticateToken, getMaxScore);
router.get('/leaderboard',topUsers);

module.exports = router;
