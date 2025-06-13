const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  topic: {
    type: String,
    required: true,
    enum: ['Operating Systems', 'Databases', 'Networks', 'Algorithms', 'Data Structures', 'Computer Architecture']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard', 'Mixed']
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  timeLimit: { type: Number, default: 30 }, // minutes
  maxAttempts: { type: Number, default: 3 },
  isActive: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);