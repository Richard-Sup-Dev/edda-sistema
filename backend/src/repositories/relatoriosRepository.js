// src/repositories/relatoriosRepository.js - ADAPTADO PARA POSTGRESQL (NEON)

import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function executarTransacao(callback) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client); 
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release(); 
    }
}


// -------------------------------------------------------------------------
// SALVAR RELATÓRIO (Inclui 'cliente_id')
// -------------------------------------------------------------------------
async function salvarRelatorio(relatorioData, dbInstance) {
    const columns = [
        'os_numero', 'numero_rte', 'titulo_relatorio', 
        'data_inicio_servico', 'data_fim_servico', 'data_emissao', 
        'objetivo', 'causas_danos', 'conclusao', 
        'elaborado_por', 'checado_por', 'aprovado_por', 
        'tipo_relatorio', 'art', 'descricao', 'cliente_logo_path',
        'cliente_id', 
        'cliente_nome', 'cliente_cnpj', 'responsavel',
        'cliente_endereco', 'cliente_bairro', 'cliente_cidade', 'cliente_estado', 'cliente_cep' 
    ];

    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    
    const sql = `
        INSERT INTO relatorios (${columns.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING id
    `;

    const dataInicioFinal = relatorioData.data_inicio || null;
    const dataFimFinal = relatorioData.data_fim || null;
    const dataEmissaoFinal = relatorioData.data_emissao || null;

    const values = [
        relatorioData.os_numero, relatorioData.numero_rte, relatorioData.titulo_relatorio,
        
        dataInicioFinal,    
        dataFimFinal,      
        dataEmissaoFinal,   
        
        relatorioData.objetivo, relatorioData.causas_danos, relatorioData.conclusao,
        relatorioData.elaborado_por, relatorioData.checado_por, relatorioData.aprovado_por,
        relatorioData.tipoRelatorio, relatorioData.art, relatorioData.descricao, 
        relatorioData.cliente_logo,
        
        relatorioData.cliente_id, 
        
        relatorioData.cliente_nome, relatorioData.cliente_cnpj, relatorioData.responsavel,
        relatorioData.cliente_endereco, relatorioData.cliente_bairro, relatorioData.cliente_cidade, 
        relatorioData.cliente_estado, relatorioData.cliente_cep 
    ];

    const result = await dbInstance.query(sql, values);
    return result.rows[0].id; 
}

// -------------------------------------------------------------------------
// BUSCAR DADOS RELACIONADOS (AGORA COM DADOS FINANCEIROS)
// -------------------------------------------------------------------------
async function buscarDadosRelacionados(relatorioId, dbInstance) {
    const medicoesIsolamentoResult = await dbInstance.query(`SELECT * FROM medicoes_isolamento WHERE relatorio_id = $1`, [relatorioId]);
    const medicoesBatimentoResult = await dbInstance.query(`SELECT * FROM medicoes_batimento WHERE relatorio_id = $1`, [relatorioId]);
    const pecasAtuaisResult = await dbInstance.query(`SELECT * FROM pecas_atuais WHERE relatorio_id = $1`, [relatorioId]);
    const fotosRelatorioResult = await dbInstance.query(`SELECT * FROM fotos_relatorio WHERE relatorio_id = $1`, [relatorioId]);
    
    // 🚨 NOVAS BUSCAS: PEÇAS E SERVIÇOS COTADOS (COM JOIN)
    const pecasCotadasResult = await dbInstance.query(`
        SELECT rp.*, p.nome_peca, p.codigo_fabrica 
        FROM relatorio_pecas rp
        JOIN pecas p ON rp.peca_id = p.id
        WHERE rp.relatorio_id = $1
    `, [relatorioId]);
    
    const servicosCotadosResult = await dbInstance.query(`
        SELECT rs.*, s.nome_servico, s.descricao AS servico_descricao 
        FROM relatorio_servicos rs
        JOIN servicos s ON rs.servico_id = s.id
        WHERE rs.relatorio_id = $1
    `, [relatorioId]);


    return {
        medicoesIsolamento: medicoesIsolamentoResult.rows,
        medicoesBatimento: medicoesBatimentoResult.rows,
        pecasAtuais: pecasAtuaisResult.rows,
        fotosRelatorio: fotosRelatorioResult.rows,
        // 🚨 NOVOS RETORNOS PARA A INTERFACE FINANCEIRA
        pecasCotadas: pecasCotadasResult.rows,
        servicosCotados: servicosCotadosResult.rows
    };
}

