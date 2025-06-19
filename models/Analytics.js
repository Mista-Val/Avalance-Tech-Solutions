const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    total_contacts: {
        type: Number,
        default: 0
    },
    status_changes: {
        type: Number,
        default: 0
    },
    last_updated: {
        type: Date,
        default: Date.now
    }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;