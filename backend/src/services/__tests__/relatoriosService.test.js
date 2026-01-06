// src/services/__tests__/relatoriosService.test.js

import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { gerarPdf } from '../relatoriosService.js';

// Mockar a dependência do repositório para isolar o teste
jest.mock('../../repositories/relatoriosRepository.js', () => ({
    executarTransacao: jest.fn((callback) => callback({
        query: jest.fn()
    })),
    buscarRelatorioPorId: jest.fn(() => ({
        os_numero: '12345',
        numero_rte: 'RTE-01',
        data_emissao: new Date(),
    
    })),
    buscarDadosRelacionados: jest.fn(() => ({
        medicoesIsolamento: [{ descricao: 'teste', valor: 20000, unidade: 'MΩ' }],
        medicoesBatimento: [{ descricao: 'teste', valor: 0.05, unidade: 'mm', tolerancia: 'H' }],
        pecasAtuais: [],
        fotosRelatorio: []
    })),
}));

describe('Testes para a camada de serviço de relatórios', () => {
    it('deve retornar um buffer de PDF ao gerar um relatório válido', async () => {
        // Simula o retorno de dados válidos
        const relatorioId = 1;
        const pdfBuffer = await gerarPdf(relatorioId);

        // Verifica se a função retorna algo
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        
        // Verifica se a transação do repositório foi chamada
        const { executarTransacao } = require('../../repositories/relatoriosRepository');
        expect(executarTransacao).toHaveBeenCalled();
    });

    it('deve retornar null se o relatório não for encontrado', async () => {
        // Simula o repositório não encontrando o relatório
        const { buscarRelatorioPorId } = require('../../repositories/relatoriosRepository');
        buscarRelatorioPorId.mockResolvedValue(null);

        const relatorioId = 999;
        const pdfBuffer = await gerarPdf(relatorioId);

        // Verifica se o resultado é nulo
        expect(pdfBuffer).toBeNull();
    });
});