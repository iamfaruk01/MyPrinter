const User = require('../../models/userModel');

const saveCustomerProfileService = ({ CustomError }) => {
    return async function saveCustomerProfileHandler(httpRequest) {
        const { phone, userType } = httpRequest.body;
        console.log("[customerService] Save customer profile request:", httpRequest.body);
        // Validate required fields
        if (!phone) {
            return CustomError({ message: "Phone number is required", statusCode: 400 }).handle();
        }
        
        if (!userType || userType !== 'customer') {
            return CustomError({ message: "Valid user type is required", statusCode: 400 }).handle();
        }
        

        try {
            // Find the user by phone number
            let user = await User.findOne({ phone });
            
            if (!user) {
                return CustomError({ message: "User not found. Please request OTP first.", statusCode: 404 }).handle();
            }

            // Optional: Check if OTP was verified
            // if (!user.isVerified) {
            //     return CustomError({ message: "Phone number not verified. Please verify OTP first.", statusCode: 400 }).handle();
            // }

            // Update user with customer details
            user.userType = userType;
            user.profileCompleted = true; // Optional: track if profile is complete
            
            await user.save();

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Customer profile saved successfully",
                    data: {
                        phone: user.phone,
                        userType: user.userType,
                    }
                }
            };

        } catch (err) {
            console.error("Save customer profile error:", err);
            return CustomError({ message: "Server error, please try again later", statusCode: 500 }).handle();
        }
    }
}

module.exports = saveCustomerProfileService;