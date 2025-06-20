const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();

// Configure OAuth2 client
const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

async function createTransporter() {
    try {
        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    console.error('Error getting access token:', err);
                    reject('Failed to create access token');
                }
                resolve(token);
            });
        });

        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_EMAIL,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken
            }
        });
    } catch (error) {
        console.error('Error creating transporter:', error);
        throw error;
    }
}

async function sendEmail(to, subject, html) {
    try {
        const transporter = await createTransporter();
        
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.GMAIL_EMAIL}>`,
            to: to,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

async function sendContactFormEmail(contactData) {
    const emailContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        ${contactData.company ? `<p><strong>Company:</strong> ${contactData.company}</p>` : ''}
        ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
        ${contactData.service ? `<p><strong>Service:</strong> ${contactData.service}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${contactData.message.replace(/\n/g, '<br>')}</p>
        <p><em>This message was sent from the contact form on your website.</em></p>
    `;

    return sendEmail(
        process.env.ADMIN_EMAIL || process.env.GMAIL_EMAIL,
        `New Contact Form: ${contactData.name}`,
        emailContent
    );
}

module.exports = {
    sendEmail,
    sendContactFormEmail
};
