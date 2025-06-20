const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint
app.post('/api/test', (req, res) => {
    console.log('Test endpoint hit!', req.body);
    res.status(200).json({ 
        success: true, 
        message: 'Test endpoint works!',
        method: req.method,
        url: req.originalUrl
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);    
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Test with: curl -X POST http://localhost:${PORT}/api/test -H "Content-Type: application/json" -d '{"test":"data"}'`);
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
