import axios from 'axios';

// Ao usar um caminho vazio ou relativo, o navegador enviará para o servidor local (proxy em server.ts).
// Isso evita erros de CORS (Network Error) e contorna o erro 405 que ocorre em servidores estáticos.
const API_URL = import.meta.env.VITE_API_URL || ""; 

console.log("API_URL Detectada:", API_URL || "(origem local / proxy)");

const api = axios.create({
  baseURL: API_URL || "/", // Use '/' para caminhos relativos ao domínio atual
  timeout: 100000, // 100s timeout on client side, slightly more than server proxy
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