// -------------------------------------------------------------------------
// FUNÇÕES AUXILIARES (mantidas)
// -------------------------------------------------------------------------
async function salvarMedicaoIsolamento(relatorioId, medicoes, dbInstance) {
    if (!medicoes || medicoes.length === 0) return;

    for (const medicao of medicoes) {
        if (medicao.descricao && medicao.valor && medicao.unidade) {
            await dbInstance.query(
                `INSERT INTO medicoes_isolamento (relatorio_id, descricao, valor, unidade) VALUES ($1, $2, $3, $4)`,
                [relatorioId, medicao.descricao, medicao.valor, medicao.unidade]
            );
        }
    }
}

async function salvarMedicaoBatimento(relatorioId, medicoes, dbInstance) {
    if (!medicoes || medicoes.length === 0) return;

    for (const medicao of medicoes) {
        if (medicao.descricao && medicao.unidade) {
            const valorConvertido = parseFloat(medicao.valor.replace(',', '.'));
            const valorFinal = isNaN(valorConvertido) ? null : valorConvertido;
            const toleranciaFinal = (medicao.tolerancia === 'null' || !medicao.tolerancia) ? 'N/A' : medicao.tolerancia;

            await dbInstance.query(
                `INSERT INTO medicoes_batimento (relatorio_id, descricao, valor, unidade, tolerancia) VALUES ($1, $2, $3, $4, $5)`,
                [relatorioId, medicao.descricao, valorFinal, medicao.unidade, toleranciaFinal]
            );
        }
    }
}

async function salvarPecasAtuais(relatorioId, pecas, dbInstance) {
    if (!pecas || pecas.length === 0) return;

    for (const peca of pecas) {
        const descricaoPeca = (typeof peca === 'string') ? peca : peca.descricao;
        const observacaoPeca = (typeof peca === 'string') ? '' : (peca.observacao || '');

        await dbInstance.query(
            `INSERT INTO pecas_atuais (relatorio_id, descricao, observacao) VALUES ($1, $2, $3)`,
            [relatorioId, descricaoPeca, observacaoPeca]
        );
    }
}

async function salvarCaminhosFotos(fotosData, dbInstance) {
    if (!fotosData || fotosData.length === 0) return;

    const sql = `
        INSERT INTO fotos_relatorio (relatorio_id, caminho_foto, legenda, secao)
        VALUES ($1, $2, $3, $4)
    `;

    for (const foto of fotosData) {
        await dbInstance.query(sql, [foto.relatorioId, foto.caminho_foto, foto.legenda, foto.secao]);
    }
}

async function buscarRelatorioPorId(id, dbInstance) {
    const result = await dbInstance.query('SELECT r.* FROM relatorios r WHERE r.id = $1', [id]);
    return result.rows[0];
}


// -------------------------------------------------------------------------
// BUSCA AVANÇADA COM PAGINAÇÃO E JOIN DE CLIENTES (mantida)
// -------------------------------------------------------------------------
async function buscarRelatoriosAvancado(query, page, limit) {
    const searchTerm = `%${query.toLowerCase()}%`;
    const offset = (page - 1) * limit;

    const sql = `
        SELECT 
            r.id, 
            r.os_numero, 
            r.numero_rte,
            r.titulo_relatorio, 
            r.data_emissao,
            COALESCE(c.nome_fantasia, r.cliente_nome) as cliente_nome_final,
            r.tipo_relatorio
        FROM 
            relatorios r
        LEFT JOIN 
            clientes c ON r.cliente_id = c.id
        WHERE 
            LOWER(r.os_numero) LIKE $1 OR 
            LOWER(r.titulo_relatorio) LIKE $1 OR
            LOWER(COALESCE(c.nome_fantasia, r.cliente_nome)) LIKE $1 OR
            LOWER(r.cliente_cnpj) LIKE $1
        ORDER BY 
            r.data_emissao DESC, r.id DESC
        LIMIT $2 OFFSET $3;
    `;

    const countSql = `
        SELECT 
            COUNT(r.id) 
        FROM 
            relatorios r
        LEFT JOIN 
            clientes c ON r.cliente_id = c.id
        WHERE 
            LOWER(r.os_numero) LIKE $1 OR 
            LOWER(r.titulo_relatorio) LIKE $1 OR
            LOWER(COALESCE(c.nome_fantasia, r.cliente_nome)) LIKE $1 OR
            LOWER(r.cliente_cnpj) LIKE $1;
    `;

    const resultsPromise = pool.query(sql, [searchTerm, limit, offset]);
    const countPromise = pool.query(countSql, [searchTerm]);

    const [results, countResult] = await Promise.all([resultsPromise, countPromise]);
    const totalItems = parseInt(countResult.rows[0].count, 10);

    return {
        relatorios: results.rows,
        total: totalItems,
        page: page,
        lastPage: Math.ceil(totalItems / limit)
    };
}

