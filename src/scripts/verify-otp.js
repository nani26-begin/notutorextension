
const axios = require('axios');

async function testSendOTP() {
    try {
        console.log("Sending OTP request to http://localhost:3000/api/auth/otp/send...");
        const response = await axios.post('http://localhost:3000/api/auth/otp/send', {
            email: 'test-' + Date.now() + '@yopmail.com',
            type: 'signup'
        });
        console.log('Success Response:', response.data);
    } catch (error) {
        console.error('Failure Response:', error.response?.data || error.message);
    }
}

testSendOTP();
