// src/services/__tests__/relatoriosService.test.js
import { describe, it, expect, jest } from '@jest/globals';

// Mock do repositório
const mockRelatoriosRepository = {
  executarTransacao: jest.fn((callback) => callback({
    query: jest.fn().mockResolvedValue({ rows: [] })
  })),
  buscarRelatorioPorId: jest.fn(),
  buscarDadosRelacionados: jest.fn()
};

jest.unstable_mockModule('../../repositories/relatoriosRepository.js', () => ({
  default: mockRelatoriosRepository
}));

// Import dinâmico após mock
const { default: relatoriosService } = await import('../relatoriosService.js');

describe('Relatórios Service', () => {
  it('deve ter método gerarPdfBuffer', () => {
    expect(typeof relatoriosService.gerarPdfBuffer).toBe('function');
  });

  it('gerarPdfBuffer deve retornar null para relatório inexistente', async () => {
    mockRelatoriosRepository.buscarRelatorioPorId.mockResolvedValue(null);

    const result = await relatoriosService.gerarPdfBuffer(999);
    
    expect(result).toBeNull();
  });

  // Nota: Testes completos de geração de PDF requerem dados reais e dependências pesadas
  // Para testes E2E: usar banco de dados de teste com dados seed
});
