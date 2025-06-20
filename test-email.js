require('dotenv').config();
const { sendEmail } = require('./utils/sendgrid-email');

async function testEmail() {
    try {
        console.log('Sending test email...');
        const result = await sendEmail(
            process.env.ADMIN_EMAIL,
            'Test Email from Avalance Tech',
            '<h1>Hello from Avalance Tech!</h1>\n<p>This is a test email sent from your website.</p>'
        );
        console.log('Email sent successfully!', result);
    } catch (error) {
        console.error('Failed to send email:', error);
    } finally {
        process.exit();
    }
}

testEmail();
