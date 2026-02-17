
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testHeaders() {
    const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    const apiKey = envContent.match(/ZEPTOMAIL_API_KEY=(.*)/)[1].trim();
    const url = envContent.match(/ZEPTOMAIL_API_URL=(.*)/)[1].trim();
    const fromEmail = envContent.match(/ZEPTOMAIL_FROM_EMAIL=(.*)/)[1].trim();

    console.log('Testing Token:', apiKey.substring(0, 10) + '...');

    const headersToTest = [
        { name: 'Zoho-enczapikey (Space)', value: `Zoho-enczapikey ${apiKey}` },
        { name: 'Zoho-enczapikey (No Space)', value: `Zoho-enczapikey${apiKey}` },
        { name: 'SendMailToken', value: `SendMailToken ${apiKey}` },
        { name: 'Authorization: <token>', value: apiKey } // Direct
    ];

    for (const h of headersToTest) {
        console.log(`\nTesting Header: ${h.name}`);
        try {
            const response = await axios.post(
                url,
                {
                    from: { address: fromEmail },
                    to: [{ email_address: { address: 'chiru@yopmail.com' } }],
                    subject: "Test Header: " + h.name,
                    htmlbody: "Test"
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': h.value,
                    },
                }
            );
            console.log(`SUCCESS [${h.name}]:`, response.data);
            return; // Stop if success
        } catch (error) {
            console.log(`FAILURE [${h.name}]:`, error.response?.data || error.message);
        }
    }

    // Test X-TM-API-Key
    console.log(`\nTesting Header: X-TM-API-Key`);
    try {
        const response = await axios.post(
            url,
            {
                from: { address: fromEmail },
                to: [{ email_address: { address: 'chiru@yopmail.com' } }],
                subject: "Test X-TM-API-Key",
                htmlbody: "Test"
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-TM-API-Key': apiKey,
                },
            }
        );
        console.log(`SUCCESS [X-TM-API-Key]:`, response.data);
    } catch (error) {
        console.log(`FAILURE [X-TM-API-Key]:`, error.response?.data || error.message);
    }
}

testHeaders();
