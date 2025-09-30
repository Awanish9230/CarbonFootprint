const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User');
require('../models/Badge');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'myVerySecretKey123!';

// ---------------------- Middleware ----------------------
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ---------------------- REGISTER ----------------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, state, photoURL, goals, communityActivity } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await User.hashPassword(password);

    const user = new User({
      name,
      email,
      passwordHash,
      state: state || '',
      photoURL: photoURL || '',
      rank: 'Beginner',
      posts: 0,
      goals: goals || [],
      communityActivity: communityActivity || '',
      badges: []
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------- LOGIN ----------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------- PROFILE ----------------------
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('badges');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------- Upload Profile Image ----------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', auth, upload.single('profile'), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      user.photoURL = base64Image;
      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error('Profile upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------- Goals CRUD ----------------------

// Add a new goal
router.post('/goals', auth, async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal || !goal.trim()) return res.status(400).json({ message: 'Goal is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.goals = user.goals || [];

    if (!user.goals.some(g => g.text === goal)) {
      user.goals.push({ text: goal, completed: false });
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Add goal error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Update a goal
router.put('/goals/:index', auth, async (req, res) => {
  try {
    const { index } = req.params;
    const { text, completed } = req.body;

    const user = await User.findById(req.userId);
    if (!user || !user.goals[index]) return res.status(404).json({ message: 'Goal not found' });

    if (text !== undefined) user.goals[index].text = text;
    if (completed !== undefined) user.goals[index].completed = completed;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Update goal error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Delete a goal
router.delete('/goals/:index', auth, async (req, res) => {
  try {
    const { index } = req.params;

    const user = await User.findById(req.userId);
    if (!user || !user.goals[index]) return res.status(404).json({ message: 'Goal not found' });

    user.goals.splice(index, 1);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Delete goal error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;
