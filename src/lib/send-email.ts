
import axios from 'axios';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const url = process.env.ZEPTOMAIL_API_URL;
  const apiKey = process.env.ZEPTOMAIL_API_KEY;
  const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL;
  const fromName = process.env.ZEPTOMAIL_FROM_NAME;

  if (!url || !apiKey || !fromEmail) {
    console.warn('ZeptoMail configuration missing. Log mode only.');
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
    return;
  }

  try {
    const response = await axios.post(
      url,
      {
        from: {
          address: fromEmail,
          name: fromName,
        },
        to: [
          {
            email_address: {
              address: to,
            },
          },
        ],
        subject: subject,
        htmlbody: html,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Zoho-enczapikey ${apiKey}`,
        },
      }
    );
    console.log('Email sent successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending email (Full Details):', JSON.stringify(error.response?.data || error.message, null, 2));
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
    throw new Error(`Failed to send email: ${JSON.stringify(error.response?.data || error.message)}`);
  }
}
