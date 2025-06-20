const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

// Validate required environment variables
const requiredVars = ['MONGODB_URI', 'MONGODB_SSL_KEY', 'MONGODB_SSL_CERT', 'MONGODB_SSL_CA'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
}

// Verify certificate files exist
const certFiles = {
    key: process.env.MONGODB_SSL_KEY,
    cert: process.env.MONGODB_SSL_CERT,
    ca: process.env.MONGODB_SSL_CA
};

for (const [type, path] of Object.entries(certFiles)) {
    if (!fs.existsSync(path)) {
        console.error(`❌ ${type.toUpperCase()} certificate not found at: ${path}`);
        console.log('Current working directory:', process.cwd());
        console.log('Directory contents:', fs.readdirSync('.'));
        process.exit(1);
    }
}

// Configure MongoDB connection with X.509
const sslOptions = {
    ssl: true,
    sslValidate: true,
    sslKey: fs.readFileSync(process.env.MONGODB_SSL_KEY),
    sslCert: fs.readFileSync(process.env.MONGODB_SSL_CERT),
    sslCA: [fs.readFileSync(process.env.MONGODB_SSL_CA)],
    authMechanism: 'MONGODB-X509'
};

async function testConnection() {
    try {
        console.log('🔍 Attempting to connect to MongoDB Atlas with X.509 authentication...');
        console.log('Using connection string:', process.env.MONGODB_URI.replace(/(mongodb\+srv:\/\/)[^:]+:[^@]+@/, '$1***:***@'));
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ...sslOptions
        });
        
        console.log('✅ Successfully connected to MongoDB Atlas with X.509 authentication');
        
        // Test a simple database operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📋 Available collections:', collections.map(c => c.name));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        if (error.code === 'MONGODB_ERROR') {
            console.error('Detailed MongoDB error:', error.errorResponse);
        }
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

testConnection();
