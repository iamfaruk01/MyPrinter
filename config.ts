const BASE_URL = 'http://10.62.72.5:3000'

export default {
    BASE_URL,
    API: {
        REQUEST_OTP: `${BASE_URL}/auth/request-otp`,
        VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
    }
};

