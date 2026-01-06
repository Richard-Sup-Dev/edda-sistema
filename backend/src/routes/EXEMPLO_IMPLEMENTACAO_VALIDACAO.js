// backend/src/routes/EXEMPLO_IMPLEMENTACAO_VALIDACAO.js
// ============================================
// EXEMPLO DE COMO USAR VALIDAÇÕES NAS ROTAS
// ============================================
// Copie este padrão para suas rotas!

import express from 'express';
import { validarDados, clienteSchema, relatorioSchema, pecaSchema } from '../middlewares/validationMiddleware.js';
import { authMiddleware } from '../middlewares/auth.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// ============================================
// EXEMPLO 1: Criar Cliente com Validação
// ============================================
router.post('/clientes', 
  authMiddleware,                          // Verificar se está autenticado
  roleMiddleware(['admin']),               // Verificar se é admin
  validarDados(clienteSchema),             // ← ADICIONE VALIDAÇÃO AQUI
  async (req, res) => {
    // req.body já vem validado e sanitizado
    const { cnpj, nome_fantasia, email, telefone } = req.body;
    
    try {
      // Criar cliente no banco
      // const novoCliente = await Cliente.create({ cnpj, nome_fantasia, email, telefone });
      // return res.status(201).json(novoCliente);
      
      res.json({ mensagem: 'Cliente criado com sucesso!' });
    } catch (error) {
      // O error handler global cuida disto
      throw error;
    }
  }
);

// ============================================
// EXEMPLO 2: Criar Relatório com Validação
// ============================================
router.post('/relatorios', 
  authMiddleware,
  roleMiddleware(['admin', 'tecnico']),
  validarDados(relatorioSchema),           // ← ADICIONE VALIDAÇÃO AQUI
  async (req, res) => {
    // req.body já vem validado
    const { cliente_id, os_numero, data_inicio, data_fim, descricao_servico } = req.body;
    
    try {
      // Criar relatório
      // const novoRelatorio = await Relatorio.create({ ... });
      // return res.status(201).json(novoRelatorio);
      
      res.json({ mensagem: 'Relatório criado com sucesso!' });
    } catch (error) {
      throw error;
    }
  }
);

// ============================================
// EXEMPLO 3: Criar Peça com Validação
// ============================================
router.post('/pecas', 
  authMiddleware,
  roleMiddleware(['admin']),
  validarDados(pecaSchema),                 // ← ADICIONE VALIDAÇÃO AQUI
  async (req, res) => {
    const { codigo_fabrica, descricao, categoria, valor_unitario } = req.body;
    
    try {
      // Criar peça
      res.json({ mensagem: 'Peça criada com sucesso!' });
    } catch (error) {
      throw error;
    }
  }
);

// ============================================
// TESTE DE VALIDAÇÃO - EXEMPLOS DE REQUISIÇÕES
// ============================================

/*

# TESTE 1: CRIAR CLIENTE COM CNPJ VÁLIDO ✅
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "cnpj": "11222333000181",
    "nome_fantasia": "Empresa Exemplo LTDA",
    "email": "contato@empresa.com",
    "telefone": "1122334455"
  }'

# TESTE 2: CRIAR CLIENTE COM CNPJ INVÁLIDO ❌
# Esperado: Erro 400 - "CNPJ inválido"
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "cnpj": "00000000000000",
    "nome_fantasia": "Teste",
    "email": "teste@empresa.com"
  }'

# TESTE 3: CRIAR CLIENTE COM EMAIL INVÁLIDO ❌
# Esperado: Erro 400 - "Email inválido"
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "cnpj": "11222333000181",
    "nome_fantasia": "Teste",
    "email": "email-invalido"
  }'

# TESTE 4: CRIAR RELATÓRIO COM DATAS INVÁLIDAS ❌
# Esperado: Erro 400 - "Data de fim não pode ser anterior à data de início"
curl -X POST http://localhost:3001/api/relatorios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "cliente_id": 1,
    "os_numero": "OS-001",
    "data_inicio": "2026-01-10",
    "data_fim": "2026-01-05",
    "descricao_servico": "Descrição do serviço que precisa ter pelo menos 10 caracteres"
  }'

# TESTE 5: CRIAR PEÇA COM VALOR NEGATIVO ❌
# Esperado: Erro 400 - "Valor unitário deve ser positivo"
curl -X POST http://localhost:3001/api/pecas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "codigo_fabrica": "PECA-001",
    "descricao": "Descrição da peça",
    "categoria": "Eletrônico",
    "valor_unitario": -100
  }'

*/

export default router;
