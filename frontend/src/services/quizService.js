import axios from 'axios';

const API_URL = '/api/quizzes';

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

export const quizService = {
  async getQuizzes(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/?${params}`);
    return response.data;
  },

  async getQuizById(id) {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  async createQuiz(quizData) {
    const response = await api.post('/', quizData);
    return response.data;
  },

  async submitQuiz(quizId, answers, timeSpent) {
    const response = await api.post('/submit', {
      quizId,
      answers,
      timeSpent
    });
    return response.data;
  }
};