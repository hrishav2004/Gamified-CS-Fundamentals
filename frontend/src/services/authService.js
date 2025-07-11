import axios from 'axios';

const API_URL = '/api/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async register(userData) {
    const response = await api.post('/register', userData);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  }
};