// src/hooks/useDashboardActivities.js
import { useState, useEffect, useCallback } from 'react';
import atividadesService from '@/services/atividadesService';

/**
 * Hook personalizado para gerenciar atividades recentes do dashboard
 * 
 * Carrega e mantém atualizada a lista de atividades recentes do usuário.
 * Atualiza automaticamente a cada 60 segundos para manter o feed sempre atual.
 * Ideal para exibir logs de ações, histórico de atividades, etc.
 * 
 * @hook
 * @returns {Object} Estado e funções de controle de atividades
 * @returns {Array<Object>} returns.atividadesRecentes - Lista das últimas 5 atividades
 * @returns {boolean} returns.loadingAtividades - Estado de carregamento
 * @returns {Function} returns.carregarAtividades - Recarrega atividades manualmente
 * 
 * @example
 * ```jsx
 * function ActivityFeed() {
 *   const { atividadesRecentes, loadingAtividades, carregarAtividades } = useDashboardActivities();
 *   
 *   return (
 *     <div>
 *       <button onClick={carregarAtividades}>Atualizar</button>
 *       {loadingAtividades ? (
 *         <p>Carregando...</p>
 *       ) : (
 *         atividadesRecentes.map(atividade => (
 *           <div key={atividade.id}>
 *             {atividade.descricao} - {new Date(atividade.data).toLocaleString()}
 *           </div>
 *         ))
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDashboardActivities() {
  const [atividadesRecentes, setAtividadesRecentes] = useState([]);
  const [loadingAtividades, setLoadingAtividades] = useState(false);

  const carregarAtividades = useCallback(async () => {
    try {
      setLoadingAtividades(true);
      const atividades = await atividadesService.recentes();
      setAtividadesRecentes(atividades);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      // Não mostra toast para não poluir UI
    } finally {
      setLoadingAtividades(false);
    }
  }, []);

  // Carrega atividades na montagem
  useEffect(() => {
    carregarAtividades();
  }, [carregarAtividades]);

  // Atualiza atividades a cada minuto
  useEffect(() => {
    const interval = setInterval(carregarAtividades, 60000);
    return () => clearInterval(interval);
  }, [carregarAtividades]);

  return {
    atividadesRecentes,
    loadingAtividades,
    carregarAtividades,
  };
}
