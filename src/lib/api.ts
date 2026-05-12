import axios from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://igrejaatalaiaapi.onrender.com';

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

export const createPrayerRequest = async (data: any) => {
  return api.post('/api/prayers', data);
};

export const getPrayerWall = async () => {
  return api.get('/api/prayers/mural');
};

export const getAdminPrayers = async () => {
  return api.get('/api/prayers/admin');
};

export const respondPrayerRequest = async (id: string, pastorResponse: string) => {
  return api.patch(`/api/prayers/admin/${id}/respond`, { pastorResponse });
};

export default api;
