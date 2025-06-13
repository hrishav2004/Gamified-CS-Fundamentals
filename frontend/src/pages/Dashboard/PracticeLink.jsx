import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';

const PracticeLink = () => {
  const practiceOptions = [
    {
      id: 'quick-quiz',
      title: 'Quick Quiz',
      description: 'Take a 5-10 minute quiz on any topic',
      icon: '⚡',
      duration: '5-10 min',
      questions: '5-10',
      difficulty: 'Mixed',
      color: 'border-yellow-200 hover:border-yellow-300 bg-yellow-50',
      link: '/practice/setup?mode=quick'
    },
    {
      id: 'topic-quiz',
      title: 'Topic-Specific Quiz',
      description: 'Focus on a specific CS fundamental topic',
      icon: '🎯',
      duration: '15-20 min',
      questions: '15-20',
      difficulty: 'Selectable',
      color: 'border-blue-200 hover:border-blue-300 bg-blue-50',
      link: '/practice/setup?mode=topic'
    },
    {
      id: 'maha-quiz',
      title: 'Maha Quiz',
      description: 'Comprehensive quiz covering all topics',
      icon: '🏆',
      duration: '30-45 min',
      questions: '30-50',
      difficulty: 'All Levels',
      color: 'border-purple-200 hover:border-purple-300 bg-purple-50',
      link: '/practice/maha-quiz'
    },
    {
      id: 'challenge-mode',
      title: 'Challenge Friends',
      description: 'Compete head-to-head with your friends',
      icon: '⚔️',
      duration: '10-15 min',
      questions: '10-15',
      difficulty: 'Mixed',
      color: 'border-red-200 hover:border-red-300 bg-red-50',
      link: '/friends/challenge/invite'
    }
  ];

  const recentTopics = [
    { name: 'Operating Systems', score: 85, attempts: 3 },
    { name: 'Databases', score: 92, attempts: 5 },
    { name: 'Algorithms', score: 78, attempts: 2 },
    { name: 'Data Structures', score: 88, attempts: 4 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Practice & Test Your Knowledge 🎯
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose from different quiz modes to test and improve your CS fundamentals knowledge.
        </p>
      </div>

      {/* Practice Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {practiceOptions.map((option) => (
          <Card 
            key={option.id} 
            className={`border-2 ${option.color} transition-all duration-200 hover:shadow-lg`}
            hover
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">{option.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {option.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {option.description}
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{option.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Questions:</span>
                <span className="font-medium">{option.questions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Difficulty:</span>
                <span className="font-medium">{option.difficulty}</span>
              </div>
            </div>

            <Link to={option.link}>
              <Button variant="primary" className="w-full">
                Start {option.title}
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Performance */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Performance 📊
          </h2>
          <div className="space-y-3">
            {recentTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{topic.name}</div>
                  <div className="text-sm text-gray-500">{topic.attempts} attempts</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    topic.score >= 90 ? 'text-green-600' :
                    topic.score >= 80 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {topic.score}%
                  </div>
                  <div className="text-xs text-gray-500">best score</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/performance">
              <Button variant="outline" size="sm" className="w-full">
                View Detailed Performance
              </Button>
            </Link>
          </div>
        </Card>

        {/* Practice Tips */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Practice Tips 💡
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="text-lg">🎯</div>
              <div>
                <h4 className="font-medium text-gray-900">Start with Quick Quizzes</h4>
                <p className="text-sm text-gray-600">Build confidence with shorter, focused sessions.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-lg">📈</div>
              <div>
                <h4 className="font-medium text-gray-900">Track Your Progress</h4>
                <p className="text-sm text-gray-600">Monitor improvement across different topics.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-lg">🔄</div>
              <div>
                <h4 className="font-medium text-gray-900">Review Mistakes</h4>
                <p className="text-sm text-gray-600">Learn from incorrect answers to improve.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-lg">👥</div>
              <div>
                <h4 className="font-medium text-gray-900">Challenge Friends</h4>
                <p className="text-sm text-gray-600">Make learning fun with friendly competition.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Start Section */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to Start Practicing?
          </h2>
          <p className="text-gray-600 mb-4">
            Jump right in with a quick quiz or choose your preferred mode above.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/practice/setup?mode=quick">
              <Button variant="primary">
                Quick Quiz
              </Button>
            </Link>
            <Link to="/practice/setup">
              <Button variant="outline">
                Custom Quiz
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PracticeLink;