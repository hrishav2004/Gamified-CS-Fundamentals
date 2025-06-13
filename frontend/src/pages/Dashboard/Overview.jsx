import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePerformance } from '../../contexts/PerformanceContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Chart from '../../components/Chart';

const Overview = () => {
  const { user } = useAuth();
  const { stats, leaderboard, fetchStats, fetchLeaderboard } = usePerformance();

  useEffect(() => {
    fetchStats();
    fetchLeaderboard();
  }, []);

  const quickStats = [
    {
      title: 'Total Quizzes',
      value: stats?.stats?.totalQuizzes || 0,
      icon: '🎯',
      color: 'text-primary-800'
    },
    {
      title: 'Average Score',
      value: `${Math.round(stats?.stats?.averageScore || 0)}%`,
      icon: '📊',
      color: 'text-secondary-600'
    },
    {
      title: 'Experience Points',
      value: user?.stats?.experience || 0,
      icon: '⭐',
      color: 'text-accent-600'
    },
    {
      title: 'Current Level',
      value: user?.stats?.level || 1,
      icon: '🏆',
      color: 'text-purple-600'
    }
  ];

  const topicPerformanceData = {
    labels: stats?.topicStats?.map(topic => topic._id) || [],
    datasets: [
      {
        label: 'Average Score',
        data: stats?.topicStats?.map(topic => topic.averageScore) || [],
        backgroundColor: 'rgba(30, 58, 138, 0.8)',
        borderColor: 'rgba(30, 58, 138, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.profile?.firstName || user?.username}! 👋
        </h1>
        <p className="text-primary-100 mb-4">
          Ready to continue your CS fundamentals journey?
        </p>
        <div className="flex space-x-4">
          <Link to="/practice/setup">
            <Button variant="accent">
              Start Quiz
            </Button>
          </Link>
          <Link to="/learn/topics">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-800">
              Explore Topics
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="text-center">
            <div className={`text-3xl mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.title}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Topic Performance Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance by Topic
          </h3>
          {stats?.topicStats?.length > 0 ? (
            <Chart
              type="bar"
              data={topicPerformanceData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No performance data yet</p>
              <p className="text-sm">Take some quizzes to see your progress!</p>
            </div>
          )}
        </Card>

        {/* Leaderboard */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Leaderboard 🏆
          </h3>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((player, index) => (
              <div key={player._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {player.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      Level {player.stats.level}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {player.stats.totalScore}
                  </div>
                  <div className="text-xs text-gray-500">
                    points
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/performance">
              <Button variant="outline" size="sm" className="w-full">
                View Full Leaderboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/practice/setup" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-gray-900">Take a Quiz</div>
              <div className="text-sm text-gray-600">Test your knowledge</div>
            </div>
          </Link>
          <Link to="/friends" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-secondary-300 hover:bg-secondary-50 transition-colors">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-medium text-gray-900">Challenge Friends</div>
              <div className="text-sm text-gray-600">Compete with others</div>
            </div>
          </Link>
          <Link to="/learn/topics" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-accent-300 hover:bg-accent-50 transition-colors">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-medium text-gray-900">Study Materials</div>
              <div className="text-sm text-gray-600">Learn new concepts</div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Overview;