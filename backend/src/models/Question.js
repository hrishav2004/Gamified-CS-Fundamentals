const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    enum: ['Operating Systems', 'Databases', 'Networks', 'Algorithms', 'Data Structures', 'Computer Architecture']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
  }],
  explanation: String,
  points: {
    type: Number,
    default: function() {
      const pointsMap = { 'Easy': 10, 'Medium': 20, 'Hard': 30 };
      return pointsMap[this.difficulty] || 10;
    }
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isApproved: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);