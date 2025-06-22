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
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    service: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        required: true
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
