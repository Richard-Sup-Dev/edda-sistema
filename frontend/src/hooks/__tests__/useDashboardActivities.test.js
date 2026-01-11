// src/hooks/__tests__/useDashboardActivities.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardActivities } from '../useDashboardActivities';
import * as atividadesService from '@/services/atividadesService';

// Mock do serviço
vi.mock('@/services/atividadesService', () => ({
  default: {
    recentes: vi.fn(),
  },
}));

describe('useDashboardActivities', () => {
  const mockAtividades = [
    { id: 1, descricao: 'Atividade 1', created_at: '2024-01-01' },
    { id: 2, descricao: 'Atividade 2', created_at: '2024-01-02' },
    { id: 3, descricao: 'Atividade 3', created_at: '2024-01-03' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    atividadesService.default.recentes.mockResolvedValue(mockAtividades);
  });

  it('deve carregar atividades na montagem', async () => {
    const { result } = renderHook(() => useDashboardActivities());

    expect(result.current.loadingAtividades).toBe(true);

    await waitFor(() => {
      expect(result.current.loadingAtividades).toBe(false);
    });

    expect(result.current.atividadesRecentes).toEqual(mockAtividades);
    expect(atividadesService.default.recentes).toHaveBeenCalledTimes(1);
  });

  it('deve recarregar atividades manualmente', async () => {
    const { result } = renderHook(() => useDashboardActivities());

    await waitFor(() => {
      expect(result.current.loadingAtividades).toBe(false);
    });

    expect(atividadesService.default.recentes).toHaveBeenCalledTimes(1);

    await result.current.carregarAtividades();

    expect(atividadesService.default.recentes).toHaveBeenCalledTimes(2);
  });

  it('deve tratar erro silenciosamente', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    atividadesService.default.recentes.mockRejectedValue(new Error('Erro ao carregar'));

    const { result } = renderHook(() => useDashboardActivities());

    await waitFor(() => {
      expect(result.current.loadingAtividades).toBe(false);
    });

    expect(result.current.atividadesRecentes).toEqual([]);
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it('deve retornar array vazio quando não há dados', async () => {
    atividadesService.default.recentes.mockResolvedValue([]);

    const { result } = renderHook(() => useDashboardActivities());

    await waitFor(() => {
      expect(result.current.atividadesRecentes).toEqual([]);
    });
  });
});
