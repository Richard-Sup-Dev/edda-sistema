// src/__tests__/services/pecasService.test.js
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Criar mocks manuais que funcionam com ESM
const mockPecasRepository = {
  listarPecas: jest.fn(),
  buscarPecaPorId: jest.fn(),
  buscarPorCodigoFabrica: jest.fn(),
  criarPeca: jest.fn(),
  atualizarPeca: jest.fn(),
  deletarPeca: jest.fn(),
  buscarUltimoCodigoNumerico: jest.fn(),
  executarTransacao: jest.fn((callback) => {
    // Simula transação executando callback com mock de cliente de transação
    return callback(mockPecasRepository);
  })
};

// Mockar o módulo antes do import
jest.unstable_mockModule('../../repositories/pecasRepository.js', () => ({
  default: mockPecasRepository
}));

// Imports dinâmicos após mock
const { default: pecasService } = await import('../../services/pecasService.js');
const { default: pecasRepository } = await import('../../repositories/pecasRepository.js');

describe('PecasService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listarPecas', () => {
    it('deve retornar lista de peças', async () => {
      const mockPecas = [
        { id: 1, descricao: 'Parafuso', valor: 10.50 },
        { id: 2, descricao: 'Polia', valor: 25.00 }
      ];

      pecasRepository.listarPecas.mockResolvedValue(mockPecas);
      const resultado = await pecasService.listarPecas();

      expect(resultado).toEqual(mockPecas);
      expect(pecasRepository.listarPecas).toHaveBeenCalled();
    });

    it('deve retornar array vazio se não houver peças', async () => {
      pecasRepository.listarPecas.mockResolvedValue([]);
      const resultado = await pecasService.listarPecas();

      expect(resultado).toEqual([]);
      expect(Array.isArray(resultado)).toBe(true);
    });
  });

  describe('criarPeca', () => {
    it('deve criar peça com dados válidos', async () => {
      const dados = { 
        nome_peca: 'Parafuso M8', 
        codigo_fabrica: '12345',
        valor_custo: 10.50,
        valor_venda: 15.00 
      };
      const mockPeca = { id: 1, ...dados };

      pecasRepository.buscarUltimoCodigoNumerico.mockResolvedValue(null);
      pecasRepository.buscarPorCodigoFabrica.mockResolvedValue(null); // Não existe código duplicado
      pecasRepository.criarPeca.mockResolvedValue(mockPeca);
      
      const resultado = await pecasService.criarPeca(dados);

      expect(resultado).toEqual(mockPeca);
    });

    it('deve validar nome_peca obrigatório', async () => {
      await expect(pecasService.criarPeca({ 
        valor_custo: 10,
        valor_venda: 15
      })).rejects.toThrow();
    });

    it('deve validar valor_custo negativo', async () => {
      await expect(
        pecasService.criarPeca({ 
          nome_peca: 'Peça', 
          valor_custo: -10,
          valor_venda: 15
        })
      ).rejects.toThrow();
    });

    it('deve validar valor_venda negativo', async () => {
      await expect(
        pecasService.criarPeca({ 
          nome_peca: 'Peça', 
          valor_custo: 10,
          valor_venda: -15
        })
      ).rejects.toThrow();
    });
  });
});
