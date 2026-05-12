import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "https://igrejaatalaiaapi.onrender.com";

console.log("API_URL Configurada:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("Axios baseURL:", api.defaults.baseURL);

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
  console.log("Enviando pedido de oração para:", `${API_URL}/api/prayers`);
  return api.post('/api/prayers', data);
};

export const getPrayerWall = async () => {
  console.log("Buscando mural de oração em:", `${API_URL}/api/prayers/mural`);
  return api.get('/api/prayers/mural');
};

export const getAdminPrayers = async () => {
  console.log("Buscando pedidos admin em:", `${API_URL}/api/prayers/admin`);
  return api.get('/api/prayers/admin');
};

export const respondPrayerRequest = async (id: string, pastorResponse: string) => {
  console.log("Respondendo pedido em:", `${API_URL}/api/prayers/admin/${id}/respond`);
  return api.patch(`/api/prayers/admin/${id}/respond`, { pastorResponse });
};

export const login = async (credentials: any) => {
  console.log("Realizando login em:", `${API_URL}/api/auth/login`);
  return api.post('/api/auth/login', credentials);
};

export const register = async (userData: any) => {
  console.log("Realizando cadastro em:", `${API_URL}/api/auth/register`);
  return api.post('/api/auth/register', userData);
};

export default api;
