// backend/TESTES_VALIDACAO.md
# 🧪 GUIA DE TESTES - VALIDAÇÕES IMPLEMENTADAS

## Como Testar as Validações

### Pré-requisitos
- Backend rodando: `npm start`
- Token JWT válido (fazer login primeiro)

---

## 1️⃣ TESTE: Validação de CNPJ

### ✅ CNPJ Válido - Deve Aceitar
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "cnpj": "11222333000181",
    "nome_fantasia": "Empresa XYZ LTDA",
    "email": "contato@empresa.com"
  }'
```

**Resposta esperada**: ✅ 201 - Cliente criado

---

### ❌ CNPJ Inválido (todos zeros) - Deve Rejeitar
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "cnpj": "00000000000000",
    "nome_fantasia": "Teste",
    "email": "teste@empresa.com"
  }'
```

**Resposta esperada**: ❌ 400
```json
{
  "erro": "Erro na validação dos dados",
  "detalhes": [
    {
      "campo": "cnpj",
      "mensagem": "\"cnpj\" failed custom validation because CNPJ inválido"
    }
  ]
}
```

---

### ❌ CNPJ Inválido (dígito verificador errado) - Deve Rejeitar
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "11222333000182",
    "nome_fantasia": "Teste",
    "email": "teste@empresa.com"
  }'
```

**Resposta esperada**: ❌ 400 - CNPJ inválido

---

## 2️⃣ TESTE: Validação de Email

### ✅ Email Válido - Deve Aceitar
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "11222333000181",
    "nome_fantasia": "Empresa",
    "email": "contato@empresa.com"
  }'
```

**Resposta**: ✅ Aceita

---

### ❌ Email Inválido - Deve Rejeitar
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "11222333000181",
    "nome_fantasia": "Empresa",
    "email": "email-sem-arroba.com"
  }'
```

**Resposta esperada**: ❌ 400
```json
{
  "erro": "Erro na validação dos dados",
  "detalhes": [
    {
      "campo": "email",
      "mensagem": "\"email\" must be a valid email"
    }
  ]
}
```

---

## 3️⃣ TESTE: Validação de Nome

### ❌ Nome muito curto - Deve Rejeitar
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "11222333000181",
    "nome_fantasia": "AB",
    "email": "contato@empresa.com"
  }'
```

**Resposta esperada**: ❌ 400
```json
{
  "erro": "Erro na validação dos dados",
  "detalhes": [
    {
      "campo": "nome_fantasia",
      "mensagem": "\"nome_fantasia\" length must be at least 3 characters long"
    }
  ]
}
```

---

## 4️⃣ TESTE: Validação de Relatório

### ✅ Relatório Válido
```bash
curl -X POST http://localhost:3001/api/relatorios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "cliente_id": 1,
    "os_numero": "OS-2026-001",
    "data_inicio": "2026-01-10",
    "data_fim": "2026-01-15",
    "descricao_servico": "Serviço de manutenção preventiva com inspeção completa"
  }'
```

**Resposta**: ✅ 201 - Relatório criado

---

### ❌ Descrição Muito Curta
```bash
curl -X POST http://localhost:3001/api/relatorios \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": 1,
    "os_numero": "OS-001",
    "data_inicio": "2026-01-10",
    "data_fim": "2026-01-15",
    "descricao_servico": "Curta"
  }'
```

**Resposta esperada**: ❌ 400
```json
{
  "erro": "Erro na validação dos dados",
  "detalhes": [
    {
      "campo": "descricao_servico",
      "mensagem": "\"descricao_servico\" length must be at least 10 characters long"
    }
  ]
}
```

---

### ❌ Data Final Anterior à Data Inicial
```bash
curl -X POST http://localhost:3001/api/relatorios \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": 1,
    "os_numero": "OS-001",
    "data_inicio": "2026-01-20",
    "data_fim": "2026-01-10",
    "descricao_servico": "Descrição válida com mais de 10 caracteres"
  }'
```

**Resposta esperada**: ❌ 400
```json
{
  "erro": "Erro na validação dos dados",
  "detalhes": [
    {
      "campo": "data_fim",
      "mensagem": "\"data_fim\" must be greater than or equal to ref:data_inicio"
    }
  ]
}
```

---

## 5️⃣ TESTE: Validação de Peça

### ✅ Peça Válida
```bash
curl -X POST http://localhost:3001/api/pecas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "codigo_fabrica": "PECA-2026-001",
    "descricao": "Resistência Elétrica 5kW",
    "categoria": "Elétrico",
    "valor_unitario": 150.50
  }'
```

**Resposta**: ✅ 201 - Peça criada

---

