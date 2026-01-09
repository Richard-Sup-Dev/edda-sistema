// backend/src/routes/financeiroRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import relatoriosRepository from '../repositories/relatoriosRepository.js';
import logger from '../config/logger.js';

const router = express.Router();

// ====================== RESUMO FINANCEIRO ======================
// Rota protegida: apenas usuários autenticados podem acessar (admin e técnicos veem o dashboard financeiro)
router.get(
  '/resumo',
  authMiddleware,                         // Verifica se está logado
  roleMiddleware('admin', 'tecnico'),     // Apenas admin ou técnico (ajuste conforme sua necessidade)
  async (req, res) => {
    try {
      const anoAtual = new Date().getFullYear();

      // Busca todos os dados necessários (otimizado para poucas queries)
      const [
        totalAcumuladoAno,
        valorPendenteAtual,
        valorConcluidoAtual,
        valorFaturadoAtual,
        valorPendenteAnterior,
        valorConcluidoAnterior,
        valorFaturadoAnterior,
        contadores,
        evolucaoMensal
      ] = await Promise.all([
        relatoriosRepository.getTotalFaturadoPorAno(anoAtual),
        relatoriosRepository.getTotalPendente(),
        relatoriosRepository.getTotalConcluidoMesAtual(),
        relatoriosRepository.getTotalFaturadoMesAtual(),
        relatoriosRepository.getTotalPendenteMesAnterior(),
        relatoriosRepository.getTotalConcluidoMesAnterior(),
        relatoriosRepository.getTotalFaturadoMesAnterior(),
        relatoriosRepository.getContadores(),
        relatoriosRepository.getEvolucaoMensal()
      ]);

      // Desestrutura contadores
      const { osAbertas = 0, finalizadas = 0, nfEmitidas = 0 } = contadores || {};

      // Função segura para calcular variação percentual
      const calcVariacao = (atual, anterior) => {
        atual = Number(atual) || 0;
        anterior = Number(anterior) || 0;
        if (anterior === 0) return atual > 0 ? 100 : 0;
        return Number(((atual - anterior) / anterior) * 100).toFixed(1);
      };

      return res.status(200).json({
        total_anual: Number(totalAcumuladoAno) || 0,

        pendentes: {
          valor: Number(valorPendenteAtual) || 0,
          variacao: calcVariacao(valorPendenteAtual, valorPendenteAnterior),
          os_count: Number(osAbertas)
        },

        concluidos_mes: {
          valor: Number(valorConcluidoAtual) || 0,
          variacao: calcVariacao(valorConcluidoAtual, valorConcluidoAnterior),
          os_count: Number(finalizadas)
        },

        faturado_mes: {
          valor: Number(valorFaturadoAtual) || 0,
          variacao: calcVariacao(valorFaturadoAtual, valorFaturadoAnterior),
          nf_count: Number(nfEmitidas)
        },

        evolucao_mensal: evolucaoMensal || []
      });

    } catch (error) {
      logger.error('Erro ao gerar resumo financeiro:', error);
      return res.status(500).json({ erro: 'Erro interno ao gerar resumo financeiro.' });
    }
  }
);

export default router;