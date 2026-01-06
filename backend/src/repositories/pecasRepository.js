// src/repositories/pecasRepository.js

import relatoriosRepo from './relatoriosRepository.js';
const { pool, executarTransacao } = relatoriosRepo;

// ==================== LISTAR PEÇAS ====================
async function listarPecas() {
  const sql = `
    SELECT 
      id, 
      nome_peca, 
      codigo_fabrica, 
      valor_custo, 
      valor_venda
    FROM pecas 
    ORDER BY nome_peca ASC
  `;

  try {
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error('Erro no repositório ao listar peças:', error);
    throw error;
  }
}

// ==================== BUSCAR PEÇA POR ID ====================
async function buscarPecaPorId(id, dbInstance = pool) {
  if (!id || isNaN(id)) return null;

  const sql = 'SELECT * FROM pecas WHERE id = $1';
  try {
    const result = await dbInstance.query(sql, [Number(id)]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar peça por ID:', error);
    throw error;
  }
}

// ==================== BUSCAR ÚLTIMO CÓDIGO NUMÉRICO (PARA GERAÇÃO AUTOMÁTICA) ====================
async function buscarUltimoCodigoNumerico(dbInstance = pool) {
  const sql = `
    SELECT codigo_fabrica 
    FROM pecas 
    WHERE codigo_fabrica ~ '^[0-9]+$'
    ORDER BY CAST(codigo_fabrica AS INTEGER) DESC 
    LIMIT 1
  `;

  try {
    const result = await dbInstance.query(sql);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar último código numérico:', error);
    throw error;
  }
}

// ==================== BUSCAR POR CÓDIGO DE FÁBRICA (VERIFICA DUPLICIDADE) ====================
async function buscarPorCodigoFabrica(codigo, dbInstance = pool) {
  if (!codigo || typeof codigo !== 'string') return null;

  const sql = 'SELECT id FROM pecas WHERE codigo_fabrica = $1';
  try {
    const result = await dbInstance.query(sql, [codigo.trim()]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar peça por código de fábrica:', error);
    throw error;
  }
}

// ==================== CRIAR PEÇA ====================
async function criarPeca(pecaData, dbInstance = pool) {
  const columns = ['nome_peca', 'codigo_fabrica', 'valor_custo', 'valor_venda'];
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
  
  const sql = `
    INSERT INTO pecas (${columns.join(', ')})
    VALUES (${placeholders})
    ON CONFLICT (codigo_fabrica) DO NOTHING  -- Evita erro se código duplicado (raro, mas seguro)
    RETURNING id
  `;

  const values = columns.map(col => {
    const value = pecaData[col];
    return value === '' ? null : value; // Converte string vazia em null
  });

  try {
    const result = await dbInstance.query(sql, values);
    
    if (result.rowCount === 0) {
      throw new Error('Não foi possível criar a peça: código de fábrica já existe.');
    }
    
    return result.rows[0].id;
  } catch (error) {
    console.error('Erro ao criar peça no repositório:', error);
    throw error;
  }
}

// ==================== ATUALIZAR PEÇA ====================
async function atualizarPeca(id, pecaData, dbInstance = pool) {
  if (!id || isNaN(id)) {
    throw new Error('ID inválido para atualização.');
  }

  const validFields = ['nome_peca', 'codigo_fabrica', 'valor_custo', 'valor_venda'];
  const fields = [];
  const values = [];
  let index = 1;

  for (const key of validFields) {
    if (pecaData[key] !== undefined) {
      fields.push(`${key} = $${index++}`);
      values.push(pecaData[key] === '' ? null : pecaData[key]);
    }
  }

  if (fields.length === 0) {
    return 0; // Nenhum campo para atualizar
  }

  values.push(Number(id));

  const sql = `
    UPDATE pecas
    SET ${fields.join(', ')}, atualizado_em = NOW()
    WHERE id = $${index}
    RETURNING id
  `;

  try {
    const result = await dbInstance.query(sql, values);
    return result.rowCount;
  } catch (error) {
    console.error('Erro ao atualizar peça no repositório:', error);
    throw error;
  }
}

// ==================== DELETAR PEÇA ====================
async function deletarPeca(id, dbInstance = pool) {
  if (!id || isNaN(id)) {
    throw new Error('ID inválido para exclusão.');
  }

  const sql = 'DELETE FROM pecas WHERE id = $1 RETURNING id';

  try {
    const result = await dbInstance.query(sql, [Number(id)]);
    return result.rowCount;
  } catch (error) {
    console.error('Erro ao deletar peça no repositório:', error);
    // Propaga o erro original para o service tratar (ex: violação de FK)
    throw error;
  }
}

// ==================== EXPORT ====================
export default {
  listarPecas,
  buscarPecaPorId,
  buscarUltimoCodigoNumerico,
  buscarPorCodigoFabrica,
  criarPeca,
  atualizarPeca,
  deletarPeca,
  executarTransacao
};