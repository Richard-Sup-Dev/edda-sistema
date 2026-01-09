// setup-test-db.js
// Script para configurar banco de dados de testes
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente de teste
dotenv.config({ path: path.join(__dirname, '.env.test') });

const { Pool } = pg;

async function setupDatabase() {
  console.log('🔧 Iniciando setup do banco de dados de testes...\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test connection
    console.log('📡 Conectando ao banco Neon...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Execute schema
    console.log('📋 Criando tabelas (schema-test.sql)...');
    const schemaPath = path.join(__dirname, 'sql', 'schema-test.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('✅ Tabelas criadas com sucesso!\n');

    // Execute seed
    console.log('🌱 Inserindo dados de teste (seed-test.sql)...');
    const seedPath = path.join(__dirname, 'sql', 'seed-test.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');
    await pool.query(seed);
    console.log('✅ Dados de teste inseridos com sucesso!\n');

    // Verify
    console.log('🔍 Verificando tabelas criadas:');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    result.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

    console.log(`\n📊 Total de ${result.rows.length} tabelas criadas\n`);

    // Count records
    console.log('📈 Contagem de registros:');
    const counts = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM usuarios) as usuarios,
        (SELECT COUNT(*) FROM clientes) as clientes,
        (SELECT COUNT(*) FROM pecas) as pecas,
        (SELECT COUNT(*) FROM servicos) as servicos,
        (SELECT COUNT(*) FROM relatorios) as relatorios
    `);
    
    console.log(`  • Usuários: ${counts.rows[0].usuarios}`);
    console.log(`  • Clientes: ${counts.rows[0].clientes}`);
    console.log(`  • Peças: ${counts.rows[0].pecas}`);
    console.log(`  • Serviços: ${counts.rows[0].servicos}`);
    console.log(`  • Relatórios: ${counts.rows[0].relatorios}`);

    console.log('\n✅ Setup do banco de dados concluído com sucesso!');
    console.log('🚀 Pronto para executar os testes!\n');

  } catch (error) {
    console.error('\n❌ Erro ao configurar banco de dados:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Executa
setupDatabase();
