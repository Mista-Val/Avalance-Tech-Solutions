// Check environment configuration
console.log('=== Environment Configuration ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Set' : 'Not set');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'Not set');

// Test database connection
console.log('\n=== Database Connection Test ===');
const mongoose = require('mongoose');

async function testDbConnection() {
    if (!process.env.MONGODB_URI) {
        console.log('❌ MONGODB_URI not set in environment variables');
        return false;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Successfully connected to MongoDB');
        await mongoose.connection.close();
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        return false;
    }
}

// Test SendGrid configuration
console.log('\n=== Email Configuration Test ===');
async function testEmailConfig() {
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
    
    console.log('✅ Email configuration appears valid');
    console.log('From:', process.env.EMAIL_FROM);
    console.log('To (Admin):', process.env.ADMIN_EMAIL);
    return true;
}

// Run tests
async function runTests() {
    console.log('\n=== Starting Tests ===');
    const dbConnected = await testDbConnection();
    const emailConfigured = await testEmailConfig();
    
    console.log('\n=== Test Summary ===');
    console.log(`Database Connection: ${dbConnected ? '✅' : '❌'}`);
    console.log(`Email Configuration: ${emailConfigured ? '✅' : '❌'}`);
    
    if (!dbConnected || !emailConfigured) {
        console.log('\n❌ Some tests failed. Please check the error messages above.');
        process.exit(1);
    }
    
    console.log('\n✅ All tests passed! Your environment is properly configured.');
    process.exit(0);
}

runTests();
