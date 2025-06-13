import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';

const LearnLink = () => {
  const topics = [
    {
      id: 'operating-systems',
      title: 'Operating Systems',
      description: 'Learn about processes, memory management, file systems, and more',
      icon: '💻',
      difficulty: 'Intermediate',
      lessons: 12,
      color: 'border-blue-200 hover:border-blue-300'
    },
    {
      id: 'databases',
      title: 'Databases',
      description: 'Master SQL, NoSQL, database design, and optimization techniques',
      icon: '🗄️',
      difficulty: 'Beginner',
      lessons: 15,
      color: 'border-green-200 hover:border-green-300'
    },
    {
      id: 'networks',
      title: 'Computer Networks',
      description: 'Understand protocols, network architecture, and security',
      icon: '🌐',
      difficulty: 'Advanced',
      lessons: 10,
      color: 'border-purple-200 hover:border-purple-300'
    },
    {
      id: 'algorithms',
      title: 'Algorithms',
      description: 'Explore sorting, searching, and algorithmic problem solving',
      icon: '🧮',
      difficulty: 'Intermediate',
      lessons: 18,
      color: 'border-red-200 hover:border-red-300'
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      description: 'Arrays, linked lists, trees, graphs, and their applications',
      icon: '🏗️',
      difficulty: 'Beginner',
      lessons: 14,
      color: 'border-yellow-200 hover:border-yellow-300'
    },
    {
      id: 'computer-architecture',
      title: 'Computer Architecture',
      description: 'CPU design, memory hierarchy, and system organization',
      icon: '🔧',
      difficulty: 'Advanced',
      lessons: 8,
      color: 'border-indigo-200 hover:border-indigo-300'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Learn CS Fundamentals 📚
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Master computer science concepts through interactive lessons, examples, and hands-on exercises.
        </p>
      </div>

      {/* Learning Path Overview */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your Learning Journey
            </h2>
            <p className="text-gray-600">
              Progress through structured lessons and build your CS knowledge step by step.
            </p>
          </div>
          <div className="text-4xl">
            🎓
          </div>
        </div>
      </Card>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card 
            key={topic.id} 
            className={`border-2 ${topic.color} transition-all duration-200 hover:shadow-lg`}
            hover
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{topic.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {topic.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {topic.description}
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                {topic.difficulty}
              </span>
              <span className="text-sm text-gray-500">
                {topic.lessons} lessons
              </span>
            </div>

            <div className="space-y-2">
              <Link to={`/learn/topics?topic=${topic.id}`}>
                <Button variant="primary" size="sm" className="w-full">
                  Start Learning
                </Button>
              </Link>
              <Link to={`/practice/setup?topic=${topic.title}`}>
                <Button variant="outline" size="sm" className="w-full">
                  Practice Quiz
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Study Tips */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Study Tips for Success 💡
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="text-xl">📝</div>
              <div>
                <h4 className="font-medium text-gray-900">Take Notes</h4>
                <p className="text-sm text-gray-600">Write down key concepts and examples as you learn.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-xl">🔄</div>
              <div>
                <h4 className="font-medium text-gray-900">Practice Regularly</h4>
                <p className="text-sm text-gray-600">Consistent practice helps reinforce your understanding.</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="text-xl">👥</div>
              <div>
                <h4 className="font-medium text-gray-900">Study with Friends</h4>
                <p className="text-sm text-gray-600">Challenge friends and learn together.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-xl">🎯</div>
              <div>
                <h4 className="font-medium text-gray-900">Set Goals</h4>
                <p className="text-sm text-gray-600">Track your progress and celebrate achievements.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LearnLink;