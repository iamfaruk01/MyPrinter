const User = require('../../models/userModel');

const saveOwnerProfileService = ({ CustomError }) => {
    return async function saveOwnerProfileHandler(httpRequest) {
        const {userType, printerModel, upiId} = httpRequest.body;
    }
}

module.exports = saveOwnerProfileService;