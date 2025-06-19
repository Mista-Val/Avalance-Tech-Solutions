const mongoose = require('mongoose');
const Contact = require('../models/contact');
const Analytics = require('../models/Analytics');
require('dotenv').config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Create initial analytics record
        const analytics = new Analytics();
        await analytics.save();
        
        console.log('✅ Database seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();