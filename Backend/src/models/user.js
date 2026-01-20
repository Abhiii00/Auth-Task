const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    refreshToken: {
        type: String,
        default: null
    },
    resetToken: {
        type: String,
        default: null,
    },
    resetTokenExpiry: {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", userSchema);
