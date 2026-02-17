
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testEndpoints() {
    const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    const apiKey = envContent.match(/ZEPTOMAIL_API_KEY=(.*)/)[1].trim();
    const fromEmail = envContent.match(/ZEPTOMAIL_FROM_EMAIL=(.*)/)[1].trim();

    const endpoints = [
        "https://api.zeptomail.com/v1.1/email",
        "https://api.zeptomail.com/v1.1/email/send",
        "https://api.zeptomail.com/v1.1/send"
    ];

    for (const url of endpoints) {
        console.log(`\nTesting URL: ${url}`);
        try {
            const response = await axios.post(
                url,
                {
                    from: { address: fromEmail },
                    to: [{ email_address: { address: 'chiru@yopmail.com' } }],
                    subject: "Test URL: " + url,
                    htmlbody: "Test"
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Zoho-enczapikey ${apiKey}`,
                    },
                }
            );
            console.log(`SUCCESS [${url}]:`, response.data);
            return;
        } catch (error) {
            console.log(`FAILURE [${url}]:`, error.response?.data || error.message);
        }
    }
}

testEndpoints();
