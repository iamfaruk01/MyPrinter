const saveOwnerProfileService = require('./ownerProfile.service');
const saveCustomerProfileService = require('./customerProfile.service');

const CustomError = require('../../util/error');

const ownerProfileHandler = saveOwnerProfileService({CustomError, env: process.env});
const customerProfileHandler = saveCustomerProfileService({CustomError, env: process.env});

module.exports = {ownerProfileHandler, customerProfileHandler};