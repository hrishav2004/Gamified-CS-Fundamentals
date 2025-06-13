const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Performance = require('../models/Performance');

const getQuizzes = async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    const filter = { isActive: true };
    
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter)
      .populate('questions')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({ quizzes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('questions')
      .populate('createdBy', 'username');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { title, description, topic, difficulty, questionIds, timeLimit } = req.body;

    const quiz = new Quiz({
      title,
      description,
      topic,
      difficulty,
      questions: questionIds,
      timeLimit,
      createdBy: req.user._id
    });

    await quiz.save();
    await quiz.populate('questions');

    res.status(201).json({ 
      message: 'Quiz created successfully', 
      quiz 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeSpent } = req.body;
    
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let correctAnswers = 0;
    let score = 0;
    const processedAnswers = [];

    answers.forEach((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = question.options[answer.selectedOption]?.isCorrect || false;
      
      if (isCorrect) {
        correctAnswers++;
        score += question.points;
      }

      processedAnswers.push({
        question: question._id,
        selectedOption: answer.selectedOption,
        isCorrect,
        timeSpent: answer.timeSpent || 0
      });
    });

    const performance = new Performance({
      user: req.user._id,
      quiz: quizId,
      answers: processedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent,
      experienceGained: score
    });

    await performance.save();

    // Update user stats
    await req.user.updateOne({
      $inc: {
        'stats.totalQuizzes': 1,
        'stats.totalScore': score,
        'stats.experience': score
      }
    });

    res.json({
      message: 'Quiz submitted successfully',
      performance: {
        score,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        timeSpent,
        experienceGained: score
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  createQuiz,
  submitQuiz
};