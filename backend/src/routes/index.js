const express = require('express');
const router = express.Router();
const {requestOtpHandler, verifyOtpHandler} = require("../modules/auth");
const {adaptRequest, sendResponse} = require('../util/http');

// request OTP route
router.post("/auth/request-otp", async (req, res) => {
    const httpRequest = adaptRequest(req);
    const result = await requestOtpHandler(httpRequest);
    return sendResponse(res, result);
});

// verify OTP route
router.post("/auth/verify-otp", async (req, res) => {
    const httpRequest = adaptRequest(req);
    const result = await verifyOtpHandler(httpRequest);
    return sendResponse(res, result);
});

module.exports = router;