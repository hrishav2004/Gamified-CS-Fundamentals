import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';

const MahaQuiz = () => {
  const [selectedMode, setSelectedMode] = useState('comprehensive');

  const quizModes = {
    comprehensive: {
      title: 'Comprehensive Challenge',
      description: 'Test your knowledge across all CS fundamental topics',
      duration: '45 minutes',
      questions: 50,
      difficulty: 'All Levels',
      topics: ['Operating Systems', 'Databases', 'Networks', 'Algorithms', 'Data Structures', 'Computer Architecture'],
      icon: '🏆',
      color: 'border-yellow-300 bg-yellow-50'
    },
    expert: {
      title: 'Expert Level',
      description: 'Advanced questions for experienced learners',
      duration: '60 minutes',
      questions: 40,
      difficulty: 'Hard',
      topics: ['Advanced OS Concepts', 'Database Optimization', 'Network Security', 'Complex Algorithms'],
      icon: '🎯',
      color: 'border-red-300 bg-red-50'
    },
    speedRun: {
      title: 'Speed Run',
      description: 'Quick-fire questions to test your instant recall',
      duration: '20 minutes',
      questions: 30,
      difficulty: 'Mixed',
      topics: ['Quick Concepts', 'Definitions', 'Basic Principles'],
      icon: '⚡',
      color: 'border-blue-300 bg-blue-50'
    }
  };

  const achievements = [
    { name: 'Maha Master', description: 'Score 90%+ on comprehensive quiz', icon: '👑' },
    { name: 'Speed Demon', description: 'Complete speed run in under 15 minutes', icon: '🏃' },
    { name: 'Expert Scholar', description: 'Pass expert level quiz', icon: '🎓' },
    { name: 'Perfect Score', description: 'Get 100% on any Maha Quiz', icon: '💯' }
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Chen', score: 95, mode: 'Comprehensive', time: '42:30' },
    { rank: 2, name: 'Sarah Kim', score: 92, mode: 'Expert', time: '55:15' },
    { rank: 3, name: 'Mike Johnson', score: 90, mode: 'Comprehensive', time: '44:20' },
    { rank: 4, name: 'Emma Davis', score: 88, mode: 'Speed Run', time: '18:45' },
    { rank: 5, name: 'David Wilson', score: 85, mode: 'Expert', time: '58:30' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Maha Quiz Challenge 🏆
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Take on the ultimate CS fundamentals challenge! Test your comprehensive knowledge 
          and compete with learners worldwide.
        </p>
      </div>

      {/* Quiz Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(quizModes).map(([key, mode]) => (
          <Card 
            key={key}
            className={`border-2 cursor-pointer transition-all duration-200 ${
              selectedMode === key 
                ? mode.color + ' ring-2 ring-primary-500' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedMode(key)}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{mode.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {mode.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {mode.description}
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{mode.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Questions:</span>
                <span className="font-medium">{mode.questions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Difficulty:</span>
                <span className="font-medium">{mode.difficulty}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Topics Covered:</h4>
              <div className="flex flex-wrap gap-1">
                {mode.topics.slice(0, 3).map((topic, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {topic}
                  </span>
                ))}
                {mode.topics.length > 3 && (
                  <span className="text-xs text-gray-500">+{mode.topics.length - 3} more</span>
                )}
              </div>
            </div>

            {selectedMode === key && (
              <div className="mt-4">
                <Link to={`/practice/quiz/maha-${key}`}>
                  <Button variant="primary" className="w-full">
                    Start {mode.title}
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Maha Quiz Achievements 🏅
          </h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <div className="font-medium text-gray-900">{achievement.name}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Leaderboard */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Maha Quiz Leaderboard 🏆
          </h2>
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div key={entry.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                    entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                    entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {entry.rank}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{entry.name}</div>
                    <div className="text-sm text-gray-500">{entry.mode} • {entry.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{entry.score}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quiz Rules */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Maha Quiz Rules & Guidelines 📋
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">General Rules</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• No external resources or help allowed</li>
              <li>• Timer cannot be paused once started</li>
              <li>• Each question must be answered to proceed</li>
              <li>• Results are final and cannot be retaken immediately</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Scoring System</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Correct answers: Full points</li>
              <li>• Time bonus: Faster completion = bonus points</li>
              <li>• Difficulty multiplier: Harder questions worth more</li>
              <li>• Streak bonus: Consecutive correct answers</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ready for the Ultimate Challenge?
        </h2>
        <p className="text-gray-600 mb-6">
          Select your preferred mode above and prove your CS fundamentals mastery!
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/practice/setup">
            <Button variant="outline">
              Practice First
            </Button>
          </Link>
          <Button 
            variant="primary"
            onClick={() => {
              const mode = quizModes[selectedMode];
              // Navigate to selected quiz mode
              window.location.href = `/practice/quiz/maha-${selectedMode}`;
            }}
          >
            Start {quizModes[selectedMode].title}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MahaQuiz;