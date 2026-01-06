// src/repositories/clientesRepository.js

import relatoriosRepo from './relatoriosRepository.js';
const { executarTransacao, pool } = relatoriosRepo;

// ==================== LISTAR CLIENTES ====================
async function listarClientes() {
  const sql = `
    SELECT 
      id, 
      cnpj, 
      nome_fantasia, 
      razao_social,
      responsavel_contato, 
      cidade, 
      estado,
      cep
    FROM clientes 
    ORDER BY nome_fantasia ASC
    LIMIT 200  -- Aumentado para mais resultados úteis, mas ainda seguro
  `;

  try {
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error('Erro no repositório ao listar clientes:', error);
    throw error; // Propaga para o service tratar
  }
}

// ==================== BUSCAR POR CNPJ ====================
async function buscarClientePorCnpj(cnpj, dbInstance = pool) {
  if (!cnpj || typeof cnpj !== 'string' || cnpj.length !== 14) {
    return null;
  }

  const sql = 'SELECT id, cnpj, nome_fantasia FROM clientes WHERE cnpj = $1';
  try {
    const result = await dbInstance.query(sql, [cnpj]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar cliente por CNPJ:', error);
    throw error;
  }
}

// ==================== BUSCAR POR ID ====================
async function buscarClientePorId(id, dbInstance = pool) {
  if (!id || isNaN(id)) {
    return null;
  }

  const sql = 'SELECT * FROM clientes WHERE id = $1';
  try {
    const result = await dbInstance.query(sql, [Number(id)]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar cliente por ID:', error);
    throw error;
  }
}

// ==================== CRIAR CLIENTE ====================
async function criarCliente(clienteData, dbInstance = pool) {
  const columns = [
    'cnpj',
    'nome_fantasia',
    'razao_social',
    'endereco',
    'bairro',
    'cidade',
    'estado',
    'cep',
    'responsavel_contato'
  ];

  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
  const sql = `
    INSERT INTO clientes (${columns.join(', ')})
    VALUES (${placeholders})
    ON CONFLICT (cnpj) DO NOTHING  -- Evita erro de duplicidade no banco
    RETURNING id
  `;

  const values = columns.map(col => 
    clienteData[col] === '' ? null : clienteData[col] // Converte string vazia em null (boa prática para campos optional)
  );

  try {
    const result = await dbInstance.query(sql, values);
    if (result.rowCount === 0) {
      throw new Error('CNPJ já cadastrado (conflito detectado).');
    }
    return result.rows[0].id;
  } catch (error) {
    console.error('Erro ao criar cliente no repositório:', error);
    throw error;
  }
}

// ==================== ATUALIZAR CLIENTE ====================
async function atualizarCliente(id, clienteData, dbInstance = pool) {
  if (!id || isNaN(id)) {
    throw new Error('ID inválido para atualização.');
  }

  const validFields = [
    'nome_fantasia', 'razao_social', 'endereco', 'bairro',
    'cidade', 'estado', 'cep', 'responsavel_contato'
  ];

  const fields = [];
  const values = [];
  let index = 1;

  for (const key of validFields) {
    if (clienteData[key] !== undefined) {
      fields.push(`${key} = $${index++}`);
      values.push(clienteData[key] === '' ? null : clienteData[key]);
    }
  }

  // Não permite atualizar o CNPJ (segurança)
  if ('cnpj' in clienteData) {
    throw new Error('Não é permitido alterar o CNPJ de um cliente existente.');
  }

  if (fields.length === 0) {
    return 0; // Nenhum campo para atualizar
  }

  values.push(Number(id));
  const sql = `
    UPDATE clientes
    SET ${fields.join(', ')}, atualizado_em = NOW()
    WHERE id = $${index}
    RETURNING id
  `;

  try {
    const result = await dbInstance.query(sql, values);
    return result.rowCount;
  } catch (error) {
    console.error('Erro ao atualizar cliente no repositório:', error);
    throw error;
  }
}

// ==================== EXPORT ====================
export default {
  listarClientes,
  buscarClientePorCnpj,
  buscarClientePorId,
  criarCliente,
  atualizarCliente,
  executarTransacao 
};