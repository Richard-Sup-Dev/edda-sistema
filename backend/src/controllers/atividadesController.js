import Atividade from '../models/Atividade.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// Listar atividades recentes
export const listarAtividades = async (req, res) => {
  try {
    const { page = 1, limit = 50, tipo, entidade, usuarioId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    // Filtrar por tipo se especificado
    if (tipo) {
      where.tipo = tipo;
    }

    // Filtrar por entidade
    if (entidade) {
      where.entidade = entidade;
    }

    // Filtrar por usuário (admin pode ver todos, usuário comum só suas próprias)
    if (req.user.role === 'admin' && usuarioId) {
      where.usuarioId = usuarioId;
    } else if (req.user.role !== 'admin') {
      where.usuarioId = req.user.id;
    }

    const { count, rows } = await Atividade.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['id', 'DESC']],
      include: [{
        association: 'usuario',
        attributes: ['id', 'nome', 'email']
      }]
    });

    res.json({
      atividades: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Erro ao listar atividades:', error);
    res.status(500).json({ error: 'Erro ao buscar atividades' });
  }
};

// Listar atividades recentes do sistema (últimas 20)
export const atividadesRecentes = async (req, res) => {
  try {
    // Pegar últimas atividades de todos os usuários (para dashboard)
    const atividades = await sequelize.query(`
      SELECT 
        a.id,
        a.tipo,
        a.acao,
        a.entidade,
        a.entidade_id as "entidadeId",
        a.descricao,
        a.created_at as "createdAt",
        u.nome as usuario
      FROM atividades a
      INNER JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 20
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json({ atividades });
  } catch (error) {
    console.error('Erro ao buscar atividades recentes:', error);
    res.status(500).json({ error: 'Erro ao buscar atividades recentes' });
  }
};

// Registrar atividade (função interna)
export const registrarAtividade = async ({
  usuarioId,
  tipo,
  acao,
  entidade = null,
  entidadeId = null,
  descricao = null,
  dadosAntigos = null,
  dadosNovos = null,
  ip = null,
  userAgent = null
}) => {
  try {
    const atividade = await Atividade.create({
      usuarioId,
      tipo,
      acao,
      entidade,
      entidadeId,
      descricao,
      dadosAntigos,
      dadosNovos,
      ip,
      userAgent
    });

    return atividade;
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
    throw error;
  }
};

// Estatísticas de atividades
export const estatisticas = async (req, res) => {
  try {
    const { periodo = '7' } = req.query;
    const diasAtras = parseInt(periodo);
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - diasAtras);

    // Atividades por tipo
    const porTipo = await Atividade.findAll({
      attributes: [
        'tipo',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ],
      where: {
        createdAt: { [Op.gte]: dataInicio }
      },
      group: ['tipo']
    });

    // Atividades por dia
    const porDia = await sequelize.query(`
      SELECT 
        DATE(created_at) as data,
        COUNT(*) as total
      FROM atividades
      WHERE created_at >= :dataInicio
      GROUP BY DATE(created_at)
      ORDER BY data ASC
    `, {
      replacements: { dataInicio },
      type: sequelize.QueryTypes.SELECT
    });

    // Usuários mais ativos
    const usuariosAtivos = await sequelize.query(`
      SELECT 
        u.nome,
        u.email,
        COUNT(a.id) as total_atividades
      FROM usuarios u
      INNER JOIN atividades a ON u.id = a.usuario_id
      WHERE a.created_at >= :dataInicio
      GROUP BY u.id, u.nome, u.email
      ORDER BY total_atividades DESC
      LIMIT 10
    `, {
      replacements: { dataInicio },
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      porTipo,
      porDia,
      usuariosAtivos,
      periodo: `${diasAtras} dias`
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

// Limpar atividades antigas (cron job)
export const limparAntigas = async (diasAtras = 90) => {
  try {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - diasAtras);

    const deleted = await Atividade.destroy({
      where: {
        createdAt: { [Op.lt]: dataLimite }
      }
    });

    console.log(`${deleted} atividades antigas removidas`);
    return deleted;
  } catch (error) {
    console.error('Erro ao limpar atividades antigas:', error);
    throw error;
  }
};
