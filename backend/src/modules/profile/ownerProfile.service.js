const User = require('../../models/userModel');

const saveOwnerProfileService = ({ CustomError }) => {
    return async function saveOwnerProfileHandler(httpRequest) {
        const { phone, userType, printerModel, upiId } = httpRequest.body;
        console.log("[ownerService]ave owner profile request:", httpRequest.body);
        // Validate required fields
        if (!phone) {
            return CustomError({ message: "Phone number is required", statusCode: 400 }).handle();
        }
        
        if (!userType || userType !== 'owner') {
            return CustomError({ message: "Valid user type is required", statusCode: 400 }).handle();
        }
        
        if (!printerModel) {
            return CustomError({ message: "Printer model is required", statusCode: 400 }).handle();
        }
        
        if (!upiId) {
            return CustomError({ message: "UPI ID is required", statusCode: 400 }).handle();
        }

        try {
            // Find the user by phone number
            let user = await User.findOne({ phone });
            
            if (!user) {
                return CustomError({ message: "User not found. Please request OTP first.", statusCode: 404 }).handle();
            }

            // Optional: Check if OTP was verified (you might have an isVerified field)
            // if (!user.isVerified) {
            //     return CustomError({ message: "Phone number not verified. Please verify OTP first.", statusCode: 400 }).handle();
            // }

            // Update user with owner details
            user.userType = userType;
            user.printerModel = printerModel;
            user.upiId = upiId;
            user.profileCompleted = true; // Optional: track if profile is complete
            
            await user.save();

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Owner profile saved successfully",
                    data: {
                        phone: user.phone,
                        userType: user.userType,
                        printerModel: user.printerModel,
                        upiId: user.upiId
                    }
                }
            };

        } catch (err) {
            console.error("Save owner profile error:", err);
            return CustomError({ message: "Server error, please try again later", statusCode: 500 }).handle();
        }
    }
}

module.exports = saveOwnerProfileService;