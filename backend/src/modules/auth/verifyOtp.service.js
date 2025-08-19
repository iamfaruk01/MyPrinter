const User = require('../../models/userModel');
const {generateToken} = require('../../util/token');

const verifyOtpService = ({ CustomError, env }) => {
    return async function verifyOtpHandler(httpRequest) {
        const { phone, otp } = httpRequest.body;
        // console.log("httpRequest body:", httpRequest.body);
        // console.log("Verify OTP request:", { phone, otp });
        if (!phone || !otp) {
            return CustomError({ message: "Phone and OTP are required", statusCode: 400 }).handle();
        }

        try {
            const user = await User.findOne({ phone });
            if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
                return CustomError({ message: "Invalid or expired OTP", statusCode: 400 }).handle();
            }

            // Clear OTP
            user.otp = null;
            user.otpExpiry = null;
            user.isVerified = true;
            
            await user.save();

            // Generate JWT
            const token = generateToken(
                { id: user._id, phone: user.phone },  // payload
                "7d",                                // expiry
                process.env.AUTH_KEY                         // secret key
            );

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Login successful",
                    token
                }
            };

        } catch (err) {
            console.error("Verify OTP error:", err);
            return CustomError({ message: "Server error, please try again later", statusCode: 500 }).handle();
        }
    };
};

module.exports = verifyOtpService;
