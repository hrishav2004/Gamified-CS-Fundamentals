import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuiz } from '../../contexts/QuizContext';
import Card from '../../components/Card';
import Button from '../../components/Button';

const QuizSetup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchQuizzes, quizzes, loading } = useQuiz();

  const [settings, setSettings] = useState({
    topic: searchParams.get('topic') || '',
    difficulty: '',
    questionCount: 10,
    timeLimit: 15
  });

  const topics = [
    'Operating Systems',
    'Databases', 
    'Networks',
    'Algorithms',
    'Data Structures',
    'Computer Architecture'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard', 'Mixed'];

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStartQuiz = () => {
    // Filter quizzes based on settings
    const filteredQuizzes = quizzes.filter(quiz => {
      if (settings.topic && quiz.topic !== settings.topic) return false;
      if (settings.difficulty && settings.difficulty !== 'Mixed' && quiz.difficulty !== settings.difficulty) return false;
      return true;
    });

    if (filteredQuizzes.length === 0) {
      alert('No quizzes found matching your criteria. Please adjust your settings.');
      return;
    }

    // Select a random quiz from filtered results
    const selectedQuiz = filteredQuizzes[Math.floor(Math.random() * filteredQuizzes.length)];
    navigate(`/practice/quiz/${selectedQuiz._id}?settings=${encodeURIComponent(JSON.stringify(settings))}`);
  };

  const getRecommendedSettings = () => {
    return {
      beginner: { questionCount: 5, timeLimit: 10, difficulty: 'Easy' },
      intermediate: { questionCount: 10, timeLimit: 15, difficulty: 'Medium' },
      advanced: { questionCount: 15, timeLimit: 20, difficulty: 'Hard' }
    };
  };

  const applyRecommendedSettings = (level) => {
    const recommended = getRecommendedSettings()[level];
    setSettings(prev => ({
      ...prev,
      ...recommended
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Quiz Setup 🎯
        </h1>
        <p className="text-lg text-gray-600">
          Customize your quiz experience to match your learning goals.
        </p>
      </div>

      {/* Quick Setup Options */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Setup
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(getRecommendedSettings()).map(([level, config]) => (
            <button
              key={level}
              onClick={() => applyRecommendedSettings(level)}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
            >
              <div className="font-medium text-gray-900 capitalize mb-1">
                {level}
              </div>
              <div className="text-sm text-gray-600">
                {config.questionCount} questions • {config.timeLimit} min • {config.difficulty}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Custom Settings */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Custom Settings
        </h2>
        
        <div className="space-y-6">
          {/* Topic Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic (Optional)
            </label>
            <select
              value={settings.topic}
              onChange={(e) => handleSettingChange('topic', e.target.value)}
              className="input-field"
            >
              <option value="">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => handleSettingChange('difficulty', difficulty)}
                  className={`p-2 rounded-md text-sm font-medium transition-colors ${
                    settings.difficulty === difficulty
                      ? 'bg-primary-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions: {settings.questionCount}
            </label>
            <input
              type="range"
              min="5"
              max="25"
              step="5"
              value={settings.questionCount}
              onChange={(e) => handleSettingChange('questionCount', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span>25</span>
            </div>
          </div>

          {/* Time Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Limit: {settings.timeLimit} minutes
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={settings.timeLimit}
              onChange={(e) => handleSettingChange('timeLimit', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 min</span>
              <span>15 min</span>
              <span>30 min</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Quiz Preview */}
      <Card className="bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-3">Quiz Preview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary-800">
              {settings.topic || 'Mixed'}
            </div>
            <div className="text-xs text-gray-600">Topic</div>
          </div>
          <div>
            <div className="text-lg font-bold text-secondary-600">
              {settings.difficulty || 'Mixed'}
            </div>
            <div className="text-xs text-gray-600">Difficulty</div>
          </div>
          <div>
            <div className="text-lg font-bold text-accent-600">
              {settings.questionCount}
            </div>
            <div className="text-xs text-gray-600">Questions</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {settings.timeLimit}m
            </div>
            <div className="text-xs text-gray-600">Time Limit</div>
          </div>
        </div>
      </Card>

      {/* Start Quiz Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleStartQuiz}
          loading={loading}
          disabled={loading}
          className="px-8 py-3 text-lg"
        >
          Start Quiz 🚀
        </Button>
      </div>
    </div>
  );
};

export default QuizSetup;