import axios from 'axios';

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const performanceService = {
  async getUserPerformance() {
    const response = await api.get('/api/performance');
    return response.data;
  },

  async getPerformanceStats() {
    const response = await api.get('/api/performance/stats');
    return response.data;
  },

  async getLeaderboard() {
    const response = await api.get('/api/leaderboard');
    return response.data;
  }
};