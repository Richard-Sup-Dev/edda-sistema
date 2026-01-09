import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon') ? { rejectUnauthorized: false } : false
});

async function criarTabelas() {
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');

    // Verificar se tabelas existem
    const checkNotificacoes = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'notificacoes'
      );
    `);

    const checkAtividades = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'atividades'
      );
    `);

    if (!checkNotificacoes.rows[0].exists) {
      console.log('📝 Criando tabela notificacoes...');
      const sqlNotificacoes = readFileSync(join(__dirname, 'sql', 'notificacoes.sql'), 'utf8');
      await client.query(sqlNotificacoes);
      console.log('✅ Tabela notificacoes criada com sucesso!');
    } else {
      console.log('✅ Tabela notificacoes já existe');
    }

    if (!checkAtividades.rows[0].exists) {
      console.log('📝 Criando tabela atividades...');
      const sqlAtividades = readFileSync(join(__dirname, 'sql', 'atividades.sql'), 'utf8');
      await client.query(sqlAtividades);
      console.log('✅ Tabela atividades criada com sucesso!');
    } else {
      console.log('✅ Tabela atividades já existe');
    }

    console.log('\n🎉 Todas as tabelas estão prontas!');
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

criarTabelas();
