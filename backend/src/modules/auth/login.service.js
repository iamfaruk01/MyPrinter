const bcrypt = require('bcrypt');
const User = require('../../models/userModel');

const loginService = ({ CustomError, env }) => {
    return async function loginHandler(httpRequest) {
        const { phone, password } = httpRequest.body;

        // // Validate input
        // if (!email || !password) {
        //     return CustomError({message: 'Email and password are required.', statusCode: 400}).handle();
        // }

        try {
            return {
                statusCode: 200,
                body: {
                    success: true,
                    phone: phone,
                    message: "Login successful",
                }
            }

        } catch (err) {
            console.error('Login error:', err);
            return CustomError({ message: 'Server error. Please try again later.', statusCode: 500 }).handle();
        }
    };
};

module.exports = loginService;