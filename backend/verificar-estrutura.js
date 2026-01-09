// Script para verificar estrutura completa do banco
import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificarEstrutura() {
  console.log('🔍 VERIFICANDO ESTRUTURA DO BANCO...\n');

  try {
    // 1. Verificar tabelas existentes
    const tabelasResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📊 TABELAS EXISTENTES:');
    tabelasResult.rows.forEach(row => console.log(`  ✓ ${row.table_name}`));
    console.log('');

    // 2. Verificar colunas da tabela relatorios
    const colunasRelatorios = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'relatorios'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 COLUNAS DA TABELA RELATORIOS:');
    colunasRelatorios.rows.forEach(col => {
      console.log(`  ✓ ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    console.log('');

    // 3. Verificar se existe criador_id
    const temCriadorId = colunasRelatorios.rows.some(col => col.column_name === 'criador_id');
    console.log(`🔑 Coluna criador_id: ${temCriadorId ? '✅ EXISTE' : '❌ NÃO EXISTE'}\n`);

    // 4. Verificar tabelas de notificacoes e atividades
    const tabelasEspeciais = ['notificacoes', 'atividades', 'usuarios'];
    for (const tabela of tabelasEspeciais) {
      const exists = tabelasResult.rows.some(row => row.table_name === tabela);
      console.log(`📌 Tabela ${tabela}: ${exists ? '✅ EXISTE' : '❌ NÃO EXISTE'}`);
      
      if (exists) {
        const colunas = await pool.query(`
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position;
        `, [tabela]);
        
        console.log(`   Colunas: ${colunas.rows.map(c => c.column_name).join(', ')}`);
      }
    }

  } catch (error) {
    console.error('❌ ERRO:', error.message);
  } finally {
    await pool.end();
  }
}

verificarEstrutura();
