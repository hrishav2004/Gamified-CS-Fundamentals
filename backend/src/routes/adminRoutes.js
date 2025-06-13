const express = require('express');
const { getQuestions, createQuestion, approveQuestion } = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminKeyMiddleware = require('../middlewares/adminKeyMiddleware');

const router = express.Router();

// Admin routes require both auth and admin key
router.use(authMiddleware);
router.use(adminKeyMiddleware);

router.get('/questions', getQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id/approve', approveQuestion);

module.exports = router;