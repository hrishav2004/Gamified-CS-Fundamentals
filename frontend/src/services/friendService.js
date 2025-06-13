import axios from 'axios';

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const friendService = {
  async sendFriendRequest(receiverId, message) {
    const response = await api.post('/api/friends/request', {
      receiverId,
      message
    });
    return response.data;
  },

  async getFriendRequests() {
    const response = await api.get('/api/friends/requests');
    return response.data;
  },

  async respondToFriendRequest(requestId, action) {
    const response = await api.post('/api/friends/respond', {
      requestId,
      action
    });
    return response.data;
  },

  async getFriends() {
    const response = await api.get('/api/friends');
    return response.data;
  },

  async searchUsers(query) {
    const response = await api.get(`/api/users?search=${query}`);
    return response.data;
  }
};