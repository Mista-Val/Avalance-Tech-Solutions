require('dotenv').config();
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

console.log('=== Environment Check ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');

// Check MongoDB environment variables
console.log('\n=== MongoDB Configuration ===');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('MONGODB_SSL_KEY:', process.env.MONGODB_SSL_KEY || 'Not set');
console.log('MONGODB_SSL_CERT:', process.env.MONGODB_SSL_CERT || 'Not set');
console.log('MONGODB_SSL_CA:', process.env.MONGODB_SSL_CA || 'Not set');

// Check SendGrid environment variables
console.log('\n=== SendGrid Configuration ===');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Set' : 'Not set');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'Not set');

// Check certificate files
console.log('\n=== Certificate Files ===');
const checkFile = (filePath, desc) => {
    const fullPath = path.resolve(process.cwd(), filePath);
    const exists = fs.existsSync(fullPath);
    console.log(`${desc}: ${exists ? '✅ Found' : '❌ Missing'}: ${fullPath}`);
    return exists;
};

const certFiles = [
    { path: process.env.MONGODB_SSL_KEY, desc: 'MongoDB Private Key' },
    { path: process.env.MONGODB_SSL_CERT, desc: 'MongoDB Certificate' },
    { path: process.env.MONGODB_SSL_CA, desc: 'MongoDB CA Certificate' }
];

certFiles.forEach(({path, desc}) => path && checkFile(path, desc));

// Test MongoDB Connection
async function testMongoDB() {
    console.log('\n=== Testing MongoDB Connection ===');
    
    if (!process.env.MONGODB_URI) {
        console.log('❌ MONGODB_URI not set');
        return false;
    }

    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        };

        // Add SSL options if certificates are configured
        if (process.env.MONGODB_SSL_KEY) {
            options.ssl = true;
            options.sslKey = fs.readFileSync(process.env.MONGODB_SSL_KEY);
            options.sslCert = fs.readFileSync(process.env.MONGODB_SSL_CERT);
            options.sslCA = [fs.readFileSync(process.env.MONGODB_SSL_CA)];
            options.authMechanism = 'MONGODB-X509';
        }

        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('✅ Successfully connected to MongoDB');
        
        // Test a simple query
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📋 Available collections:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        if (error.code === 'MONGODB_ERROR') {
            console.error('Detailed MongoDB error:', error.errorResponse);
        }
        return false;
    }
}

// Test SendGrid Email
async function testSendGrid() {
    console.log('\n=== Testing SendGrid Email ===');
    
    if (!process.env.SENDGRID_API_KEY) {
        console.log('❌ SENDGRID_API_KEY not set');
        return false;
    }
    
    if (!process.env.EMAIL_FROM) {
        console.log('❌ EMAIL_FROM not set');
        return false;
    }
    
    if (!process.env.ADMIN_EMAIL) {
        console.log('❌ ADMIN_EMAIL not set');
        return false;
    }
    
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
            to: process.env.ADMIN_EMAIL,
            from: process.env.EMAIL_FROM,
            subject: 'Test Email from Avalanche Tech Solutions',
            text: 'This is a test email to verify SendGrid integration.',
            html: '<strong>This is a test email to verify SendGrid integration.</strong>'
        };
        
        console.log('Sending test email to:', process.env.ADMIN_EMAIL);
        await sgMail.send(msg);
        console.log('✅ Test email sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Error sending test email:');
        console.error('Status Code:', error.code);
        console.error('Message:', error.message);
        if (error.response) {
            console.error('Response Body:', JSON.stringify(error.response.body, null, 2));
        }
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('\n=== Running Diagnostic Tests ===');
    const mongoSuccess = await testMongoDB();
    const emailSuccess = await testSendGrid();
    
    console.log('\n=== Test Summary ===');
    console.log(`MongoDB Connection: ${mongoSuccess ? '✅' : '❌'}`);
    console.log(`SendGrid Email: ${emailSuccess ? '✅' : '❌'}`);
    
    if (mongoSuccess && emailSuccess) {
        console.log('\n✅ All tests passed! Your setup appears to be working correctly.');
    } else {
        console.log('\n❌ Some tests failed. Please check the error messages above.');
    }
}

runTests().catch(console.error);
