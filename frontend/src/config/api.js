/**
 * Configuração centralizada de API
 * Usa variáveis de ambiente do Vite para ambiente dev/prod
 */

// Use only the Vite environment variable provided at build/runtime.
// Do not hardcode external production domains here.
const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
  AUTH_ME: `${API_BASE_URL}/api/auth/me`,

  // Clientes
  CLIENTES: `${API_BASE_URL}/api/clientes`,
  CLIENTES_SEARCH: `${API_BASE_URL}/api/clientes/search`,

  // Peças
  PECAS: `${API_BASE_URL}/api/pecas`,

  // Serviços
  SERVICOS: `${API_BASE_URL}/api/servicos`,

  // Relatórios
  RELATORIOS: `${API_BASE_URL}/api/relatorios`,
  RELATORIOS_SEARCH: `${API_BASE_URL}/api/relatorios/search`,

  // Notas Fiscais (NF)
  NF: `${API_BASE_URL}/api/nf`,
  NF_ITENS: `${API_BASE_URL}/api/nf/itens`,
};

/**
 * URL base para uploads
 */
export const UPLOAD_BASE_URL = API_BASE_URL;

/**
 * Função auxiliar para construir URLs dinâmicas
 */
export const getApiUrl = (endpoint, id = null) => {
  if (id) {
    return `${endpoint}/${id}`;
  }
  return endpoint;
};

/**
 * Configuração de debug
 */
export const DEBUG_MODE = import.meta.env.VITE_DEBUG === 'true';

/**
 * Logger seguro para desenvolvimento
 */
export const logger = {
  log: (msg, data = null) => {
    if (DEBUG_MODE) {
      console.log(`[API] ${msg}`, data || '');
    }
  },
  error: (msg, error = null) => {
    if (DEBUG_MODE) {
      console.error(`[API ERROR] ${msg}`, error || '');
    }
  },
  warn: (msg, data = null) => {
    if (DEBUG_MODE) {
      console.warn(`[API WARN] ${msg}`, data || '');
    }
  },
};

export default API_BASE_URL;
