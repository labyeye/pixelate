const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authmiddleware');

// Admin login
// authRoutes.js
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user (in a real app, you'd query your User model)
    let user;
    if (username === 'admin' && password === 'admin123') {
      user = { _id: '1', username: 'admin', role: 'admin' };
    } else if (username === 'staff' && password === 'staff123') {
      user = { _id: '2', username: 'staff', role: 'staff' };
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;