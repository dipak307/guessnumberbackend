const userData = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Register User
module.exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userData.create({ username, email, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.log("Error occurred in register", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Login User
module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userData.findOne({ email });

        if (!user) {
            res.status(404).send("User not found. Please register first.");
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Create JWT Token
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Set token in cookie
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).send("Invalid credentials.");
        }
    } catch (err) {
        console.log("Error occurred in login:", err);
        res.status(500).send("An error occurred while trying to log in.");
    }
};


// Update max score for logged-in user
// controllers/controller.js


module.exports.updateMaxScore = async (req, res) => {
    const { maxscore } = req.body; // Ensure the key matches

    if (typeof maxscore !== 'number') {
        return res.status(400).json({ message: "Invalid data format. maxScore should be a number." });
    }

    const userId = req.user.id; // Get user id from token

    try {
        const user = await userData.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (maxscore > user.maxscore) {
            user.maxscore = maxscore;
            await user.save();
            res.status(200).json({ message: "Max score updated successfully", maxscore: user.maxscore });
        } else {
            res.status(200).json({ message: "Max score is lower than or equal to the existing one." });
        }
    } catch (error) {
        console.error("Error updating max score:", error);
        res.status(500).json({ message: "Server error." });
    }
};


// Get max score for logged-in user
module.exports.getMaxScore = async (req, res) => {
    const userId = req.user.id;  // Assuming req.user is set by middleware after login

    try {
        const user = await userData.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ maxScore: user.maxscore });
    } catch (err) {
        console.log("Error retrieving max score:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/////////fetching top users 

module.exports.topUsers=async(req,res)=>{
    try {
        // Fetch all users and their max scores
        const users = await userData.find({}).sort({maxscore:-1}).limit(10); // Sorted by maxScore in descending order
        res.status(200).json(users);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: 'Internal server error' });
      }
}