// backend/src/controllers/nfsController.js
import { generateAndSaveNF } from '../utils/nfGenerator.js';
import NF from '../models/nfModel.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const nfsController = {
  generateNF: async (req, res) => {
    const {
      cliente,
      itens,
      total,
      deducoes,
      baseISS,
      valorISS,
      aliquota,
      informacoesComplementares,
      osNumero,
    } = req.body;

    // ==================== 1. AUTENTICAÇÃO OBRIGATÓRIA ====================
    let usuarioEmissorId = null;

    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Token de autenticação ausente ou inválido.' });
      }

      const token = authHeader.split(' ')[1];

      // Use jwt.verify() em vez de jwt.decode() — isso valida a assinatura e expiração!
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.id) {
        return res.status(401).json({ erro: 'Token inválido ou corrompido.' });
      }

      usuarioEmissorId = decoded.id;
    } catch (error) {
      console.warn('Falha na autenticação JWT:', error.message);

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ erro: 'Token JWT inválido.' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ erro: 'Token expirado. Faça login novamente.' });
      }

      return res.status(401).json({ erro: 'Falha na autenticação.' });
    }

    // ==================== 2. VALIDAÇÕES BÁSICAS DE ENTRADA ====================
    if (!cliente || !cliente.id) {
      return res.status(400).json({ erro: 'ID do cliente é obrigatório.' });
    }

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: 'É obrigatório informar pelo menos um item.' });
    }

    if (!total || !valorISS || !aliquota) {
      return res.status(400).json({ erro: 'Total, valor ISS e alíquota são obrigatórios.' });
    }

    try {
      // ==================== 3. GERAR NÚMERO SEQUENCIAL ====================
      const numeroNF = await NF.getNextNumeroNF();

      // ==================== 4. MONTAR DADOS PARA O GERADOR DE PDF ====================
      const nfData = {
        numeroNF,
        cliente,
        itens,
        total,
        deducoes,
        baseISS,
        valorISS,
        aliquota,
        informacoesComplementares,
        osNumero,
      };

      // ==================== 5. GERAR E SALVAR PDF ====================
      const relativePath = await generateAndSaveNF(nfData);

      // ==================== 6. SALVAR METADADOS NO BANCO ====================
      const dbData = {
        numeroNF,
        clienteId: cliente.id,
        clienteNome: cliente.nome_fantasia || cliente.nome || 'Cliente sem nome',
        total,
        valorISS,
        aliquota,
        caminhoPdf: relativePath,
        usuarioEmissorId,
      };

      await NF.saveNF(dbData);

      // ==================== 7. RESPOSTA DE SUCESSO ====================
      return res.status(201).json({
        mensagem: 'Nota Fiscal gerada e salva com sucesso!',
        numeroNF,
        caminhoPdf: relativePath,
        urlAcesso: `${process.env.APP_URL || 'http://localhost:3333'}/uploads/${relativePath}`,
      });
    } catch (error) {
      console.error('###############################################');
      console.error('ERRO CRÍTICO NA GERAÇÃO DA NOTA FISCAL:', error);
      console.error('###############################################');

      let status = 500;
      let resposta = { erro: 'Erro interno do servidor ao gerar Nota Fiscal.' };

      if (error.name === 'SequelizeForeignKeyConstraintError') {
        status = 400;
        resposta = {
          erro: 'Cliente ou usuário emissor não encontrado no banco de dados.',
          detalhes: 'Verifique se o clienteId existe.',
        };
      } else if (error.name === 'SequelizeValidationError') {
        status = 400;
        resposta = {
          erro: 'Dados inválidos para salvar a NF.',
          detalhes: error.errors.map((e) => e.message).join('; '),
        };
      } else if (error.message?.includes('disco') || error.message?.includes('pdf')) {
        status = 500;
        resposta = { erro: 'Falha ao gerar ou salvar o arquivo PDF.' };
      }

      return res.status(status).json(resposta);
    }
  },
};

export default nfsController;