const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const adminRoutes = require('./routes/adminRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const { getUserPerformance, getPerformanceStats, getLeaderboard } = require('./controllers/performanceController');
const { sendFriendRequest, getFriendRequests, respondToFriendRequest, getFriends } = require('./controllers/friendController');
const authMiddleware = require('./middlewares/authMiddleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/challenges', challengeRoutes);

// Performance routes
app.get('/api/performance', authMiddleware, getUserPerformance);
app.get('/api/performance/stats', authMiddleware, getPerformanceStats);
app.get('/api/leaderboard', authMiddleware, getLeaderboard);

// Friend routes
app.post('/api/friends/request', authMiddleware, sendFriendRequest);
app.get('/api/friends/requests', authMiddleware, getFriendRequests);
app.post('/api/friends/respond', authMiddleware, respondToFriendRequest);
app.get('/api/friends', authMiddleware, getFriends);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'CS Fundamentals Gamified API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});