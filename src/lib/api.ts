import axios from 'axios';

// Se não houver variável de ambiente, use o backend local em http://localhost:3001.
// Isso permite desenvolver localmente sem precisar configurar proxy manual.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"; 

console.log("API_URL Detectada:", API_URL);

const api = axios.create({
  baseURL: API_URL, // Use a URL completa do backend local
  timeout: 100000, // 100s timeout on client side
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("Axios baseURL definitivo:", api.defaults.baseURL || window.location.origin);

// Add interceptor to add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('atalaias_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add interceptor to handle session expiration and provide better error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('atalaias_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session=expired';
      }
    }
    
    // Improved network error logging
    if (error.message === 'Network Error') {
      console.error('ERRO DE REDE: O servidor está offline ou bloqueando a requisição (CORS).');
      console.log('Verifique se o proxy local está funcionando ou se a URL da API está correta.');
    } else if (error.code === 'ECONNABORTED') {
      console.error('TIMEOUT: O servidor demorou muito para responder. Pode ser um cold start do Render.');
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

export const getAdminEvents = async () => {
  console.log("Buscando eventos admin em:", `${API_URL}/api/events/admin`);
  return api.get('/api/events/admin');
};

export const getPublicEvents = async () => {
  console.log("Buscando eventos públicos em:", `${API_URL}/api/events`);
  return api.get('/api/events');
};

export const createEvent = async (data: any) => {
  console.log("Criando evento em:", `${API_URL}/api/events/admin`);
  return api.post('/api/events/admin', data);
};

export const updateEvent = async (id: string, data: any) => {
  console.log("Atualizando evento em:", `${API_URL}/api/events/admin/${id}`);
  return api.put(`/api/events/admin/${id}`, data);
};

export const deleteEvent = async (id: string) => {
  console.log("Excluindo evento em:", `${API_URL}/api/events/admin/${id}`);
  return api.delete(`/api/events/admin/${id}`);
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
