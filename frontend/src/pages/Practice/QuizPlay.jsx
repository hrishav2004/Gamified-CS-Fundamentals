import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuiz } from '../../contexts/QuizContext';
import Card from '../../components/Card';
import Button from '../../components/Button';

const QuizPlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchQuizById, submitQuiz, currentQuiz, loading } = useQuiz();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Parse settings from URL
  const settings = searchParams.get('settings') 
    ? JSON.parse(decodeURIComponent(searchParams.get('settings')))
    : { timeLimit: 15, questionCount: 10 };

  useEffect(() => {
    fetchQuizById(id);
  }, [id]);

  useEffect(() => {
    if (currentQuiz) {
      setTimeLeft(settings.timeLimit * 60); // Convert minutes to seconds
    }
  }, [currentQuiz, settings.timeLimit]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentQuiz) {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        selectedOption: optionIndex,
        timeSpent
      }
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < Math.min(currentQuiz.questions.length - 1, settings.questionCount - 1)) {
      setCurrentQuestion(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleSubmitQuiz = async () => {
    const totalTimeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
    const answerArray = currentQuiz.questions.slice(0, settings.questionCount).map(question => 
      answers[question._id] || { selectedOption: -1, timeSpent: 0 }
    );

    try {
      await submitQuiz(currentQuiz._id, answerArray, totalTimeSpent);
      navigate('/practice/result');
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / Math.min(currentQuiz?.questions?.length || 1, settings.questionCount)) * 100;
  };

  if (loading || !currentQuiz) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  const question = currentQuiz.questions[currentQuestion];
  const totalQuestions = Math.min(currentQuiz.questions.length, settings.questionCount);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {currentQuiz.title}
            </h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
              ⏰ {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-600">
              Time remaining
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-800 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </Card>

      {/* Question Card */}
      <Card className="min-h-96">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-primary-600">
              {question.topic} • {question.difficulty}
            </span>
            <span className="text-sm text-gray-500">
              {question.points} points
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(question._id, index)}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                answers[question._id]?.selectedOption === index
                  ? 'border-primary-500 bg-primary-50 text-primary-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  answers[question._id]?.selectedOption === index
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-gray-300'
                }`}>
                  {answers[question._id]?.selectedOption === index && '✓'}
                </div>
                <span className="text-gray-900">{option.text}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <Card>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </Button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {Object.keys(answers).length} of {totalQuestions} answered
            </span>
            <Button
              variant="accent"
              onClick={handleSubmitQuiz}
            >
              Submit Quiz
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={handleNextQuestion}
            disabled={!answers[question._id]}
          >
            {currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next →'}
          </Button>
        </div>
      </Card>

      {/* Question Navigation */}
      <Card>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Question Navigation</h3>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestion(index);
                setQuestionStartTime(Date.now());
              }}
              className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                index === currentQuestion
                  ? 'bg-primary-800 text-white'
                  : answers[currentQuiz.questions[index]?._id]
                  ? 'bg-secondary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default QuizPlay;