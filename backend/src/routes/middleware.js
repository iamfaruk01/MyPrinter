const CustomError = require('../util/error');
const { verifyToken } = require('../util/token');
const { sendResponse } = require('../util/http-request');

const authGuard = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            const error = CustomError({ message: 'No token provided', statusCode: 401 });
            return sendResponse(res, error.handle());
        }

        const token = authHeader.split(" ")[1];
        const key = process.env.AUTH_KEY;

        const decoded = verifyToken(token, key);
        req.user = decoded; // attach decoded payload to req.user

        next();
    } catch (err) {
        console.error("AuthGuard Error:", err.message);
        const error = CustomError({ message: 'Unauthorized access', statusCode: 401 });
        sendResponse(res, error.handle());
    }
};

module.exports = {
    authGuard
};
