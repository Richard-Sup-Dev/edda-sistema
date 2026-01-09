import Notificacao from '../models/Notificacao.js';
import { Op } from 'sequelize';

// Listar notificações do usuário
export const listarNotificacoes = async (req, res) => {
  try {
    const { page = 1, limit = 20, tipo, lida } = req.query;
    const offset = (page - 1) * limit;

    const where = { usuarioId: req.user.id };

    // Filtrar por tipo se especificado
    if (tipo) {
      where.tipo = tipo;
    }

    // Filtrar por status de leitura
    if (lida !== undefined) {
      where.lida = lida === 'true';
    }

    // Remover notificações expiradas
    where[Op.or] = [
      { expiraEm: null },
      { expiraEm: { [Op.gt]: new Date() } }
    ];

    const { count, rows } = await Notificacao.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      notificacoes: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      naoLidas: await Notificacao.count({
        where: { usuarioId: req.user.id, lida: false }
      })
    });
  } catch (error) {
    console.error('Erro ao listar notificações:', error);
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
};

// Contar notificações não lidas
export const contarNaoLidas = async (req, res) => {
  try {
    const count = await Notificacao.count({
      where: {
        usuarioId: req.user.id,
        lida: false,
        [Op.or]: [
          { expiraEm: null },
          { expiraEm: { [Op.gt]: new Date() } }
        ]
      }
    });

    res.json({ count });
  } catch (error) {
    console.error('Erro ao contar notificações:', error);
    res.status(500).json({ error: 'Erro ao contar notificações' });
  }
};

// Marcar notificação como lida
export const marcarComoLida = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacao = await Notificacao.findOne({
      where: { id, usuarioId: req.user.id }
    });

    if (!notificacao) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    await notificacao.update({ lida: true });

    res.json({ message: 'Notificação marcada como lida', notificacao });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).json({ error: 'Erro ao atualizar notificação' });
  }
};

// Marcar todas como lidas
export const marcarTodasComoLidas = async (req, res) => {
  try {
    const [updated] = await Notificacao.update(
      { lida: true },
      {
        where: {
          usuarioId: req.user.id,
          lida: false
        }
      }
    );

    res.json({
      message: 'Todas as notificações marcadas como lidas',
      quantidade: updated
    });
  } catch (error) {
    console.error('Erro ao marcar todas como lidas:', error);
    res.status(500).json({ error: 'Erro ao atualizar notificações' });
  }
};

// Deletar notificação
export const deletarNotificacao = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacao = await Notificacao.findOne({
      where: { id, usuarioId: req.user.id }
    });

    if (!notificacao) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    await notificacao.destroy();

    res.json({ message: 'Notificação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    res.status(500).json({ error: 'Erro ao deletar notificação' });
  }
};

// Deletar todas as notificações lidas
export const deletarLidas = async (req, res) => {
  try {
    const deleted = await Notificacao.destroy({
      where: {
        usuarioId: req.user.id,
        lida: true
      }
    });

    res.json({
      message: 'Notificações lidas deletadas com sucesso',
      quantidade: deleted
    });
  } catch (error) {
    console.error('Erro ao deletar notificações:', error);
    res.status(500).json({ error: 'Erro ao deletar notificações' });
  }
};

// Criar notificação (sistema interno)
export const criarNotificacao = async ({
  usuarioId,
  tipo = 'sistema',
  titulo,
  mensagem,
  link = null,
  dados = null,
  prioridade = 'normal',
  expiraEm = null
}) => {
  try {
    const notificacao = await Notificacao.create({
      usuarioId,
      tipo,
      titulo,
      mensagem,
      link,
      dados,
      prioridade,
      expiraEm
    });

    return notificacao;
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    throw error;
  }
};

// Limpar notificações antigas (cron job)
export const limparAntigas = async (diasAtras = 30) => {
  try {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - diasAtras);

    const deleted = await Notificacao.destroy({
      where: {
        lida: true,
        createdAt: { [Op.lt]: dataLimite }
      }
    });

    console.log(`${deleted} notificações antigas removidas`);
    return deleted;
  } catch (error) {
    console.error('Erro ao limpar notificações antigas:', error);
    throw error;
  }
};
