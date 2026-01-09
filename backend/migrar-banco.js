// Script de migração completa - Adicionar campos faltantes
import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrar() {
  console.log('🚀 INICIANDO MIGRAÇÃO COMPLETA...\n');

  try {
    // 1. Adicionar criador_id à tabela relatorios
    console.log('📝 Adicionando coluna criador_id à tabela relatorios...');
    await pool.query(`
      ALTER TABLE relatorios 
      ADD COLUMN IF NOT EXISTS criador_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL;
    `);
    console.log('✅ Coluna criador_id adicionada!\n');

    // 2. Pegar ID do primeiro admin
    const adminResult = await pool.query(`
      SELECT id FROM usuarios WHERE role = 'admin' LIMIT 1;
    `);
    
    if (adminResult.rows.length > 0) {
      const adminId = adminResult.rows[0].id;
      console.log(`📌 Admin encontrado: ID ${adminId}`);
      
      // 3. Popular criador_id nos relatórios existentes
      console.log('📝 Populando criador_id nos relatórios existentes...');
      await pool.query(`
        UPDATE relatorios 
        SET criador_id = $1 
        WHERE criador_id IS NULL;
      `, [adminId]);
      console.log('✅ Relatórios atualizados!\n');
    }

    // 4. Adicionar campos faltantes na tabela usuarios se necessário
    console.log('📝 Verificando campos na tabela usuarios...');
    await pool.query(`
      ALTER TABLE usuarios 
      ADD COLUMN IF NOT EXISTS telefone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS cargo VARCHAR(100),
      ADD COLUMN IF NOT EXISTS departamento VARCHAR(100),
      ADD COLUMN IF NOT EXISTS avatar VARCHAR(255),
      ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMP WITH TIME ZONE;
    `);
    console.log('✅ Campos adicionados à tabela usuarios!\n');

    // 5. Criar índices para melhor performance
    console.log('📝 Criando índices...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_relatorios_criador_id ON relatorios(criador_id);
      CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario_id ON notificacoes(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_atividades_usuario_id ON atividades(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
      CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);
    `);
    console.log('✅ Índices criados!\n');

    // 6. Verificar estrutura final
    console.log('🔍 VERIFICAÇÃO FINAL:');
    const verificacao = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'relatorios' AND column_name IN ('criador_id')
      UNION
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' AND column_name IN ('telefone', 'cargo', 'departamento', 'avatar');
    `);
    
    verificacao.rows.forEach(col => {
      console.log(`  ✅ ${col.column_name} (${col.data_type})`);
    });

    console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');

  } catch (error) {
    console.error('❌ ERRO NA MIGRAÇÃO:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

migrar();
