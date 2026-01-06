// src/__tests__/services/clientesService.test.js
import clientesService from '../../services/clientesService.js';
import clientesRepository from '../../repositories/clientesRepository.js';
import Joi from 'joi';

// Mock do repositório
jest.mock('../../repositories/clientesRepository.js');

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

      clientesRepository.criarCliente.mockResolvedValue(mockCliente);

      const resultado = await clientesService.criarCliente(dadosValidos);

      expect(resultado).toEqual(mockCliente);
      expect(clientesRepository.criarCliente).toHaveBeenCalledWith(dadosValidos);
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
      const dadosAtualizacao = { nome_fantasia: 'Empresa Atualizada' };
      const mockCliente = { id, cnpj: '12345678901234', ...dadosAtualizacao };

      clientesRepository.atualizarCliente.mockResolvedValue(mockCliente);

      const resultado = await clientesService.atualizarCliente(id, dadosAtualizacao);

      expect(resultado).toEqual(mockCliente);
      expect(clientesRepository.atualizarCliente).toHaveBeenCalledWith(id, dadosAtualizacao);
    });

    it('deve validar ID ao atualizar', async () => {
      await expect(clientesService.atualizarCliente(null, {})).rejects.toThrow();
    });

    it('deve lançar erro se cliente não encontrado', async () => {
      clientesRepository.atualizarCliente.mockResolvedValue(null);

      const resultado = await clientesService.atualizarCliente(999, {});

      expect(resultado).toBeNull();
    });
  });

  describe('deletarCliente', () => {
    it('deve deletar cliente existente', async () => {
      const id = 1;

      clientesRepository.deletarCliente.mockResolvedValue(true);

      const resultado = await clientesService.deletarCliente(id);

      expect(resultado).toBe(true);
      expect(clientesRepository.deletarCliente).toHaveBeenCalledWith(id);
    });

    it('deve validar ID ao deletar', async () => {
      await expect(clientesService.deletarCliente(null)).rejects.toThrow();
    });

    it('deve retornar false se cliente não encontrado', async () => {
      clientesRepository.deletarCliente.mockResolvedValue(false);

      const resultado = await clientesService.deletarCliente(999);

      expect(resultado).toBe(false);
    });
  });
});
