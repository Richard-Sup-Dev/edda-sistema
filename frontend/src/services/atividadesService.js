import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Serviço de Atividades/Auditoria
 */
const atividadesService = {
  /**
   * Listar atividades
   */
  async listar(params = {}) {
    const { data } = await apiClient.get(API_ENDPOINTS.ATIVIDADES, { params });
    return data;
  },

  /**
   * Buscar atividades recentes (para dashboard)
   */
  async recentes() {
    const { data } = await apiClient.get(API_ENDPOINTS.ATIVIDADES_RECENTES);
    return data.atividades || [];
  },

  /**
   * Estatísticas de atividades
   */
  async estatisticas(periodo = 7) {
    const { data } = await apiClient.get(API_ENDPOINTS.ATIVIDADES_ESTATISTICAS, {
      params: { periodo }
    });
    return data;
  }
};

export default atividadesService;
