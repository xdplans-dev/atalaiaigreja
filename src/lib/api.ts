import axios from 'axios';

const API_URL = ''; // Use local server as proxy to avoid CORS/Network Error

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('atalaias_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('atalaias_token');
      // We can't use navigate here since it's not a component
      // But we can redirect via window
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
