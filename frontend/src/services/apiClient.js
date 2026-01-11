// src/services/apiClient.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Criar instância do axios
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Utilitário para obter CSRF token
let csrfToken = null;
export async function getCsrfToken() {
  if (!csrfToken) {
    const res = await apiClient.get('/csrf-token');
    csrfToken = res.data.csrfToken;
  }
  return csrfToken;
}


// Adiciona o token JWT salvo no localStorage no header Authorization
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de resposta
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se o access token expirou, tenta renovar automaticamente
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        await apiClient.post('/auth/refresh-token');
        // Tenta novamente a requisição original
        return apiClient(error.config);
      } catch (refreshError) {
        // Se falhar, redireciona para login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
