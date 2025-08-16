const requestOtpService = require('./requestOtp.service');
const verifyOtpService = require('./verifyOtp.service');
const CustomError = require('../../util/error');

const requestOtpHandler = requestOtpService({CustomError, env: process.env});
const verifyOtpHandler = verifyOtpService({CustomError, env: process.env});

module.exports = {requestOtpHandler, verifyOtpHandler};