import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Serviço de Notificações
 */
const notificacoesService = {
  /**
   * Listar notificações do usuário
   */
  async listar(params = {}) {
    const { data } = await apiClient.get(API_ENDPOINTS.NOTIFICACOES, { params });
    return data;
  },

  /**
   * Contar notificações não lidas
   */
  async contarNaoLidas() {
    const { data } = await apiClient.get(API_ENDPOINTS.NOTIFICACOES_NAO_LIDAS);
    return data.count;
  },

  /**
   * Marcar notificação específica como lida
   */
  async marcarComoLida(id) {
    const { data } = await apiClient.put(`${API_ENDPOINTS.NOTIFICACOES}/${id}/lida`);
    return data;
  },

  /**
   * Marcar todas as notificações como lidas
   */
  async marcarTodasComoLidas() {
    const { data } = await apiClient.put(API_ENDPOINTS.NOTIFICACOES_MARCAR_LIDAS);
    return data;
  },

  /**
   * Deletar notificação específica
   */
  async deletar(id) {
    const { data } = await apiClient.delete(`${API_ENDPOINTS.NOTIFICACOES}/${id}`);
    return data;
  },

  /**
   * Deletar todas as notificações lidas
   */
  async deletarLidas() {
    const { data } = await apiClient.delete(API_ENDPOINTS.NOTIFICACOES_DELETAR_LIDAS);
    return data;
  }
};

export default notificacoesService;
