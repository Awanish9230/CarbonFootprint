require('dotenv').config(); // Load env variables at the very top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
const authRoutes = require('./routes/authRoutes');
const emissionRoutes = require('./routes/emissionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const communityRoutes = require('./routes/communityRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/emissions', emissionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/community', communityRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Carbon Footprint Tracker API' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// Start server after connecting to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carbon_footprint_tracker';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
