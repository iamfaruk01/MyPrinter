const User = require('../../models/userModel');

const isProfileCompletedService = ({ CustomError }) => {
  return async function profileHandler(httpRequest) {
    const { phone } = httpRequest.body;
    console.log("[profileService] phone: ", phone);

    if (!phone) {
      return CustomError({ message: "Phone number is required", statusCode: 400 }).handle();
    }

    try {
      const user = await User.findOne({ phone });

      if (!user) {
        return CustomError({ message: "User not found. Please request OTP first.", statusCode: 404 }).handle();
      }

      if (!user.profileCompleted) {
        return {
          statusCode: 200,
          body: {
            success: false,
            message: "Profile is not completed",
            data: null
          }
        };
      }

      return {
        statusCode: 200,
        body: {
          success: true,
          message: "Profile is completed",
          data: {
            userType: user.userType
          }
        }
      };

    } catch (err) {
      return CustomError({ message: "Server error, please try again later", statusCode: 500 }).handle();
    }
  };
};

module.exports = isProfileCompletedService;
