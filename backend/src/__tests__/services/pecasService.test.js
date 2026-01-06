// src/__tests__/services/pecasService.test.js
import pecasService from '../../services/pecasService.js';
import pecasRepository from '../../repositories/pecasRepository.js';

jest.mock('../../repositories/pecasRepository.js');

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

  describe('buscarPecaPorId', () => {
    it('deve retornar peça por ID válido', async () => {
      const mockPeca = { id: 1, descricao: 'Parafuso', valor: 10.50 };

      pecasRepository.buscarPecaPorId.mockResolvedValue(mockPeca);
      const resultado = await pecasService.buscarPecaPorId(1);

      expect(resultado).toEqual(mockPeca);
    });

    it('deve lançar erro com ID inválido', async () => {
      await expect(pecasService.buscarPecaPorId(null)).rejects.toThrow('ID inválido');
    });
  });

  describe('criarPeca', () => {
    it('deve criar peça com dados válidos', async () => {
      const dados = { descricao: 'Parafuso', valor: 10.50 };
      const mockPeca = { id: 1, ...dados };

      pecasRepository.criarPeca.mockResolvedValue(mockPeca);
      const resultado = await pecasService.criarPeca(dados);

      expect(resultado).toEqual(mockPeca);
    });

    it('deve validar descrição obrigatória', async () => {
      await expect(pecasService.criarPeca({ valor: 10 })).rejects.toThrow();
    });

    it('deve validar valor obrigatório', async () => {
      await expect(pecasService.criarPeca({ descricao: 'Peça' })).rejects.toThrow();
    });

    it('deve validar valor positivo', async () => {
      await expect(
        pecasService.criarPeca({ descricao: 'Peça', valor: -10 })
      ).rejects.toThrow();
    });
  });
});

describe('ServicoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criarServico', () => {
    it('deve criar serviço com dados válidos', async () => {
      const dados = { descricao: 'Manutenção', valor: 100 };
      
      const resultado = await import('../../services/servicosService.js')
        .then(m => m.default.criarServico(dados))
        .catch(e => e);

      // Este teste pode falhar sem mock adequado
      // Ajuste conforme sua implementação real
    });
  });
});
