// scripts/check-tables.js
// Script para verificar as tabelas criadas no banco de dados
import pg from 'pg';
const { Client } = pg;
import 'dotenv/config';

async function checkTables() {
  const databaseUrl = process.env.DATABASE_URL || process.env.TEST_DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL não configurada!');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados!\n');

    // Lista todas as tabelas
    const tablesResult = await client.query(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns 
         WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('📊 Tabelas no banco de dados:\n');
    console.log('┌─────────────────────────────┬──────────┐');
    console.log('│ Tabela                      │ Colunas  │');
    console.log('├─────────────────────────────┼──────────┤');
    
    tablesResult.rows.forEach(row => {
      const tableName = row.table_name.padEnd(27);
      const columnCount = String(row.column_count).padStart(6);
      console.log(`│ ${tableName} │ ${columnCount}   │`);
    });
    
    console.log('└─────────────────────────────┴──────────┘');
    console.log(`\n📋 Total: ${tablesResult.rows.length} tabelas\n`);

    // Verifica dados de teste
    console.log('🔍 Verificando dados de teste:\n');

    const checks = [
      { table: 'users', query: 'SELECT COUNT(*) as count FROM users' },
      { table: 'clientes', query: 'SELECT COUNT(*) as count FROM clientes' },
      { table: 'pecas', query: 'SELECT COUNT(*) as count FROM pecas' },
      { table: 'servicos', query: 'SELECT COUNT(*) as count FROM servicos' },
      { table: 'usuarios', query: 'SELECT COUNT(*) as count FROM usuarios' },
      { table: 'nf_emitente', query: 'SELECT COUNT(*) as count FROM nf_emitente' }
    ];

    for (const check of checks) {
      try {
        const result = await client.query(check.query);
        const count = result.rows[0].count;
        const icon = count > 0 ? '✅' : '⚠️';
        console.log(`${icon} ${check.table}: ${count} registro(s)`);
      } catch (error) {
        console.log(`❌ ${check.table}: Erro ao verificar`);
      }
    }

    console.log('\n✨ Verificação concluída!\n');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkTables().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
