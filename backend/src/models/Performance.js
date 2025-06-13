const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: Number,
    isCorrect: Boolean,
    timeSpent: Number // seconds
  }],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  timeSpent: { type: Number, required: true }, // total time in seconds
  completedAt: { type: Date, default: Date.now },
  experienceGained: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Performance', performanceSchema);