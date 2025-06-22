const express = require('express');
const router = express.Router();

// Import models and utilities
const PricingRequest = require('../models/pricingRequest');
const { sendContactFormEmail } = require('../utils/sendgrid-email');

// Middleware to handle async errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// POST /api/pricing-requests - Submit pricing request form
router.post('/', asyncHandler(async (req, res) => {
    console.log('Pricing request form submission received:', req.body);
    const { name, email, message, subject, company, phone, service } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and message are required fields'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address'
        });
    }

    // Create new pricing request with all fields
    const pricingRequest = new PricingRequest({
        name,
        email,
        subject: subject || 'Pricing Request',
        message,
        company: company || '',
        phone: phone || '',
        service: service || ''
    });

    // Save to database
    await pricingRequest.save();

    try {
        // Send email notification
        await sendContactFormEmail({
            name,
            email,
            subject: subject || 'New Pricing Request',
            message,
            company,
            phone,
            service,
            isPricingRequest: true
        });
    } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email sending fails
    }

    // Send response
    res.status(201).json({
        success: true,
        message: 'Your pricing request has been submitted successfully. We will get back to you soon!'
    });
}));

// GET /api/pricing-requests - Get all pricing requests (admin only)
router.get('/', async (req, res) => {
    try {
        const pricingRequests = await PricingRequest.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: pricingRequests
        });
    } catch (error) {
        console.error('Error fetching pricing requests:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Pricing request route error:', err);
    res.status(500).json({
        success: false,
        message: 'An error occurred while processing your request. Please try again later.'
    });
});

module.exports = router;
