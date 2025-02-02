const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Car = require('../models/car');

// Update user settings
router.put('/settings', auth, async (req, res) => {
  try {
    const { email, currentPassword, newPassword, preferences } = req.body;
    const user = await User.findById(req.user.id);
    
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }
    
    if (email) user.email = email;
    if (preferences) user.preferences = preferences;
    
    await user.save();
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Manage favorites
router.post('/favorites/:carId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites.addToSet(req.params.carId);
    await user.save();
    res.json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/favorites/:carId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites.pull(req.params.carId);
    await user.save();
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                error: 'User already exists' 
            });
        }

        // Create new user
        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ 
            error: 'Error creating user',
            details: err.message 
        });
    }
});

// Add this new route for checking authentication
router.get('/check-auth', auth, async (req, res) => {
    try {
        // auth middleware already verified the token and attached user
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(401).json({ error: 'Authentication failed' });
    }
});

// Add route for getting user's cars
router.get('/cars', auth, async (req, res) => {
    try {
        const cars = await Car.find({ owner: req.user._id });
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user cars' });
    }
});

module.exports = router; 