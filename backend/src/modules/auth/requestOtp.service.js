const User = require('../../models/userModel');
const otpGenerator = require("otp-generator");

const requestOtpService = ({ CustomError }) => {
    return async function requestOtpHandler(httpRequest) {
        const { phone } = httpRequest.body;
        if (!phone) {
            return CustomError({ message: "Phone number is required", statusCode: 400 }).handle();
        }

        try {
            let user = await User.findOne({ phone });
            if (!user) {
                user = new User({ phone });
            }

            // Generate OTP
            const otp = otpGenerator.generate(
                4,
                {
                    digits: true,
                    lowerCaseAlphabets: false,
                    upperCaseAlphabets: false,
                    specialChars: false
                }
            );
            user.otp = otp;
            user.otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
            await user.save();

            // For now log OTP (later send via SMS provider)
            console.log(`OTP for ${phone}: ${otp}`);

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "OTP sent successfully"
                }
            }
        } catch (err) {
            console.error("Request OTP error:", err);
            return CustomError({ message: "Server error, please try again later", statusCode: 500 }).handle();
        }
    }
}

module.exports = requestOtpService;