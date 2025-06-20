const express = require('express');
const router = express.Router();

// Import models and utilities
const Contact = require('../models/contact');
const { sendContactFormEmail } = require('../utils/sendgrid-email');

// Middleware to handle async errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// POST /api/contacts - Submit contact form
router.post('/', asyncHandler(async (req, res) => {
    console.log('Contact form submission received:', req.body);
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

    // Create new contact submission with all fields
    const contact = new Contact({
        name,
        email,
        subject: subject || 'No Subject',
        message,
        company: company || '',
        phone: phone || '',
        service: service || ''
    });

    // Save to database
    await contact.save();

    try {
        // Send email notification
        await sendContactFormEmail({
            name,
            email,
            subject: subject || 'No Subject',
            message,
            company,
            phone,
            service
        });
    } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email sending fails
    }

    // Send response
    res.status(201).json({
        success: true,
        message: 'Message sent successfully. We will get back to you soon!'
    });
}));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Contact route error:', err);
    res.status(500).json({
        success: false,
        message: 'An error occurred while processing your request. Please try again later.'
    });
});

// GET /api/contact - Get all contact submissions (admin only)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
