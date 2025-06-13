import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useChallenge } from '../../contexts/ChallengeContext';
import { useQuiz } from '../../contexts/QuizContext';
import { friendService } from '../../services/friendService';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ChallengeInvite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sendChallengeInvite } = useChallenge();
  const { fetchQuizzes, quizzes } = useQuiz();

  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(searchParams.get('friend') || '');
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFriends();
    fetchQuizzes();
  }, []);

  const loadFriends = async () => {
    try {
      const response = await friendService.getFriends();
      setFriends(response.friends);
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  };

  const handleSendChallenge = async () => {
    if (!selectedFriend || !selectedQuiz) {
      alert('Please select a friend and quiz');
      return;
    }

    setLoading(true);
    try {
      await sendChallengeInvite(selectedFriend, selectedQuiz, message);
      alert('Challenge invitation sent successfully!');
      navigate('/friends');
    } catch (error) {
      console.error('Failed to send challenge:', error);
      alert('Failed to send challenge invitation');
    } finally {
      setLoading(false);
    }
  };

  const selectedFriendData = friends.find(f => f._id === selectedFriend);
  const selectedQuizData = quizzes.find(q => q._id === selectedQuiz);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Send Challenge Invitation ⚔️
        </h1>
        <p className="text-lg text-gray-600">
          Challenge a friend to a head-to-head quiz battle!
        </p>
      </div>

      {/* Friend Selection */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Select Friend to Challenge
        </h2>
        {friends.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">👥</div>
            <p className="mb-2">No friends available</p>
            <p className="text-sm">Add some friends first to send challenges!</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => navigate('/friends')}
            >
              Add Friends
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.map((friend) => (
              <div
                key={friend._id}
                onClick={() => setSelectedFriend(friend._id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedFriend === friend._id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {friend.username}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Level {friend.stats.level} • {friend.stats.totalScore} points
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quiz Selection */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Select Quiz
        </h2>
        <div className="space-y-3">
          {quizzes.slice(0, 6).map((quiz) => (
            <div
              key={quiz._id}
              onClick={() => setSelectedQuiz(quiz._id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedQuiz === quiz._id
                  ? 'border-secondary-500 bg-secondary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {quiz.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{quiz.topic}</span>
                    <span>•</span>
                    <span>{quiz.difficulty}</span>
                    <span>•</span>
                    <span>{quiz.questions.length} questions</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {quiz.timeLimit} min
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Challenge Message */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Challenge Message (Optional)
        </h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a personal message to your challenge..."
          className="input-field h-24 resize-none"
          maxLength={200}
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {message.length}/200
        </div>
      </Card>

      {/* Challenge Preview */}
      {selectedFriend && selectedQuiz && (
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Challenge Preview
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Challenger:</span>
              <span className="font-medium">You</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Opponent:</span>
              <span className="font-medium">{selectedFriendData?.username}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Quiz:</span>
              <span className="font-medium">{selectedQuizData?.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Topic:</span>
              <span className="font-medium">{selectedQuizData?.topic}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Difficulty:</span>
              <span className="font-medium">{selectedQuizData?.difficulty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Time Limit:</span>
              <span className="font-medium">{selectedQuizData?.timeLimit} minutes</span>
            </div>
            {message && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-600">Message:</span>
                <p className="text-gray-900 italic mt-1">"{message}"</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/friends')}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSendChallenge}
          loading={loading}
          disabled={!selectedFriend || !selectedQuiz || loading}
        >
          Send Challenge 🚀
        </Button>
      </div>

      {/* Challenge Rules */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Challenge Rules 📋
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Scoring</h4>
            <ul className="space-y-1">
              <li>• Correct answers earn full points</li>
              <li>• Time bonus for faster completion</li>
              <li>• Winner takes all bragging rights!</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Rules</h4>
            <ul className="space-y-1">
              <li>• Both players take the same quiz</li>
              <li>• No external help allowed</li>
              <li>• Results are compared automatically</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChallengeInvite;