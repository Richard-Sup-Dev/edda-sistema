// src/repositories/servicosRepository.js

import relatoriosRepo from './relatoriosRepository.js'; 
const { pool, executarTransacao } = relatoriosRepo;

async function listarServicos() {
    const sql = `
        SELECT id, nome_servico, descricao, valor_unitario
        FROM servicos 
        ORDER BY nome_servico
    `;
    const result = await pool.query(sql);
    return result.rows;
}

async function buscarServicoPorId(id) {
    const sql = 'SELECT * FROM servicos WHERE id = $1';
    const result = await pool.query(sql, [id]);
    return result.rows[0];
}

async function criarServico(servicoData, dbInstance) {
    const columns = ['nome_servico', 'descricao', 'valor_unitario'];
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    
    const sql = `
        INSERT INTO servicos (${columns.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING id
    `;
    
    const values = columns.map(col => servicoData[col]);
    
    const result = await dbInstance.query(sql, values);
    return result.rows[0].id;
}

async function atualizarServico(id, servicoData, dbInstance) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in servicoData) {
        if (servicoData[key] !== undefined) {
            fields.push(`${key} = $${index++}`);
            values.push(servicoData[key]);
        }
    }

    if (fields.length === 0) return 0;

    values.push(id); 
    const sql = `
        UPDATE servicos 
        SET ${fields.join(', ')} 
        WHERE id = $${index}
    `;

    const result = await dbInstance.query(sql, values);
    return result.rowCount;
}

async function deletarServico(id, dbInstance) {
    const sql = 'DELETE FROM servicos WHERE id = $1';
    const result = await dbInstance.query(sql, [id]);
    return result.rowCount;
}


export default {
    listarServicos,
    buscarServicoPorId,
    criarServico,
    atualizarServico,
    deletarServico,
    executarTransacao 
};