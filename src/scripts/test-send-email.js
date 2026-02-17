
const { sendEmail } = require('../lib/send-email');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

async function testMain() {
    try {
        console.log('Testing with lib/send-email.ts...');
        console.log('Process Env API Key Length:', process.env.ZEPTOMAIL_API_KEY?.length);

        await sendEmail({
            to: 'chiru@yopmail.com',
            subject: 'Test from Lib',
            html: '<p>Testing the actual library function</p>'
        });
        console.log('Test completed successfully');
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testMain();
