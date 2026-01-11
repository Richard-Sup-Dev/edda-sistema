// backend/src/__tests__/services/websocketService.test.js
import { describe, it, expect } from 'vitest';
import websocketService from '../../services/websocketService.js';

describe('WebSocket Service', () => {
  it('deve ter método de broadcast', () => {
    expect(typeof websocketService.broadcast).toBe('function');
  });

  it('deve ter método de inicialização', () => {
    expect(typeof websocketService.initialize).toBe('function');
  });

  it('broadcast deve não lançar erro sem conexões', () => {
    expect(() => {
      websocketService.broadcast('test-event', { data: 'test' });
    }).not.toThrow();
  });

  // Nota: Testes completos de WebSocket requerem servidor HTTP rodando
  // Para testes E2E: criar servidor HTTP de teste e conectar clientes reais
});
