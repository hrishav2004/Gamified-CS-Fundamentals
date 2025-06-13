const express = require('express');
const { 
  getQuizzes, 
  getQuizById, 
  createQuiz, 
  submitQuiz 
} = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getQuizzes);
router.get('/:id', authMiddleware, getQuizById);
router.post('/', authMiddleware, createQuiz);
router.post('/submit', authMiddleware, submitQuiz);

module.exports = router;