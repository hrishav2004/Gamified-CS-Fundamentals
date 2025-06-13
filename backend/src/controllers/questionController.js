const Question = require('../models/Question');

const getQuestions = async (req, res) => {
  try {
    const { topic, difficulty, approved } = req.query;
    const filter = {};
    
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    if (approved !== undefined) filter.isApproved = approved === 'true';

    const questions = await Question.find(filter)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { topic, difficulty, question, options, explanation, tags } = req.body;

    const newQuestion = new Question({
      topic,
      difficulty,
      question,
      options,
      explanation,
      tags,
      createdBy: req.user._id
    });

    await newQuestion.save();

    res.status(201).json({
      message: 'Question created successfully',
      question: newQuestion
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const approveQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question approved successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
  approveQuestion
};