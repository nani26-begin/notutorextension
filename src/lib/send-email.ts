
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
  const isEnabled = process.env.ZEPTOMAIL_ENABLED !== 'false';

  if (!url || !apiKey || !fromEmail || !isEnabled) {
    console.warn(`ZeptoMail ${!isEnabled ? 'disabled' : 'configuration missing'}. Log mode only.`);
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
    console.log(`[Email Mock] HTML: ${html}`);
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
    const errorData = error.response?.data;
    console.error('ZeptoMail Error Details:', {
      status: error.response?.status,
      errorCode: errorData?.error?.code,
      errorMessage: errorData?.error?.details?.[0]?.message || errorData?.message || error.message,
      requestId: errorData?.request_id
    });

    throw new Error(`Failed to send email: ${errorData?.error?.details?.[0]?.message || error.message}`);
  }
}
