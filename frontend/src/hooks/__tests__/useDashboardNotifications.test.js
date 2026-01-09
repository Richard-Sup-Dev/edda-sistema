// src/hooks/__tests__/useDashboardNotifications.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardNotifications } from '../useDashboardNotifications';
import notificacoesService from '@/services/notificacoesService';
import toast from 'react-hot-toast';

// Mock dos serviços
vi.mock('@/services/notificacoesService');
vi.mock('react-hot-toast');

describe('useDashboardNotifications', () => {
  const mockNotificacoes = [
    { id: 1, titulo: 'Notificação 1', lida: false },
    { id: 2, titulo: 'Notificação 2', lida: false },
    { id: 3, titulo: 'Notificação 3', lida: true },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    notificacoesService.listar.mockResolvedValue({ data: mockNotificacoes });
  });

  it('deve carregar notificações na montagem', async () => {
    const { result } = renderHook(() => useDashboardNotifications());

    expect(result.current.loadingNotificacoes).toBe(true);

    await waitFor(() => {
      expect(result.current.loadingNotificacoes).toBe(false);
    });

    expect(result.current.notificacoes).toEqual(mockNotificacoes);
    expect(result.current.unreadCount).toBe(2);
    expect(notificacoesService.listar).toHaveBeenCalledWith({ limit: 10 });
  });

  it('deve calcular unreadCount corretamente', async () => {
    const { result } = renderHook(() => useDashboardNotifications());

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(2);
    });
  });

  it('deve marcar notificação como lida', async () => {
    notificacoesService.marcarComoLida.mockResolvedValue({});

    const { result } = renderHook(() => useDashboardNotifications());

    await waitFor(() => {
      expect(result.current.notificacoes).toHaveLength(3);
    });

    await result.current.marcarComoLida(1);

    await waitFor(() => {
      const notif = result.current.notificacoes.find(n => n.id === 1);
      expect(notif.lida).toBe(true);
      expect(result.current.unreadCount).toBe(1);
    });

    expect(notificacoesService.marcarComoLida).toHaveBeenCalledWith(1);
    expect(toast.success).toHaveBeenCalledWith('Notificação marcada como lida');
  });

  it('deve marcar todas como lidas', async () => {
    notificacoesService.marcarTodasComoLidas.mockResolvedValue({});

    const { result } = renderHook(() => useDashboardNotifications());

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(2);
    });

    await result.current.marcarTodasComoLidas();

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(0);
      result.current.notificacoes.forEach(n => {
        expect(n.lida).toBe(true);
      });
    });

    expect(notificacoesService.marcarTodasComoLidas).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Todas as notificações foram marcadas como lidas');
  });

  it('deve deletar notificação', async () => {
    notificacoesService.deletar.mockResolvedValue({});

    const { result } = renderHook(() => useDashboardNotifications());

    await waitFor(() => {
      expect(result.current.notificacoes).toHaveLength(3);
    });

    await result.current.deletarNotificacao(1);

    await waitFor(() => {
      expect(result.current.notificacoes).toHaveLength(2);
      expect(result.current.notificacoes.find(n => n.id === 1)).toBeUndefined();
      expect(result.current.unreadCount).toBe(1);
    });

    expect(notificacoesService.deletar).toHaveBeenCalledWith(1);
    expect(toast.success).toHaveBeenCalledWith('Notificação removida');
  });

  it('deve tratar erro ao carregar notificações', async () => {
    notificacoesService.listar.mockRejectedValue(new Error('Erro ao carregar'));

    const { result } = renderHook(() => useDashboardNotifications());

    await waitFor(() => {
      expect(result.current.loadingNotificacoes).toBe(false);
    });

    expect(result.current.notificacoes).toEqual([]);
    expect(toast.error).toHaveBeenCalledWith('Erro ao carregar notificações');
  });

  it('deve tratar erro ao marcar como lida', async () => {
    notificacoesService.marcarComoLida.mockRejectedValue(new Error('Erro'));

    const { result } = renderHook(() => useDashboardNotifications());

    await waitFor(() => {
      expect(result.current.notificacoes).toHaveLength(3);
    });

    await result.current.marcarComoLida(1);

    expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar notificação');
  });

  it('deve recarregar notificações manualmente', async () => {
    const { result } = renderHook(() => useDashboardNotifications());

    await waitFor(() => {
      expect(result.current.loadingNotificacoes).toBe(false);
    });

    expect(notificacoesService.listar).toHaveBeenCalledTimes(1);

    await result.current.carregarNotificacoes();

    expect(notificacoesService.listar).toHaveBeenCalledTimes(2);
  });
});
