const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Environment variables with defaults
const PORT = parseInt(process.env.PORT, 10) || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB Connection
const mongoose = require('mongoose');

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
});

// Log environment
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Server running on port:', PORT);

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:8080', 'http://127.0.0.1:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Simple test endpoints
app.get('/api/test', (req, res) => {
    console.log('GET Test endpoint hit!');
    res.status(200).json({ 
        success: true, 
        message: 'GET test endpoint works!',
        method: 'GET',
        url: req.originalUrl,
        query: req.query
    });
});

app.post('/api/test', (req, res) => {
    console.log('POST Test endpoint hit!', req.body);
    res.status(200).json({ 
        success: true, 
        message: 'POST test endpoint works!',
        method: 'POST',
        url: req.originalUrl,
        body: req.body
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Import and use routes
try {
    const contactRoutes = require('./routes/contact');
    app.use('/api/contacts', contactRoutes);
    console.log('Contact routes mounted at /api/contacts');
} catch (error) {
    console.error('Failed to load contact routes:', error);
}

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Not Found',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Avalance Tech Solutions server is running');
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
});

// Handle shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