### ❌ Valor Negativo
```bash
curl -X POST http://localhost:3001/api/pecas \
  -H "Content-Type: application/json" \
  -d '{
    "codigo_fabrica": "PECA-001",
    "descricao": "Descrição válida",
    "categoria": "Eletrônico",
    "valor_unitario": -100
  }'
```

**Resposta esperada**: ❌ 400
```json
{
  "erro": "Erro na validação dos dados",
  "detalhes": [
    {
      "campo": "valor_unitario",
      "mensagem": "\"valor_unitario\" must be a positive number"
    }
  ]
}
```

---

## 6️⃣ TESTE: Telefone

### ✅ Telefone Válido (10 dígitos)
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "11222333000181",
    "nome_fantasia": "Empresa",
    "email": "contato@empresa.com",
    "telefone": "1122334455"
  }'
```

**Resposta**: ✅ Aceita

---

### ✅ Telefone Válido (11 dígitos com 9)
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "11222333000181",
    "nome_fantasia": "Empresa",
    "email": "contato@empresa.com",
    "telefone": "11999998888"
  }'
```

**Resposta**: ✅ Aceita

---

### ❌ Telefone Inválido (9 dígitos)
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "11222333000181",
    "nome_fantasia": "Empresa",
    "email": "contato@empresa.com",
    "telefone": "112233445"
  }'
```

**Resposta esperada**: ❌ 400
```json
{
  "erro": "Erro na validação dos dados",
  "detalhes": [
    {
      "campo": "telefone",
      "mensagem": "Telefone inválido (use 10 ou 11 dígitos)"
    }
  ]
}
```

---

## 7️⃣ TESTE: Campos Obrigatórios

### ❌ Faltando CNPJ
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome_fantasia": "Empresa",
    "email": "contato@empresa.com"
  }'
```

**Resposta esperada**: ❌ 400
```json
{
  "erro": "Erro na validação dos dados",
  "detalhes": [
    {
      "campo": "cnpj",
      "mensagem": "CNPJ é obrigatório"
    }
  ]
}
```

---

## 8️⃣ TESTE: Campos Desconhecidos (devem ser ignorados)

### ✅ Campos Extra Ignorados
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "11222333000181",
    "nome_fantasia": "Empresa",
    "email": "contato@empresa.com",
    "campo_desconhecido": "valor",
    "outro_campo": "outro_valor"
  }'
```

**Resposta**: ✅ Aceita (campos desconhecidos são removidos)

---

## 🧪 Script de Teste Automático (Bash)

Salve como `test-validacoes.sh`:

```bash
#!/bin/bash

API="http://localhost:3001"
TOKEN="SEU_TOKEN_JWT"

echo "🧪 Iniciando testes de validação..."

# Teste 1: CNPJ Válido
echo ""
echo "✅ TESTE 1: CNPJ Válido"
curl -s -X POST $API/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"cnpj":"11222333000181","nome_fantasia":"Teste","email":"teste@empresa.com"}' | jq

# Teste 2: CNPJ Inválido
echo ""
echo "❌ TESTE 2: CNPJ Inválido"
curl -s -X POST $API/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"cnpj":"00000000000000","nome_fantasia":"Teste","email":"teste@empresa.com"}' | jq

# Teste 3: Email Inválido
echo ""
echo "❌ TESTE 3: Email Inválido"
curl -s -X POST $API/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"cnpj":"11222333000181","nome_fantasia":"Teste","email":"invalido"}' | jq

echo ""
echo "🎉 Testes finalizados!"
```

Executar:
```bash
chmod +x test-validacoes.sh
./test-validacoes.sh
```

---

## 📊 Resumo dos Testes

| Teste | Campo | Entrada | Esperado | Status |
|-------|-------|---------|----------|--------|
| 1 | CNPJ | 11222333000181 | ✅ Aceita | ✅ |
| 2 | CNPJ | 00000000000000 | ❌ Rejeita | ✅ |
| 3 | Email | invalido | ❌ Rejeita | ✅ |
| 4 | Email | contato@empresa.com | ✅ Aceita | ✅ |
| 5 | Nome | AB | ❌ Rejeita | ✅ |
| 6 | Telefone | 1122334455 | ✅ Aceita | ✅ |
| 7 | Data | fim < inicio | ❌ Rejeita | ✅ |
| 8 | Valor | -100 | ❌ Rejeita | ✅ |

---

## ✅ Tudo Funcionando?

Se todos os testes passaram com as respostas esperadas, suas validações estão **100% funcionais** ✅

Agora suas rotas estão protegidas contra:
- ✅ CNPJ inválido
- ✅ Email inválido
- ✅ Valores negativos
- ✅ Datas inconsistentes
- ✅ XSS (sanitização de input)
- ✅ SQL Injection (escape de valores)

🎉 **PRONTO PARA PRODUÇÃO!**
