const Performance = require('../models/Performance');
const User = require('../models/User');

const getUserPerformance = async (req, res) => {
  try {
    const performances = await Performance.find({ user: req.user._id })
      .populate('quiz', 'title topic difficulty')
      .sort({ completedAt: -1 });

    res.json({ performances });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPerformanceStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Performance.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          totalScore: { $sum: '$score' },
          averageScore: { $avg: '$score' },
          totalCorrectAnswers: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: '$totalQuestions' }
        }
      }
    ]);

    const topicStats = await Performance.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizData'
        }
      },
      { $unwind: '$quizData' },
      {
        $group: {
          _id: '$quizData.topic',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);

    res.json({
      stats: stats[0] || {
        totalQuizzes: 0,
        totalScore: 0,
        averageScore: 0,
        totalCorrectAnswers: 0,
        totalQuestions: 0
      },
      topicStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .select('username profile stats')
      .sort({ 'stats.totalScore': -1 })
      .limit(10);

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserPerformance,
  getPerformanceStats,
  getLeaderboard
};