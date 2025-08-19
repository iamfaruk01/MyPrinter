// const BASE_URL = 'http://10.62.72.65:3000'
const BASE_URL = 'https://myprinter.onrender.com'
// const BASE_URL = 'http://192.168.83.135:3000'
export default {
    BASE_URL,
    API: {
        REQUEST_OTP: `${BASE_URL}/auth/request-otp`,
        VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
        SAVE_OWNER_PROFILE: `${BASE_URL}/owner/save`,
        SAVE_CUSTOMER_PROFILE: `${BASE_URL}/customer/save`,
        CHECK_IS_PROFILE_COMPLETED: `${BASE_URL}/isProfileCompleted`
    }
};