async function salvarRelatorioPecas(relatorioId, pecasCotadas, dbInstance) {
    if (!pecasCotadas || pecasCotadas.length === 0) return;

    const sql = `
        INSERT INTO relatorio_pecas (relatorio_id, peca_id, quantidade, valor_cobrado)
        VALUES ($1, $2, $3, $4)
    `;

    for (const peca of pecasCotadas) {
        // Assegura que valor_cobrado é um número decimal
        const valorNumerico = parseFloat(String(peca.valor_cobrado).replace(',', '.'));
        const quantidadeNumerica = parseFloat(String(peca.quantidade).replace(',', '.'));

        if (!isNaN(valorNumerico) && !isNaN(quantidadeNumerica) && peca.peca_id) {
            await dbInstance.query(sql, [relatorioId, peca.peca_id, quantidadeNumerica, valorNumerico]);
        }
    }
}

async function salvarRelatorioServicos(relatorioId, servicosCotados, dbInstance) {
    if (!servicosCotados || servicosCotados.length === 0) return;

    const sql = `
        INSERT INTO relatorio_servicos (relatorio_id, servico_id, quantidade, valor_cobrado)
        VALUES ($1, $2, $3, $4)
    `;

    for (const servico of servicosCotados) {
        const valorNumerico = parseFloat(String(servico.valor_cobrado).replace(',', '.'));
        const quantidadeNumerica = parseFloat(String(servico.quantidade).replace(',', '.'));

        if (!isNaN(valorNumerico) && !isNaN(quantidadeNumerica) && servico.servico_id) {
            await dbInstance.query(sql, [relatorioId, servico.servico_id, quantidadeNumerica, valorNumerico]);
        }
    }
}
// DADOS REAIS DO FINANCEIRO - COMPLETO (2025)
// -------------------------------------------------------------------------

// 1. Total pendente (relatórios com status diferente de 'concluido')
async function getTotalPendente() {
    const query = `
        SELECT COALESCE(SUM(
            COALESCE(rp.quantidade, 0) * COALESCE(rp.valor_cobrado, 0) +
            COALESCE(rs.quantidade, 0) * COALESCE(rs.valor_cobrado, 0)
        ), 0) AS total
        FROM relatorios r
        LEFT JOIN relatorio_pecas rp ON r.id = rp.relatorio_id
        LEFT JOIN relatorio_servicos rs ON r.id = rs.relatorio_id
        WHERE r.status != 'concluido' OR r.status IS NULL
    `;
    const result = await pool.query(query);
    return parseFloat(result.rows[0].total) || 0;
}

// 2. Total concluído no mês atual (CORRIGIDO: usa data_fim_servico)
async function getTotalConcluidoMesAtual() {
    const query = `
        SELECT COALESCE(SUM(
            COALESCE(rp.quantidade, 0) * COALESCE(rp.valor_cobrado, 0) +
            COALESCE(rs.quantidade, 0) * COALESCE(rs.valor_cobrado, 0)
        ), 0) AS total
        FROM relatorios r
        LEFT JOIN relatorio_pecas rp ON r.id = rp.relatorio_id
        LEFT JOIN relatorio_servicos rs ON r.id = rs.relatorio_id
        WHERE r.status = 'concluido'
          AND r.data_fim_servico IS NOT NULL
          AND EXTRACT(YEAR FROM r.data_fim_servico) = EXTRACT(YEAR FROM CURRENT_DATE)
          AND EXTRACT(MONTH FROM r.data_fim_servico) = EXTRACT(MONTH FROM CURRENT_DATE)
    `;
    const result = await pool.query(query);
    return parseFloat(result.rows[0].total) || 0;
}

