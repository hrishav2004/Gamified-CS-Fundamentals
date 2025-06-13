import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePerformance } from '../../contexts/PerformanceContext';
import Card from '../../components/Card';
import Button from '../../components/Button';

const PerformanceHistory = () => {
  const { performances, stats, leaderboard, fetchPerformances, fetchStats, fetchLeaderboard, loading } = usePerformance();

  useEffect(() => {
    fetchPerformances();
    fetchStats();
    fetchLeaderboard();
  }, []);

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeFromPercentage = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Performance Dashboard 📊
        </h1>
        <p className="text-lg text-gray-600">
          Track your progress and analyze your learning journey.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.stats?.totalQuizzes || 0}
          </div>
          <div className="text-sm text-gray-600">Total Quizzes</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(stats?.stats?.averageScore || 0)}%
          </div>
          <div className="text-sm text-gray-600">Average Score</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.stats?.totalCorrectAnswers || 0}
          </div>
          <div className="text-sm text-gray-600">Correct Answers</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.stats?.totalScore || 0}
          </div>
          <div className="text-sm text-gray-600">Total Points</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Quiz History */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Quiz History
              </h2>
              <Link to="/performance/chart">
                <Button variant="outline" size="sm">
                  View Charts
                </Button>
              </Link>
            </div>
            
            {performances.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📝</div>
                <p className="mb-2">No quiz history yet</p>
                <p className="text-sm">Take your first quiz to see your performance here!</p>
                <Link to="/practice/setup" className="mt-4 inline-block">
                  <Button variant="primary" size="sm">
                    Take a Quiz
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {performances.slice(0, 10).map((performance) => {
                  const percentage = Math.round((performance.score / (performance.totalQuestions * 10)) * 100);
                  const grade = getGradeFromPercentage(percentage);
                  
                  return (
                    <div key={performance._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {performance.quiz?.title || 'Quiz'}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{performance.quiz?.topic}</span>
                            <span>•</span>
                            <span>{performance.quiz?.difficulty}</span>
                            <span>•</span>
                            <span>{new Date(performance.completedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${getScoreColor(performance.score, performance.totalQuestions * 10)}`}>
                            {grade}
                          </div>
                          <div className="text-sm text-gray-600">
                            {percentage}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Score: </span>
                          <span className="font-medium">{performance.score}/{performance.totalQuestions * 10}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Correct: </span>
                          <span className="font-medium">{performance.correctAnswers}/{performance.totalQuestions}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Time: </span>
                          <span className="font-medium">{Math.floor(performance.timeSpent / 60)}m {performance.timeSpent % 60}s</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Leaderboard */}
        <div>
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Leaderboard 🏆
            </h2>
            <div className="space-y-3">
              {leaderboard.slice(0, 10).map((player, index) => (
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
          </Card>
        </div>
      </div>

      {/* Topic Performance */}
      {stats?.topicStats && stats.topicStats.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Performance by Topic
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topicStats.map((topic, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    {topic._id}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {topic.count} quiz{topic.count !== 1 ? 'es' : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Score:</span>
                  <span className={`font-bold ${getScoreColor(topic.averageScore, 100)}`}>
                    {Math.round(topic.averageScore)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/practice/setup" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-gray-900">Take New Quiz</div>
              <div className="text-sm text-gray-600">Improve your scores</div>
            </div>
          </Link>
          <Link to="/performance/chart" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-secondary-300 hover:bg-secondary-50 transition-colors text-center">
              <div className="text-2xl mb-2">📈</div>
              <div className="font-medium text-gray-900">View Analytics</div>
              <div className="text-sm text-gray-600">Detailed charts & trends</div>
            </div>
          </Link>
          <Link to="/friends" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-accent-300 hover:bg-accent-50 transition-colors text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-medium text-gray-900">Challenge Friends</div>
              <div className="text-sm text-gray-600">Compare performance</div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default PerformanceHistory;