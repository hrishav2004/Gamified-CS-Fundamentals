import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChallenge } from '../../contexts/ChallengeContext';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ChallengePlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentChallenge, startChallenge, finishChallenge } = useChallenge();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [challengeStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Mock challenge data - in real app, this would come from API
  const mockChallenge = {
    id: id,
    challenger: { username: 'You', avatar: '👤' },
    opponent: { username: 'Alex Chen', avatar: '👤' },
    quiz: {
      title: 'Operating Systems Challenge',
      topic: 'Operating Systems',
      difficulty: 'Medium',
      timeLimit: 15,
      questions: [
        {
          _id: '1',
          question: 'What is the primary purpose of an operating system?',
          options: [
            { text: 'To provide a user interface', isCorrect: false },
            { text: 'To manage computer hardware and software resources', isCorrect: true },
            { text: 'To run applications', isCorrect: false },
            { text: 'To connect to the internet', isCorrect: false }
          ],
          points: 20,
          topic: 'Operating Systems',
          difficulty: 'Medium'
        },
        {
          _id: '2',
          question: 'Which scheduling algorithm gives priority to the shortest job?',
          options: [
            { text: 'First Come First Serve (FCFS)', isCorrect: false },
            { text: 'Round Robin', isCorrect: false },
            { text: 'Shortest Job First (SJF)', isCorrect: true },
            { text: 'Priority Scheduling', isCorrect: false }
          ],
          points: 20,
          topic: 'Operating Systems',
          difficulty: 'Medium'
        }
      ]
    },
    status: 'active',
    startedAt: new Date().toISOString()
  };

  useEffect(() => {
    // In real app, fetch challenge data by ID
    startChallenge(mockChallenge);
    setTimeLeft(mockChallenge.quiz.timeLimit * 60);
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && mockChallenge) {
      handleSubmitChallenge();
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
    if (currentQuestion < mockChallenge.quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      handleSubmitChallenge();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleSubmitChallenge = () => {
    const totalTimeSpent = Math.floor((Date.now() - challengeStartTime) / 1000);
    
    // Calculate score
    let score = 0;
    let correctAnswers = 0;
    
    mockChallenge.quiz.questions.forEach(question => {
      const answer = answers[question._id];
      if (answer && question.options[answer.selectedOption]?.isCorrect) {
        score += question.points;
        correctAnswers++;
      }
    });

    const result = {
      challengeId: id,
      score,
      correctAnswers,
      totalQuestions: mockChallenge.quiz.questions.length,
      timeSpent: totalTimeSpent,
      answers
    };

    finishChallenge(result);
    navigate(`/friends/challenge/result/${id}`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / mockChallenge.quiz.questions.length) * 100;
  };

  const question = mockChallenge.quiz.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Challenge Header */}
      <Card className="bg-gradient-to-r from-red-50 to-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl mb-1">{mockChallenge.challenger.avatar}</div>
              <div className="font-medium text-gray-900">{mockChallenge.challenger.username}</div>
              <div className="text-sm text-gray-600">Challenger</div>
            </div>
            <div className="text-2xl font-bold text-gray-400">VS</div>
            <div className="text-center">
              <div className="text-2xl mb-1">{mockChallenge.opponent.avatar}</div>
              <div className="font-medium text-gray-900">{mockChallenge.opponent.username}</div>
              <div className="text-sm text-gray-600">Opponent</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
              ⏰ {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-600">Time remaining</div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {mockChallenge.quiz.title}
          </h1>
          <p className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {mockChallenge.quiz.questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-gradient-to-r from-red-500 to-blue-500 h-2 rounded-full transition-all duration-300"
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
              {Object.keys(answers).length} of {mockChallenge.quiz.questions.length} answered
            </span>
            <Button
              variant="accent"
              onClick={handleSubmitChallenge}
            >
              Submit Challenge
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={handleNextQuestion}
            disabled={!answers[question._id]}
          >
            {currentQuestion === mockChallenge.quiz.questions.length - 1 ? 'Finish' : 'Next →'}
          </Button>
        </div>
      </Card>

      {/* Challenge Status */}
      <Card className="bg-yellow-50">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-yellow-600">⚔️</span>
          <span className="font-medium text-yellow-800">
            Challenge in Progress - Give it your best shot!
          </span>
        </div>
      </Card>
    </div>
  );
};

export default ChallengePlay;