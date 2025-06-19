const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Get all services
        res.json({
            success: true,
            data: [
                { id: 1, name: "Web & Mobile App Development" },
                { id: 2, name: "Cloud Migration" },
                { id: 3, name: "Cybersecurity" },
                { id: 4, name: "IT Infrastructure" },
                { id: 5, name: "Digital Transformation" },
                { id: 6, name: "Data Analytics" },
                { id: 7, name: "IT Strategy" }
            ]
        });
    } catch (error) {
        console.error('Services error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching services'
        });
    }
});

module.exports = router;