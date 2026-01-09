// src/hooks/useDashboardNotifications.js
import { useState, useEffect, useCallback } from 'react';
import notificacoesService from '@/services/notificacoesService';
import toast from 'react-hot-toast';

/**
 * Hook personalizado para gerenciar notificações do dashboard
 * 
 * Fornece funcionalidades para carregar, marcar como lida, deletar notificações
 * e manter um contador de notificações não lidas. Integra-se com o backend
 * através do notificacoesService e exibe feedback via toast.
 * 
 * @hook
 * @returns {Object} Estado e funções de controle de notificações
 * @returns {Array<Object>} returns.notificacoes - Lista de notificações
 * @returns {boolean} returns.loadingNotificacoes - Estado de carregamento
 * @returns {number} returns.unreadCount - Quantidade de notificações não lidas
 * @returns {Function} returns.carregarNotificacoes - Carrega notificações do servidor
 * @returns {Function} returns.marcarComoLida - Marca notificação específica como lida
 * @returns {Function} returns.marcarTodasComoLidas - Marca todas as notificações como lidas
 * @returns {Function} returns.deletarNotificacao - Remove uma notificação
 * 
 * @example
 * ```jsx
 * function NotificationPanel() {
 *   const {
 *     notificacoes,
 *     loadingNotificacoes,
 *     unreadCount,
 *     marcarComoLida,
 *     deletarNotificacao
 *   } = useDashboardNotifications();
 *   
 *   useEffect(() => {
 *     // Carrega automaticamente na montagem
 *   }, []);
 *   
 *   return (
 *     <div>
 *       <span>Não lidas: {unreadCount}</span>
 *       {notificacoes.map(n => (
 *         <div key={n.id} onClick={() => marcarComoLida(n.id)}>
 *           {n.mensagem}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDashboardNotifications() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loadingNotificacoes, setLoadingNotificacoes] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Carrega notificações do servidor
  const carregarNotificacoes = useCallback(async () => {
    try {
      setLoadingNotificacoes(true);
      const response = await notificacoesService.listar({ limit: 10 });
      setNotificacoes(response.data || []);
      
      // Calcula não lidas
      const naoLidas = (response.data || []).filter(n => !n.lida).length;
      setUnreadCount(naoLidas);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      toast.error('Erro ao carregar notificações');
    } finally {
      setLoadingNotificacoes(false);
    }
  }, []);

  // Marca notificação como lida
  const marcarComoLida = useCallback(async (id) => {
    try {
      await notificacoesService.marcarComoLida(id);
      
      // Atualiza estado local
      setNotificacoes(prev =>
        prev.map(n => n.id === id ? { ...n, lida: true } : n)
      );
      
      // Atualiza contador
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      toast.success('Notificação marcada como lida');
    } catch (error) {
      console.error('Erro ao marcar notificação:', error);
      toast.error('Erro ao atualizar notificação');
    }
  }, []);

  // Marca todas como lidas
  const marcarTodasComoLidas = useCallback(async () => {
    try {
      await notificacoesService.marcarTodasComoLidas();
      
      // Atualiza estado local
      setNotificacoes(prev =>
        prev.map(n => ({ ...n, lida: true }))
      );
      
      setUnreadCount(0);
      toast.success('Todas as notificações foram marcadas como lidas');
    } catch (error) {
      console.error('Erro ao marcar todas:', error);
      toast.error('Erro ao atualizar notificações');
    }
  }, []);

  // Deleta notificação
  const deletarNotificacao = useCallback(async (id) => {
    try {
      await notificacoesService.deletar(id);
      
      // Remove do estado local
      setNotificacoes(prev => {
        const notif = prev.find(n => n.id === id);
        if (notif && !notif.lida) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        return prev.filter(n => n.id !== id);
      });
      
      toast.success('Notificação removida');
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      toast.error('Erro ao remover notificação');
    }
  }, []);

  // Carrega notificações na montagem
  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  // Atualiza notificações a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(interval);
  }, [carregarNotificacoes]);

  return {
    notificacoes,
    loadingNotificacoes,
    unreadCount,
    carregarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
    deletarNotificacao,
  };
}
