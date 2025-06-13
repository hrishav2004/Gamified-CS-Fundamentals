import React, { useState, useEffect } from 'react';
import { friendService } from '../../services/friendService';
import Card from '../../components/Card';
import Button from '../../components/Button';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await friendService.searchUsers(''); // Get all users
      setUsers(response.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadUsers();
      return;
    }
    
    setLoading(true);
    try {
      const response = await friendService.searchUsers(searchQuery);
      setUsers(response.users);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.stats.totalQuizzes > 0).length,
      newUsers: users.filter(u => {
        const createdDate = new Date(u.createdAt || Date.now());
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate > weekAgo;
      }).length,
      topPerformers: users.filter(u => u.stats.averageScore > 80).length
    };
  };

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          User Management 👥
        </h1>
        <p className="text-lg text-gray-600">
          Monitor and manage platform users and their activities.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl mb-2">🆕</div>
          <div className="text-2xl font-bold text-blue-600">{stats.newUsers}</div>
          <div className="text-sm text-gray-600">New This Week</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.topPerformers}</div>
          <div className="text-sm text-gray-600">Top Performers</div>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search users by username or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="input-field flex-1"
          />
          <Button onClick={handleSearch} loading={loading}>
            Search
          </Button>
          <Button variant="outline" onClick={loadUsers}>
            Show All
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Users ({users.length})
          </h2>
          <Button variant="outline" size="sm" onClick={loadUsers}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-800">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.profile?.firstName} {user.profile?.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Level {user.stats.level}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.stats.totalScore} points
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.stats.totalQuizzes} quizzes
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round(user.stats.averageScore || 0)}% avg
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Suspend
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                User Details
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <div className="text-sm text-gray-900">{selectedUser.username}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="text-sm text-gray-900">{selectedUser.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="text-sm text-gray-900">
                    {selectedUser.profile?.firstName} {selectedUser.profile?.lastName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <div className="text-sm text-gray-900">Level {selectedUser.stats.level}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Performance Stats</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="font-semibold">{selectedUser.stats.totalQuizzes}</div>
                    <div className="text-xs text-gray-600">Quizzes</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="font-semibold">{selectedUser.stats.totalScore}</div>
                    <div className="text-xs text-gray-600">Points</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="font-semibold">{Math.round(selectedUser.stats.averageScore || 0)}%</div>
                    <div className="text-xs text-gray-600">Average</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
              <Button variant="primary">
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center cursor-pointer">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-gray-900">Export Data</div>
            <div className="text-sm text-gray-600">Download user analytics</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-secondary-300 hover:bg-secondary-50 transition-colors text-center cursor-pointer">
            <div className="text-2xl mb-2">📧</div>
            <div className="font-medium text-gray-900">Send Announcement</div>
            <div className="text-sm text-gray-600">Notify all users</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-accent-300 hover:bg-accent-50 transition-colors text-center cursor-pointer">
            <div className="text-2xl mb-2">🔧</div>
            <div className="font-medium text-gray-900">System Settings</div>
            <div className="text-sm text-gray-600">Configure platform</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;