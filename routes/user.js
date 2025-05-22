// routes/user.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Household = require('../models/Household');

const router = express.Router();

// JWT secret
const JWT_SECRET = 'your_jwt_secret';

// Register new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    // Create JWT token
    const payload = { userId: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Create JWT token
    const payload = { userId: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create a household
router.post('/household', async (req, res) => {
  const { userId } = req.user; // Assuming this comes from middleware that decodes the JWT
  const { name } = req.body;

  try {
    const household = new Household({ name, admin: userId });
    await household.save();

    // Add household to user
    await User.findByIdAndUpdate(userId, { householdId: household._id });

    res.json({ household });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
