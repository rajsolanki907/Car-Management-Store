const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Car = require('../models/car');
const User = require('../models/user');

router.get('/dashboard', auth, async (req, res) => {
    try {
        const totalCars = await Car.countDocuments();
        const totalUsers = await User.countDocuments();
        
        res.json({
            totalCars,
            totalUsers,
            carsByMake: {},
            carsByYear: {},
            recentActivity: []
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching stats' });
    }
});

module.exports = router; 