// src/__tests__/services/clientesService.test.js
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Criar mocks manuais que funcionam com ESM
const mockClientesRepository = {
  listarClientes: jest.fn(),
  buscarClientePorId: jest.fn(),
  buscarClientePorCnpj: jest.fn(),
  criarCliente: jest.fn(),
  atualizarCliente: jest.fn(),
  deletarCliente: jest.fn(),
  executarTransacao: jest.fn((callback) => {
    // Simula transação executando callback com mock de cliente de transação
    return callback(mockClientesRepository);
  })
};

// Mockar o módulo antes do import
jest.unstable_mockModule('../../repositories/clientesRepository.js', () => ({
  default: mockClientesRepository
}));

// Imports dinâmicos após mock
const { default: clientesService } = await import('../../services/clientesService.js');
const { default: clientesRepository } = await import('../../repositories/clientesRepository.js');

describe('ClientesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listarClientes', () => {
    it('deve retornar lista de clientes', async () => {
      const mockClientes = [
        { id: 1, nome_fantasia: 'Empresa A', cnpj: '12345678901234' },
        { id: 2, nome_fantasia: 'Empresa B', cnpj: '98765432109876' }
      ];

      clientesRepository.listarClientes.mockResolvedValue(mockClientes);

      const resultado = await clientesService.listarClientes();

      expect(resultado).toEqual(mockClientes);
      expect(clientesRepository.listarClientes).toHaveBeenCalled();
    });

    it('deve retornar array vazio se não houver clientes', async () => {
      clientesRepository.listarClientes.mockResolvedValue([]);

      const resultado = await clientesService.listarClientes();

      expect(resultado).toEqual([]);
      expect(Array.isArray(resultado)).toBe(true);
    });

    it('deve lançar erro ao listar clientes falhar', async () => {
      clientesRepository.listarClientes.mockRejectedValue(new Error('Erro no banco'));

      await expect(clientesService.listarClientes()).rejects.toThrow();
    });
  });

  describe('buscarClientePorId', () => {
    it('deve retornar cliente por ID válido', async () => {
      const mockCliente = { id: 1, nome_fantasia: 'Empresa A', cnpj: '12345678901234' };

      clientesRepository.buscarClientePorId.mockResolvedValue(mockCliente);

      const resultado = await clientesService.buscarClientePorId(1);

      expect(resultado).toEqual(mockCliente);
      expect(clientesRepository.buscarClientePorId).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro com ID inválido', async () => {
      await expect(clientesService.buscarClientePorId(null)).rejects.toThrow('ID inválido');
      await expect(clientesService.buscarClientePorId('abc')).rejects.toThrow('ID inválido');
    });

    it('deve retornar null se cliente não encontrado', async () => {
      clientesRepository.buscarClientePorId.mockResolvedValue(null);

      const resultado = await clientesService.buscarClientePorId(999);

      expect(resultado).toBeNull();
    });
  });

  describe('criarCliente', () => {
    const dadosValidos = {
      cnpj: '12345678901234',
      nome_fantasia: 'Nova Empresa',
      endereco: 'Rua Teste, 123',
      cidade: 'São Paulo',
      estado: 'SP'
    };

    it('deve criar cliente com dados válidos', async () => {
      const mockCliente = { id: 1, ...dadosValidos };

      // Mock para buscar CNPJ (não deve existir)
      clientesRepository.buscarClientePorCnpj.mockResolvedValue(null);
      // Mock para criar cliente
      clientesRepository.criarCliente.mockResolvedValue(mockCliente);

      const resultado = await clientesService.criarCliente(dadosValidos);

      expect(resultado).toEqual(mockCliente);
      expect(clientesRepository.buscarClientePorCnpj).toHaveBeenCalled();
      expect(clientesRepository.criarCliente).toHaveBeenCalledWith(dadosValidos, expect.any(Object));
    });

    it('deve validar CNPJ obrigatório', async () => {
      const dadosInvalidos = { ...dadosValidos, cnpj: '' };

      await expect(clientesService.criarCliente(dadosInvalidos)).rejects.toThrow();
    });

    it('deve validar nome_fantasia obrigatório', async () => {
      const dadosInvalidos = { ...dadosValidos, nome_fantasia: '' };

      await expect(clientesService.criarCliente(dadosInvalidos)).rejects.toThrow();
    });

    it('deve validar comprimento de CNPJ', async () => {
      const dadosInvalidos = { ...dadosValidos, cnpj: '123' };

      await expect(clientesService.criarCliente(dadosInvalidos)).rejects.toThrow();
    });

    it('deve validar comprimento de nome_fantasia', async () => {
      const dadosInvalidos = { 
        ...dadosValidos, 
        nome_fantasia: 'A'.repeat(101) 
      };

      await expect(clientesService.criarCliente(dadosInvalidos)).rejects.toThrow();
    });

    it('deve rejeitar campos desconhecidos', async () => {
      const dadosInvalidos = { ...dadosValidos, campoDesconhecido: 'valor' };

      await expect(clientesService.criarCliente(dadosInvalidos)).rejects.toThrow();
    });
  });

  describe('atualizarCliente', () => {
    it('deve atualizar cliente existente', async () => {
      const id = 1;
      const dadosAtualizacao = { 
        cnpj: '12345678901234',
        nome_fantasia: 'Empresa Atualizada' 
      };

      // Mock retorna número de linhas afetadas
      clientesRepository.atualizarCliente.mockResolvedValue(1);

      const resultado = await clientesService.atualizarCliente(id, dadosAtualizacao);

      expect(resultado).toBe(1);
      expect(clientesRepository.atualizarCliente).toHaveBeenCalled();
    });

    it('deve validar ID ao atualizar', async () => {
      await expect(clientesService.atualizarCliente(null, { 
        cnpj: '12345678901234',
        nome_fantasia: 'Test' 
      })).rejects.toThrow('ID inválido');
    });

    it('deve lançar erro se cliente não encontrado', async () => {
      clientesRepository.atualizarCliente.mockResolvedValue(0);

      await expect(clientesService.atualizarCliente(999, { 
        cnpj: '12345678901234',
        nome_fantasia: 'Test' 
      })).rejects.toThrow('Cliente não encontrado');
    });
  });

  // Nota: deletarCliente não está implementado no service atualmente
  // Se for necessário, implemente-o primeiro no service antes de testar
});
