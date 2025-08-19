const express = require('express');
const router = express.Router();
const {requestOtpHandler, verifyOtpHandler} = require("../modules/auth");
const {adaptRequest, sendResponse} = require('../util/http');
const { ownerProfileHandler, customerProfileHandler, profileHandler } = require('../modules/profile');
const {authGuard} = require('./middleware');

// request OTP route (public)
router.post("/auth/request-otp", async (req, res) => {
    const httpRequest = adaptRequest(req);
    const result = await requestOtpHandler(httpRequest);
    return sendResponse(res, result);
});

// verify OTP route (public, issues JWT after verification)
router.post("/auth/verify-otp", async (req, res) => {
    const httpRequest = adaptRequest(req);
    const result = await verifyOtpHandler(httpRequest);
    return sendResponse(res, result);
});

// // save owner profile data (protected)
// router.post("/owner/save", authGuard, async (req, res) => {
//     const httpRequest = adaptRequest(req);
//     const result = await ownerProfileHandler(httpRequest);
//     return sendResponse(res, result);
// });

// save owner profile data ()
router.post("/owner/save", async (req, res) => {
    const httpRequest = adaptRequest(req);
    const result = await ownerProfileHandler(httpRequest);
    return sendResponse(res, result);
});

// // save customer profile data (protected)
// router.post("/customer/save", authGuard, async (req, res) => {
//     const httpRequest = adaptRequest(req);
//     const result = await customerProfileHandler(httpRequest);
//     return sendResponse(res, result);
// });

// save customer profile data (protected)
router.post("/customer/save", async (req, res) => {
    const httpRequest = adaptRequest(req);
    const result = await customerProfileHandler(httpRequest);
    return sendResponse(res, result);
});

router.post("/isProfileCompleted", async (req, res) => {
    const httpRequest = adaptRequest(req);
    const result = await profileHandler(httpRequest);
    return sendResponse(res, result);
})

module.exports = router;