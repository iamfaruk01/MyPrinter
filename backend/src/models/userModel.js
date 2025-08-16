const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
        maxlength: 13
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const userModel = model("users", userSchema)

module.exports = userModel