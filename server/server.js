const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/user');
const Car = require('./models/car');

const app = express();
const port = process.env.PORT || 3000;

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Express Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

// API Routes
app.post('/users/signup', (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email });
  User.register(newUser, password, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    passport.authenticate('local')(req, res, () => {
      res.status(200).json({ message: 'Signup successful' });
    });
  });
});

app.post('/users/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ message: 'Login successful' });
});

app.post('/cars', isLoggedIn, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = req.files.map(file => file.path);
    const newCar = new Car({ title, description, tags, images, user: req.user._id });
    const car = await newCar.save();
    res.status(201).json({ message: 'Car added', car });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/cars', isLoggedIn, async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user._id });
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/cars/search', isLoggedIn, async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const cars = await Car.find({ user: req.user._id, $or: [{ title: new RegExp(keyword, 'i') }, { description: new RegExp(keyword, 'i') }, { tags: new RegExp(keyword, 'i') }] });
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/cars/:id', isLoggedIn, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/cars/:id', isLoggedIn, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = req.files.map(file => file.path);
    const car = await Car.findByIdAndUpdate(req.params.id, { title, description, tags, images }, { new: true });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car updated', car });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/cars/:id', isLoggedIn, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});