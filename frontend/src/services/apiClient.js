// Utilitário para obter CSRF token
let csrfToken = null;
export async function getCsrfToken() {
  if (!csrfToken) {
    const res = await apiClient.get('/csrf-token');
    csrfToken = res.data.csrfToken;
  }
  return csrfToken;
}

// Adiciona CSRF token em requisições mutáveis
apiClient.interceptors.request.use(async (config) => {
  const mutatingMethods = ['post', 'put', 'patch', 'delete'];
  if (mutatingMethods.includes(config.method)) {
    if (!csrfToken) {
      await getCsrfToken();
    }
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});
// src/services/apiClient.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Criar instância do axios

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Permite envio de cookies
});

// Não é mais necessário adicionar token manualmente, pois será enviado via cookie HttpOnly

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
