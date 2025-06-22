const express = require('express');
const router = express.Router();

// Import models and utilities
const PricingRequest = require('../models/pricingRequest');
const { sendEmail, sendContactFormEmail } = require('../utils/sendgrid-email');

// Middleware to handle async errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// POST /api/pricing-requests - Submit pricing request form
router.post('/', asyncHandler(async (req, res) => {
    console.log('Pricing request form submission received:', {
        body: req.body,
        headers: req.headers,
        url: req.originalUrl,
        method: req.method
    });
    
    const { 
        name, 
        email, 
        message, 
        subject, 
        company, 
        companyName, 
        phone, 
        service,
        jobTitle,
        industry,
        employees,
        services = [],
        challenges,
        timeline,
        budget,
        additionalInfo,
        infrastructureType,
        currentCloud,
        projectType,
        formType
    } = req.body;

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
    const pricingRequestData = {
        name,
        email,
        subject: subject || `Pricing Request - ${formType || 'General'}`,
        message,
        company: company || companyName || '',
        phone: phone || '',
        service: service || '',
        jobTitle: jobTitle || '',
        industry: industry || '',
        employees: employees || '',
        services: Array.isArray(services) ? services : [services],
        challenges: challenges || '',
        timeline: timeline || '',
        budget: budget || '',
        additionalInfo: additionalInfo || '',
        infrastructureType: infrastructureType || '',
        currentCloud: currentCloud || '',
        projectType: projectType || '',
        formType: formType || 'general',
        status: 'new',
        priority: 'medium'
    };
    
    // Log the data being saved
    console.log('Saving pricing request with data:', pricingRequestData);
    
    const pricingRequest = new PricingRequest(pricingRequestData);

    // Save to database
    await pricingRequest.save();

    try {
        // Format the email content with all form data
        const emailContent = `
            <h2>New ${formType ? formType.replace(/_/g, ' ') : 'Pricing'} Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            ${jobTitle ? `<p><strong>Job Title:</strong> ${jobTitle}</p>` : ''}
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${industry ? `<p><strong>Industry:</strong> ${industry}</p>` : ''}
            ${employees ? `<p><strong>Company Size:</strong> ${employees} employees</p>` : ''}
            
            <h3>Project Details</h3>
            ${formType ? `<p><strong>Form Type:</strong> ${formType.replace(/_/g, ' ')}</p>` : ''}
            ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ''}
            ${infrastructureType ? `<p><strong>Infrastructure Type:</strong> ${infrastructureType}</p>` : ''}
            ${currentCloud ? `<p><strong>Current Cloud:</strong> ${currentCloud}</p>` : ''}
            
            <h3>Services Requested</h3>
            ${services && services.length > 0 ? 
                `<ul>${services.map(s => s ? `<li>${s}</li>` : '').join('')}</ul>` : 
                '<p>No specific services selected</p>'}
            
            ${challenges ? `<p><strong>Challenges/Needs:</strong><br>${challenges}</p>` : ''}
            ${message ? `<p><strong>Message:</strong><br>${message}</p>` : ''}
            
            <h3>Project Information</h3>
            ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
            ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
            
            ${additionalInfo ? `<p><strong>Additional Information:</strong><br>${additionalInfo}</p>` : ''}
            
            <p><em>This request was submitted through the ${formType ? formType.replace(/_/g, ' ') : 'pricing request'} form.</em></p>
        `;

        // Send email notification
        await sendEmail(
            process.env.ADMIN_EMAIL,
            `New ${formType ? formType.replace(/_/g, ' ') : 'Pricing'} Request from ${name}`,
            emailContent
        );

        res.status(201).json({
            success: true,
            message: 'Pricing request submitted successfully!',
            data: {
                id: pricingRequest._id,
                name: pricingRequest.name,
                email: pricingRequest.email,
                company: pricingRequest.company,
                service: pricingRequest.service,
                message: pricingRequest.message,
                formType: pricingRequest.formType
            }
        });
    } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email sending fails
        res.status(201).json({
            success: true,
            message: 'Your pricing request has been submitted successfully. We will get back to you soon!'
        });
    }
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
