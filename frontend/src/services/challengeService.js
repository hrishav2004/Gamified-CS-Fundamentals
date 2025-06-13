import axios from 'axios';

const API_URL = '/api/challenges';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const challengeService = {
  async sendInvite(friendId, quizId, message) {
    const response = await api.post('/invite', {
      friendId,
      quizId,
      message
    });
    return response.data;
  },

  async acceptChallenge(challengeId) {
    const response = await api.post(`/accept/${challengeId}`);
    return response.data;
  },

  async getActiveChallenges() {
    const response = await api.get('/active');
    return response.data;
  }
};