// 3. Total faturado no mês atual (SÓ OS QUE TÊM NF EMITIDA)
async function getTotalFaturadoMesAtual() {
    const query = `
        SELECT COALESCE(SUM(
            COALESCE(rp.quantidade, 0) * COALESCE(rp.valor_cobrado, 0) +
            COALESCE(rs.quantidade, 0) * COALESCE(rs.valor_cobrado, 0)
        ), 0) AS total
        FROM relatorios r
        LEFT JOIN relatorio_pecas rp ON r.id = rp.relatorio_id
        LEFT JOIN relatorio_servicos rs ON r.id = rs.relatorio_id
        WHERE r.status = 'concluido'
          AND r.nf_emitida = true
          AND r.data_fim_servico IS NOT NULL
          AND EXTRACT(YEAR FROM r.data_fim_servico) = EXTRACT(YEAR FROM CURRENT_DATE)
          AND EXTRACT(MONTH FROM r.data_fim_servico) = EXTRACT(MONTH FROM CURRENT_DATE)
    `;
    const result = await pool.query(query);
    return parseFloat(result.rows[0].total) || 0;
}

// 4. Evolução mensal (AGORA FUNCIONA NO GRÁFICO!)
async function getEvolucaoMensal() {
    const query = `
        SELECT 
            TO_CHAR(r.data_fim_servico, 'Mon') AS mes,
            EXTRACT(YEAR FROM r.data_fim_servico) AS ano,
            COALESCE(SUM(
                COALESCE(rp.quantidade, 0) * COALESCE(rp.valor_cobrado, 0) +
                COALESCE(rs.quantidade, 0) * COALESCE(rs.valor_cobrado, 0)
            ), 0) AS valor
        FROM relatorios r
        LEFT JOIN relatorio_pecas rp ON r.id = rp.relatorio_id
        LEFT JOIN relatorio_servicos rs ON r.id = rs.relatorio_id
        WHERE r.status = 'concluido'
          AND r.data_fim_servico IS NOT NULL
          AND r.data_fim_servico >= CURRENT_DATE - INTERVAL '11 months'
        GROUP BY TO_CHAR(r.data_fim_servico, 'Mon'), EXTRACT(YEAR FROM r.data_fim_servico), EXTRACT(MONTH FROM r.data_fim_servico)
        ORDER BY ano, EXTRACT(MONTH FROM r.data_fim_servico)
        LIMIT 12
    `;
    const result = await pool.query(query);

    // Formato que o Recharts entende: ['Jan', 'Fev', 'Mar', ...]
    const mesesOrdenados = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return result.rows.map(row => ({
        mes: row.mes,  // Já vem como "Jan", "Fev", etc
        valor: parseFloat(row.valor) || 0
    }));
}

// 5. Contadores (O.S. em aberto, finalizadas, NFs emitidas)
async function getContadores() {
    const query = `
        SELECT 
            COUNT(CASE WHEN r.status != 'concluido' THEN 1 END) AS os_abertas,
            COUNT(CASE WHEN r.status = 'concluido' THEN 1 END) AS finalizadas,
            COUNT(CASE WHEN r.nf_emitida = true THEN 1 END) AS nf_emitidas
        FROM relatorios r
    `;
    const result = await pool.query(query);
    return {
        osAbertas: parseInt(result.rows[0].os_abertas) || 0,
        finalizadas: parseInt(result.rows[0].finalizadas) || 0,
        nfEmitidas: parseInt(result.rows[0].nf_emitidas) || 0
    };
}

// -------------------------------------------------------------------------
// TOTAL ACUMULADO DO ANO
// -------------------------------------------------------------------------
async function getTotalFaturadoPorAno(ano) {
    const query = `
        SELECT COALESCE(SUM(
            COALESCE(rp.quantidade, 0) * COALESCE(rp.valor_cobrado, 0) +
            COALESCE(rs.quantidade, 0) * COALESCE(rs.valor_cobrado, 0)
        ), 0) AS total
        FROM relatorios r
        LEFT JOIN relatorio_pecas rp ON r.id = rp.relatorio_id
        LEFT JOIN relatorio_servicos rs ON r.id = rs.relatorio_id
        WHERE r.status = 'concluido'
          AND EXTRACT(YEAR FROM r.data_emissao) = $1
    `;
    try {
        const result = await pool.query(query, [ano]);
        return parseFloat(result.rows[0].total) || 0;
    } catch (error) {
        console.error('Erro ao calcular total do ano:', error);
        return 0;
    }
}

