import axios from 'axios';

const API_URL = '/api/admin';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['X-Admin-Key'] = 'admin-secret-key-2024'; // In production, this should come from env
  }
  return config;
});

export const adminService = {
  async getQuestions(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/questions?${params}`);
    return response.data;
  },

  async createQuestion(questionData) {
    const response = await api.post('/questions', questionData);
    return response.data;
  },

  async approveQuestion(questionId) {
    const response = await api.put(`/questions/${questionId}/approve`);
    return response.data;
  }
};