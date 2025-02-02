const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Car = require('../models/car');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Get all cars
router.get('/', auth, async (req, res) => {
    try {
        const cars = await Car.find()
            .populate('owner', 'username')
            .sort({ createdAt: -1 });
        res.json({ cars });
    } catch (err) {
        console.error('Error fetching cars:', err);
        res.status(500).json({ error: 'Error fetching cars' });
    }
});

// Get single car
router.get('/:id', auth, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching car' });
    }
});

// Create new car
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('File:', req.file);

        const carData = {
            make: req.body.make,
            model: req.body.model,
            year: parseInt(req.body.year),
            price: parseFloat(req.body.price),
            description: req.body.description,
            owner: req.user._id
        };

        if (req.file) {
            carData.image = req.file.path;
        }

        const car = new Car(carData);
        await car.save();

        res.status(201).json(car);
    } catch (err) {
        console.error('Error creating car:', err);
        res.status(500).json({ 
            error: 'Error creating car',
            details: err.message 
        });
    }
});

// Update car
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        
        if (car.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const updates = { ...req.body };
        if (req.file) {
            updates.image = req.file.path;
        }

        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );
        res.json(updatedCar);
    } catch (err) {
        res.status(400).json({ error: 'Error updating car' });
    }
});

// Delete car
router.delete('/:id', auth, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        
        if (car.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await car.remove();
        res.json({ message: 'Car deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting car' });
    }
});

// Search cars
router.get('/search', auth, async (req, res) => {
    try {
        const { q } = req.query;
        const cars = await Car.find({
            $or: [
                { make: { $regex: q, $options: 'i' } },
                { model: { $regex: q, $options: 'i' } }
            ]
        });
        res.json({ cars });
    } catch (err) {
        res.status(500).json({ error: 'Error searching cars' });
    }
});

// Get user's cars
router.get('/user', auth, async (req, res) => {
    try {
        const cars = await Car.find({ owner: req.user._id })
            .sort({ createdAt: -1 });
        res.json(cars);
    } catch (err) {
        console.error('Error fetching user cars:', err);
        res.status(500).json({ error: 'Error fetching user cars' });
    }
});

module.exports = router; 