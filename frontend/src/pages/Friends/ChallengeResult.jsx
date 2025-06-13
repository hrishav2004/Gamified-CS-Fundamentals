import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChallenge } from '../../contexts/ChallengeContext';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ChallengeResult = () => {
  const { id } = useParams();
  const { challengeResult } = useChallenge();
  const [showDetails, setShowDetails] = useState(false);

  // Mock challenge result data - in real app, this would come from API
  const mockResult = {
    challengeId: id,
    challenger: {
      username: 'You',
      score: 85,
      correctAnswers: 8,
      totalQuestions: 10,
      timeSpent: 420, // 7 minutes
      rank: 1
    },
    opponent: {
      username: 'Alex Chen',
      score: 75,
      correctAnswers: 7,
      totalQuestions: 10,
      timeSpent: 480, // 8 minutes
      rank: 2
    },
    quiz: {
      title: 'Operating Systems Challenge',
      topic: 'Operating Systems',
      difficulty: 'Medium'
    },
    winner: 'You',
    experienceGained: 50,
    completedAt: new Date().toISOString()
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const isWinner = mockResult.winner === 'You';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Result Header */}
      <Card className={`text-center ${isWinner ? 'bg-gradient-to-r from-green-50 to-yellow-50' : 'bg-gradient-to-r from-red-50 to-gray-50'}`}>
        <div className="text-6xl mb-4">
          {isWinner ? '🏆' : '🥈'}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isWinner ? 'Victory!' : 'Good Effort!'}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {isWinner 
            ? `Congratulations! You defeated ${mockResult.opponent.username}!`
            : `${mockResult.opponent.username} won this time. Better luck next time!`
          }
        </p>
        <div className="text-sm text-gray-500">
          Challenge completed • {new Date(mockResult.completedAt).toLocaleDateString()}
        </div>
      </Card>

      {/* Score Comparison */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Challenge Results
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Your Results */}
          <div className={`p-6 rounded-lg border-2 ${isWinner ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
            <div className="text-center">
              <div className="text-3xl mb-2">👤</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {mockResult.challenger.username}
                {isWinner && <span className="ml-2 text-green-600">👑</span>}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className={`text-3xl font-bold ${getScoreColor(mockResult.challenger.score)}`}>
                    {mockResult.challenger.score}%
                  </div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {mockResult.challenger.correctAnswers}/{mockResult.challenger.totalQuestions}
                    </div>
                    <div className="text-gray-600">Correct</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {formatTime(mockResult.challenger.timeSpent)}
                    </div>
                    <div className="text-gray-600">Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opponent Results */}
          <div className={`p-6 rounded-lg border-2 ${!isWinner ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
            <div className="text-center">
              <div className="text-3xl mb-2">👤</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {mockResult.opponent.username}
                {!isWinner && <span className="ml-2 text-green-600">👑</span>}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className={`text-3xl font-bold ${getScoreColor(mockResult.opponent.score)}`}>
                    {mockResult.opponent.score}%
                  </div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {mockResult.opponent.correctAnswers}/{mockResult.opponent.totalQuestions}
                    </div>
                    <div className="text-gray-600">Correct</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {formatTime(mockResult.opponent.timeSpent)}
                    </div>
                    <div className="text-gray-600">Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quiz Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Challenge Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-900">{mockResult.quiz.title}</div>
            <div className="text-sm text-gray-600">Quiz</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-900">{mockResult.quiz.topic}</div>
            <div className="text-sm text-gray-600">Topic</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-900">{mockResult.quiz.difficulty}</div>
            <div className="text-sm text-gray-600">Difficulty</div>
          </div>
        </div>
      </Card>

      {/* Experience Gained */}
      {isWinner && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Experience Gained!
            </h3>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              +{mockResult.experienceGained} XP
            </div>
            <p className="text-sm text-gray-600">
              Great job! You're getting closer to the next level.
            </p>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Link to="/friends">
          <Button variant="outline">
            Back to Friends
          </Button>
        </Link>
        <Link to="/friends/challenge/invite">
          <Button variant="secondary">
            Challenge Again
          </Button>
        </Link>
        <Link to="/practice/setup">
          <Button variant="primary">
            Practice More
          </Button>
        </Link>
      </div>

      {/* Detailed Breakdown */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Detailed Breakdown
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
        
        {showDetails && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Your Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Accuracy Rate:</span>
                    <span className="font-medium">
                      {Math.round((mockResult.challenger.correctAnswers / mockResult.challenger.totalQuestions) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Time per Question:</span>
                    <span className="font-medium">
                      {Math.round(mockResult.challenger.timeSpent / mockResult.challenger.totalQuestions)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed Bonus:</span>
                    <span className="font-medium text-green-600">+5 points</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Opponent Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Accuracy Rate:</span>
                    <span className="font-medium">
                      {Math.round((mockResult.opponent.correctAnswers / mockResult.opponent.totalQuestions) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Time per Question:</span>
                    <span className="font-medium">
                      {Math.round(mockResult.opponent.timeSpent / mockResult.opponent.totalQuestions)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed Bonus:</span>
                    <span className="font-medium text-gray-600">+0 points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Share Results */}
      <Card className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Share Your Results
        </h3>
        <p className="text-gray-600 mb-4">
          Let others know about your performance!
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="sm">
            Share on Social
          </Button>
          <Button variant="outline" size="sm">
            Copy Link
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChallengeResult;