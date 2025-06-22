const mongoose = require('mongoose');

const pricingRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    company: {
        type: String,
        trim: true,
        default: ''
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    jobTitle: {
        type: String,
        trim: true,
        default: ''
    },
    industry: {
        type: String,
        trim: true,
        default: ''
    },
    employees: {
        type: String,
        trim: true,
        default: ''
    },
    service: {
        type: String,
        default: ''
    },
    services: [{
        type: String,
        trim: true
    }],
    message: {
        type: String,
        required: true,
        trim: true
    },
    challenges: {
        type: String,
        trim: true,
        default: ''
    },
    timeline: {
        type: String,
        trim: true,
        default: ''
    },
    budget: {
        type: String,
        trim: true,
        default: ''
    },
    additionalInfo: {
        type: String,
        trim: true,
        default: ''
    },
    infrastructureType: {
        type: String,
        trim: true,
        default: ''
    },
    currentCloud: {
        type: String,
        trim: true,
        default: ''
    },
    projectType: {
        type: String,
        trim: true,
        default: ''
    },
    formType: {
        type: String,
        trim: true,
        default: 'general',
        enum: ['business_it_solutions', 'cloud_infrastructure', 'custom_development', 'general']
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'completed', 'closed'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    analytics_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Analytics'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

pricingRequestSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const PricingRequest = mongoose.model('PricingRequest', pricingRequestSchema, 'pricingrequests');
module.exports = PricingRequest;
