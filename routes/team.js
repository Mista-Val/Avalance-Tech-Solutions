const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Get team members
        res.json({
            success: true,
            data: [
                {
                    id: 1,
                    name: "Sarah Johnson",
                    role: "Chief Technology Officer",
                    expertise: "Cloud Architecture, Digital Transformation"
                },
                {
                    id: 2,
                    name: "Michael Chen",
                    role: "Cybersecurity Specialist",
                    expertise: "Threat Assessment, Risk Management"
                },
                {
                    id: 3,
                    name: "Emily Rodriguez",
                    role: "Data Analytics Director",
                    expertise: "Business Intelligence, Data Science"
                },
                {
                    id: 4,
                    name: "David Kumar",
                    role: "Infrastructure Architect",
                    expertise: "Scalable Infrastructure, Cloud Design"
                }
            ]
        });
    } catch (error) {
        console.error('Team error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching team members'
        });
    }
});

module.exports = router;