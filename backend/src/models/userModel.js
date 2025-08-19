const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        enum: ['owner', 'customer'],
        default: null
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    
    // Owner specific fields
    printerModel: {
        type: String,
        required: function() { return this.userType === 'owner'; }
    },
    upiId: {
        type: String,
        required: function() { return this.userType === 'owner'; }
    }
}, {
    timestamps: true
});

// Index for performance
// userSchema.index({ phone: 1 });

module.exports = mongoose.model('users', userSchema);