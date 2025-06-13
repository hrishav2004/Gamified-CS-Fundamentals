import React, { useEffect, useState } from 'react';
import { usePerformance } from '../../contexts/PerformanceContext';
import Card from '../../components/Card';
import Chart from '../../components/Chart';

const PerformanceChart = () => {
  const { performances, stats, fetchPerformances, fetchStats, loading } = usePerformance();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('score');

  useEffect(() => {
    fetchPerformances();
    fetchStats();
  }, []);

  const timeRanges = {
    '7days': 'Last 7 Days',
    '30days': 'Last 30 Days',
    '90days': 'Last 90 Days',
    'all': 'All Time'
  };

  const metrics = {
    'score': 'Score Percentage',
    'time': 'Time Spent',
    'accuracy': 'Accuracy Rate'
  };

  const filterPerformancesByTimeRange = (performances, range) => {
    if (range === 'all') return performances;
    
    const days = parseInt(range.replace('days', ''));
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return performances.filter(p => new Date(p.completedAt) >= cutoffDate);
  };

  const getScoreOverTimeData = () => {
    const filteredPerformances = filterPerformancesByTimeRange(performances, selectedTimeRange);
    
    return {
      labels: filteredPerformances.map(p => 
        new Date(p.completedAt).toLocaleDateString()
      ).reverse(),
      datasets: [
        {
          label: 'Score Percentage',
          data: filteredPerformances.map(p => 
            Math.round((p.score / (p.totalQuestions * 10)) * 100)
          ).reverse(),
          borderColor: 'rgb(30, 58, 138)',
          backgroundColor: 'rgba(30, 58, 138, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const getTopicPerformanceData = () => {
    if (!stats?.topicStats) return { labels: [], datasets: [] };
    
    return {
      labels: stats.topicStats.map(topic => topic._id),
      datasets: [
        {
          label: 'Average Score',
          data: stats.topicStats.map(topic => Math.round(topic.averageScore)),
          backgroundColor: [
            'rgba(30, 58, 138, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)'
          ]
        }
      ]
    };
  };

  const getAccuracyOverTimeData = () => {
    const filteredPerformances = filterPerformancesByTimeRange(performances, selectedTimeRange);
    
    return {
      labels: filteredPerformances.map(p => 
        new Date(p.completedAt).toLocaleDateString()
      ).reverse(),
      datasets: [
        {
          label: 'Accuracy Rate',
          data: filteredPerformances.map(p => 
            Math.round((p.correctAnswers / p.totalQuestions) * 100)
          ).reverse(),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const getDifficultyDistributionData = () => {
    const difficultyCount = performances.reduce((acc, p) => {
      const difficulty = p.quiz?.difficulty || 'Unknown';
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(difficultyCount),
      datasets: [
        {
          data: Object.values(difficultyCount),
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(107, 114, 128, 0.8)'
          ]
        }
      ]
    };
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
          Performance Analytics 📈
        </h1>
        <p className="text-lg text-gray-600">
          Detailed insights into your learning progress and performance trends.
        </p>
      </div>

      {/* Controls */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="input-field w-auto"
            >
              {Object.entries(timeRanges).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Metric
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="input-field w-auto"
            >
              {Object.entries(metrics).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Main Performance Chart */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {selectedMetric === 'score' ? 'Score Trends' : 
           selectedMetric === 'accuracy' ? 'Accuracy Trends' : 'Time Trends'}
        </h2>
        {performances.length > 0 ? (
          <Chart
            type="line"
            data={selectedMetric === 'accuracy' ? getAccuracyOverTimeData() : getScoreOverTimeData()}
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
            <p>No performance data available</p>
            <p className="text-sm">Take some quizzes to see your trends!</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Topic Performance */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Performance by Topic
          </h2>
          {stats?.topicStats && stats.topicStats.length > 0 ? (
            <Chart
              type="bar"
              data={getTopicPerformanceData()}
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
              <p>No topic data available</p>
            </div>
          )}
        </Card>

        {/* Difficulty Distribution */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quiz Difficulty Distribution
          </h2>
          {performances.length > 0 ? (
            <Chart
              type="doughnut"
              data={getDifficultyDistributionData()}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No difficulty data available</p>
            </div>
          )}
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Performance Insights 💡
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-600 text-lg font-semibold mb-2">
              Strongest Topic
            </div>
            <div className="text-gray-900">
              {stats?.topicStats?.length > 0 
                ? stats.topicStats.reduce((best, current) => 
                    current.averageScore > best.averageScore ? current : best
                  )._id
                : 'No data yet'
              }
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-green-600 text-lg font-semibold mb-2">
              Improvement Rate
            </div>
            <div className="text-gray-900">
              {performances.length >= 2 
                ? `${Math.round(
                    ((performances[0].score / (performances[0].totalQuestions * 10)) - 
                     (performances[performances.length - 1].score / (performances[performances.length - 1].totalQuestions * 10))) * 100
                  )}%`
                : 'Take more quizzes'
              }
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-yellow-600 text-lg font-semibold mb-2">
              Study Recommendation
            </div>
            <div className="text-gray-900">
              {stats?.topicStats?.length > 0 
                ? stats.topicStats.reduce((worst, current) => 
                    current.averageScore < worst.averageScore ? current : worst
                  )._id
                : 'Keep practicing!'
              }
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PerformanceChart;