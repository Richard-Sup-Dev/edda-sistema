// backend/sql/run-indexes.js
// Script para executar os índices no banco de dados

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import pg from 'pg';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'edda_db',
  user: process.env.DB_USER || 'edda_user',
  password: process.env.DB_PASSWORD || 'edda_password'
});

async function runIndexes() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Iniciando criação de índices...\n');
    
    const sql = readFileSync(join(__dirname, 'add-indexes.sql'), 'utf-8');
    
    // Executar comandos SQL
    await client.query(sql);
    
    console.log('✅ Índices criados com sucesso!\n');
    
    // Executar ANALYZE para atualizar estatísticas
    console.log('📊 Atualizando estatísticas do banco...\n');
    
    const tables = [
      'clientes',
      'relatorios',
      'usuarios',
      'nfs',
      'atividades',
      'pecas',
      'servicos',
      'notificacoes'
    ];
    
    for (const table of tables) {
      try {
        await client.query(`ANALYZE ${table}`);
        console.log(`✅ ${table} analisado`);
      } catch (err) {
        console.log(`⚠️  ${table} não existe ainda: ${err.message}`);
      }
    }
    
    console.log('\n🎉 Processo concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar índices:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runIndexes().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
