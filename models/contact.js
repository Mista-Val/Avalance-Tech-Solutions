const mongoose = require('mongoose');

// Create a connection to the Avalance database
const db = mongoose.connection.useDb('Avalance');

const contactSchema = new mongoose.Schema({
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

contactSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

// Export model with the explicit database connection
module.exports = db.model('Contact', contactSchema, 'contacts');