// -------------------------------------------------------------------------
// 🛑 NOVAS FUNÇÕES: DADOS FINANCEIROS DO MÊS ANTERIOR
// -------------------------------------------------------------------------

// 6. Total pendente do mês anterior (para variação)
async function getTotalPendenteMesAnterior() {
    const query = `
        SELECT COALESCE(SUM(
            COALESCE(rp.quantidade, 0) * COALESCE(rp.valor_cobrado, 0) +
            COALESCE(rs.quantidade, 0) * COALESCE(rs.valor_cobrado, 0)
        ), 0) AS total
        FROM relatorios r
        LEFT JOIN relatorio_pecas rp ON r.id = rp.relatorio_id
        LEFT JOIN relatorio_servicos rs ON r.id = rs.relatorio_id
        WHERE r.status != 'concluido' OR r.status IS NULL
        -- Filtra por relatórios iniciados no mês anterior
        AND EXTRACT(YEAR FROM r.data_inicio_servico) = EXTRACT(YEAR FROM (CURRENT_DATE - INTERVAL '1 month'))
        AND EXTRACT(MONTH FROM r.data_inicio_servico) = EXTRACT(MONTH FROM (CURRENT_DATE - INTERVAL '1 month'))
    `;
    const result = await pool.query(query);
    return parseFloat(result.rows[0].total) || 0;
}

// 7. Total concluído no mês anterior (para variação)
async function getTotalConcluidoMesAnterior() {
    const query = `
        SELECT COALESCE(SUM(
            COALESCE(rp.quantidade, 0) * COALESCE(rp.valor_cobrado, 0) +
            COALESCE(rs.quantidade, 0) * COALESCE(rs.valor_cobrado, 0)
        ), 0) AS total
        FROM relatorios r
        LEFT JOIN relatorio_pecas rp ON r.id = rp.relatorio_id
        LEFT JOIN relatorio_servicos rs ON r.id = rs.relatorio_id
        WHERE r.status = 'concluido'
          AND r.data_fim_servico IS NOT NULL
          AND EXTRACT(YEAR FROM r.data_fim_servico) = EXTRACT(YEAR FROM (CURRENT_DATE - INTERVAL '1 month'))
          AND EXTRACT(MONTH FROM r.data_fim_servico) = EXTRACT(MONTH FROM (CURRENT_DATE - INTERVAL '1 month'))
    `;
    const result = await pool.query(query);
    return parseFloat(result.rows[0].total) || 0;
}

// 8. Total faturado no mês anterior (para variação)
async function getTotalFaturadoMesAnterior() {
    const query = `
        SELECT COALESCE(SUM(
            COALESCE(rp.quantidade, 0) * COALESCE(rp.valor_cobrado, 0) +
            COALESCE(rs.quantidade, 0) * COALESCE(rs.valor_cobrado, 0)
        ), 0) AS total
        FROM relatorios r
        LEFT JOIN relatorio_pecas rp ON r.id = rp.relatorio_id
        LEFT JOIN relatorio_servicos rs ON r.id = rs.relatorio_id
        WHERE r.status = 'concluido'
          AND r.nf_emitida = true
          AND r.data_fim_servico IS NOT NULL
          AND EXTRACT(YEAR FROM r.data_fim_servico) = EXTRACT(YEAR FROM (CURRENT_DATE - INTERVAL '1 month'))
          AND EXTRACT(MONTH FROM r.data_fim_servico) = EXTRACT(MONTH FROM (CURRENT_DATE - INTERVAL '1 month'))
    `;
    const result = await pool.query(query);
    return parseFloat(result.rows[0].total) || 0;
}


// O 'module.exports' final, incluindo a nova função de busca.
export default {
    salvarRelatorio,
    salvarMedicaoIsolamento,
    salvarMedicaoBatimento,
    salvarPecasAtuais,
    salvarCaminhosFotos,
    buscarRelatorioPorId,
    buscarDadosRelacionados,
    executarTransacao,
    buscarRelatoriosAvancado,
    salvarRelatorioPecas, 
    salvarRelatorioServicos,
    getTotalFaturadoPorAno,
    getTotalPendente,
    getTotalConcluidoMesAtual,
    getTotalFaturadoMesAtual,
    getEvolucaoMensal,
    getContadores,
    getTotalPendenteMesAnterior, 
    getTotalConcluidoMesAnterior,
    getTotalFaturadoMesAnterior
};