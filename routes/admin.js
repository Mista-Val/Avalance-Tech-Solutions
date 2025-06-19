const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// Admin dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const stats = await Contact.aggregate([
            {
                $group: {
                    _id: null,
                    totalContacts: { $sum: 1 },
                    statusCounts: {
                        $sum: {
                            $cond: [
                                { $in: ['$status', ['new', 'in_progress', 'completed', 'closed']] },
                                1,
                                0
                            ]
                        }
                    },
                    priorityCounts: {
                        $sum: {
                            $cond: [
                                { $in: ['$priority', ['low', 'medium', 'high']] },
                                1,
                                0
                            ]
                        }
                    },
                    statusDistribution: {
                        $push: {
                            status: '$status',
                            count: { $sum: 1 }
                        }
                    },
                    priorityDistribution: {
                        $push: {
                            priority: '$priority',
                            count: { $sum: 1 }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalContacts: 1,
                    statusCounts: 1,
                    priorityCounts: 1,
                    statusDistribution: {
                        $reduce: {
                            input: '$statusDistribution',
                            initialValue: {},
                            in: {
                                $mergeObjects: [
                                    '$$value',
                                    { $arrayToObject: [[{ k: '$$this.status', v: '$$this.count' }]] }
                                ]
                            }
                        }
                    },
                    priorityDistribution: {
                        $reduce: {
                            input: '$priorityDistribution',
                            initialValue: {},
                            in: {
                                $mergeObjects: [
                                    '$$value',
                                    { $arrayToObject: [[{ k: '$$this.priority', v: '$$this.count' }]] }
                                ]
                            }
                        }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admin stats'
        });
    }
});

module.exports = router;