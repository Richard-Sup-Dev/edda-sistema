// scripts/setup-test-db.js
// Script para configurar o banco de dados de testes no Neon
import pg from 'pg';
const { Client } = pg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupTestDatabase() {
  console.log('🔧 Configurando banco de dados de testes...\n');

  // Verifica se a DATABASE_URL está configurada
  const databaseUrl = process.env.DATABASE_URL || process.env.TEST_DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL não está configurada!');
    console.log('\n📝 Configure a variável de ambiente:');
    console.log('   export DATABASE_URL="postgresql://usuario:senha@host/database"');
    console.log('   ou adicione no arquivo .env.test');
    process.exit(1);
  }

  console.log('📊 Conectando ao banco de dados...');
  console.log(`   URL: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}\n`);

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

    // Lê o arquivo SQL de schema
    const schemaPath = path.join(__dirname, '../sql/schema-test.sql');
    console.log('📄 Carregando schema de:', schemaPath);
    
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    
    console.log('🗄️  Executando SQL...\n');
    
    // Executa o schema
    await client.query(schemaSql);
    
    console.log('✅ Tabelas criadas com sucesso!');
    console.log('✅ Índices criados com sucesso!');
    console.log('✅ Dados iniciais inseridos!\n');
    
    // Lista as tabelas criadas
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('📋 Tabelas criadas:');
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    
    console.log('\n🎉 Banco de dados de testes configurado com sucesso!');
    console.log('\n▶️  Agora você pode executar os testes:');
    console.log('   npm test');
    console.log('   npm test -- --coverage\n');
    
  } catch (error) {
    console.error('\n❌ Erro ao configurar banco de dados:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Dica: Verifique se:');
      console.log('   - O banco de dados está rodando');
      console.log('   - As credenciais estão corretas');
      console.log('   - A URL de conexão está correta');
    }
    
    if (error.code === '42P01') {
      console.log('\n💡 Dica: Erro de tabela não encontrada.');
      console.log('   Execute o script novamente para criar as tabelas.');
    }
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Executa o setup
setupTestDatabase().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
