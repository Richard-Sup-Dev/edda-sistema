// backend/src/routes/financeiroRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import relatoriosRepository from '../repositories/relatoriosRepository.js';
import logger from '../config/logger.js';

const router = express.Router();

/**
 * @swagger
 * /api/financeiro/resumo:
 *   get:
 *     summary: Resumo financeiro do sistema
 *     description: Retorna dashboard financeiro com totais faturados, pendentes, evolução mensal. Apenas admin/técnico.
 *     tags: [Financeiro]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo financeiro completo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAcumuladoAno:
 *                   type: number
 *                   format: float
 *                   description: Total faturado no ano atual
 *                 valorPendente:
 *                   type: number
 *                   format: float
 *                   description: Valor de OS abertas/pendentes
 *                 valorConcluido:
 *                   type: number
 *                   format: float
 *                   description: Valor de OS concluídas no mês
 *                 valorFaturado:
 *                   type: number
 *                   format: float
 *                   description: Valor faturado no mês
 *                 variacaoPendente:
 *                   type: number
 *                   format: float
 *                   description: Variação percentual do pendente (mês anterior)
 *                 variacaoConcluido:
 *                   type: number
 *                   format: float
 *                 variacaoFaturado:
 *                   type: number
 *                   format: float
 *                 osAbertas:
 *                   type: integer
 *                   description: Número de OS abertas
 *                 finalizadas:
 *                   type: integer
 *                   description: Número de OS finalizadas
 *                 nfEmitidas:
 *                   type: integer
 *                   description: Número de NFs emitidas
 *                 evolucaoMensal:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       mes:
 *                         type: string
 *                       valor:
 *                         type: number
 *       403:
 *         description: Sem permissão
 *       500:
 *         description: Erro ao buscar dados financeiros
 */
router.get(
  '/resumo',
  authMiddleware,
  roleMiddleware('admin', 'tecnico'),
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
      logger.error('Erro ao gerar resumo financeiro:', { error, stack: error.stack });
      return res.status(500).json({ erro: 'Erro interno ao gerar resumo financeiro.', detalhes: error.message, stack: error.stack });
    }
  }
);

export default router;