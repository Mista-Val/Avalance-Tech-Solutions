const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Validate required environment variables
const requiredVars = ['SENDGRID_API_KEY', 'EMAIL_FROM', 'ADMIN_EMAIL'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
}

// Validate API key format
if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
    console.error('Invalid SendGrid API key. It should start with "SG."');
    process.exit(1);
}

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, html) {
    if (!to || !subject || !html) {
        throw new Error('Missing required email parameters');
    }

    const msg = {
        to,
        from: {
            email: process.env.EMAIL_FROM,
            name: process.env.EMAIL_FROM_NAME || 'Avalanche Tech Solutions'
        },
        subject: subject.toString(),
        html: html.toString()
    };

    try {
        console.log('Attempting to send email to:', to);
        const response = await sgMail.send(msg);
        console.log('Email sent successfully');
        return { 
            success: true, 
            messageId: response[0]?.headers?.['x-message-id'] || 'unknown'
        };
    } catch (error) {
        console.error('Error sending email:');
        console.error('Status Code:', error.code);
        console.error('Message:', error.message);
        if (error.response) {
            console.error('Response Body:', error.response.body);
        }
        throw new Error(`Failed to send email: ${error.message}`);
    }
}

async function sendContactFormEmail(contactData) {
    if (!contactData || !contactData.name || !contactData.email || !contactData.message) {
        throw new Error('Missing required contact information');
    }

    const emailContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        ${contactData.company ? `<p><strong>Company:</strong> ${contactData.company}</p>` : ''}
        ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
        ${contactData.service ? `<p><strong>Service:</strong> ${contactData.service}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${String(contactData.message || '').replace(/\n/g, '<br>')}</p>
        <p><em>This message was sent from the contact form on your website.</em></p>
    `;

    return sendEmail(
        process.env.ADMIN_EMAIL,
        `New Contact Form: ${contactData.name}`,
        emailContent
    );
}

module.exports = {
    sendEmail,
    sendContactFormEmail
};
