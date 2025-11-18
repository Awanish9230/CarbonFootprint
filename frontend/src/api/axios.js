// frontend/src/axios.js
import axios from 'axios';

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  baseURL: import.meta.env.VITE_API_URL || 'https://ecotracker-backenddata.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
