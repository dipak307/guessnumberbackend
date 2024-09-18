const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'is invalid']
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6
    },
    maxscore: { type: Number, default: 0 } 

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
