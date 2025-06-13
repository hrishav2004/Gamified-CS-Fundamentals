import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { friendService } from '../../services/friendService';
import Card from '../../components/Card';
import Button from '../../components/Button';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');

  useEffect(() => {
    loadFriends();
    loadFriendRequests();
  }, []);

  const loadFriends = async () => {
    try {
      const response = await friendService.getFriends();
      setFriends(response.friends);
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  };

  const loadFriendRequests = async () => {
    try {
      const response = await friendService.getFriendRequests();
      setFriendRequests(response.requests);
    } catch (error) {
      console.error('Failed to load friend requests:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await friendService.searchUsers(searchQuery);
      setSearchResults(response.users);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await friendService.sendFriendRequest(userId, 'Let\'s be friends!');
      alert('Friend request sent!');
      setSearchResults(prev => prev.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Failed to send friend request:', error);
      alert('Failed to send friend request');
    }
  };

  const respondToRequest = async (requestId, action) => {
    try {
      await friendService.respondToFriendRequest(requestId, action);
      setFriendRequests(prev => prev.filter(req => req._id !== requestId));
      if (action === 'accept') {
        loadFriends(); // Reload friends list
      }
    } catch (error) {
      console.error('Failed to respond to friend request:', error);
    }
  };

  const tabs = [
    { id: 'friends', label: 'Friends', count: friends.length },
    { id: 'requests', label: 'Requests', count: friendRequests.length },
    { id: 'search', label: 'Find Friends', count: null }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Friends & Challenges 👥
        </h1>
        <p className="text-lg text-gray-600">
          Connect with friends and challenge each other to improve together.
        </p>
      </div>

      {/* Tabs */}
      <Card>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          {friends.length === 0 ? (
            <Card className="text-center py-8">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No friends yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by finding and adding friends to challenge each other!
              </p>
              <Button onClick={() => setActiveTab('search')}>
                Find Friends
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <Card key={friend._id} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {friend.username}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Level {friend.stats.level} • {friend.stats.totalScore} points
                  </p>
                  <div className="space-y-2">
                    <Link to={`/friends/challenge/invite?friend=${friend._id}`}>
                      <Button variant="primary" size="sm" className="w-full">
                        Challenge
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Friend Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {friendRequests.length === 0 ? (
            <Card className="text-center py-8">
              <div className="text-4xl mb-4">📬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pending requests
              </h3>
              <p className="text-gray-600">
                You'll see friend requests here when someone wants to connect with you.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {friendRequests.map((request) => (
                <Card key={request._id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">👤</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.sender.username}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {request.message || 'Wants to be friends'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => respondToRequest(request._id, 'accept')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => respondToRequest(request._id, 'reject')}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <Card>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search by username or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field flex-1"
              />
              <Button onClick={handleSearch} loading={loading}>
                Search
              </Button>
            </div>
          </Card>

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Search Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((user) => (
                  <Card key={user._id} className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {user.username}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {user.profile?.firstName} {user.profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Level {user.stats.level} • {user.stats.totalScore} points
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => sendFriendRequest(user._id)}
                    >
                      Add Friend
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/friends/challenge/invite" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
              <div className="text-2xl mb-2">⚔️</div>
              <div className="font-medium text-gray-900">Send Challenge</div>
              <div className="text-sm text-gray-600">Challenge a friend to a quiz</div>
            </div>
          </Link>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-secondary-300 hover:bg-secondary-50 transition-colors text-center cursor-pointer">
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-medium text-gray-900">View Leaderboard</div>
            <div className="text-sm text-gray-600">See how you rank</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-accent-300 hover:bg-accent-50 transition-colors text-center cursor-pointer">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-gray-900">Compare Stats</div>
            <div className="text-sm text-gray-600">Compare with friends</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FriendList;