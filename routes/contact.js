const express = require('express');
const router = express.Router();

// Import models
const Contact = require('../models/contact');

// POST /api/contacts - Submit contact form
router.post('/', async (req, res) => {
    try {
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

        // Send response
        res.status(201).json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
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
