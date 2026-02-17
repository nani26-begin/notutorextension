
const axios = require('axios');

async function verifyAuthFlow() {
    const email = 'verify' + Date.now() + '@example.com';

    try {
        console.log('1. Testing OTP send to PostgreSQL for email:', email);
        const sendResponse = await axios.post('http://localhost:3000/api/auth/otp/send', {
            email,
            type: 'signup'
        }, {
            timeout: 10000
        });
        console.log('Result:', sendResponse.data);
        console.log('SUCCESS: OTP generated and stored in PostgreSQL.');

    } catch (error) {
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', error.response.data);
        } else {
            console.error('Request Error:', error.message);
        }
    }
}

verifyAuthFlow();
