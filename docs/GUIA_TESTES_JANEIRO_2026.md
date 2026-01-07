# 🧪 GUIA DE TESTES - SISTEMA EDDA

## Testes Rápidos para Validar Implementação

### 1. Backend - Validação de Clientes

```bash
# Teste 1: Criar cliente com dados válidos
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "cnpj": "11222333000181",
    "nome_fantasia": "Empresa Teste",
    "razao_social": "Empresa Teste LTDA",
    "email": "empresa@teste.com"
  }'

# Teste 2: Listar clientes
curl -X GET http://localhost:3001/api/clientes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Teste 3: Criar cliente com CNPJ inválido (deve falhar)
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "cnpj": "00000000000000",
    "nome_fantasia": "Teste"
  }'
# Esperado: 400 - CNPJ inválido
```

### 2. Backend - Validação de Peças

```bash
# Criar peça
curl -X POST http://localhost:3001/api/pecas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "nome_peca": "Parafuso M10",
    "codigo_fabrica": "PS-M10-001",
    "valor_custo": 2.50,
    "valor_venda": 5.00
  }'
```

### 3. Frontend - Testar Navegação

1. Acesse `http://localhost:5173`
2. Login com credenciais (padrão ou do seu banco)
3. Navegar para:
   - `/dashboard` → Deve mostrar Dashboard com gráficos
   - `/dashboard/clientes` → CRUD Clientes
   - `/dashboard/pecas` → CRUD Peças
   - `/dashboard/servicos` → CRUD Serviços

### 4. Frontend - Testar Formulários

1. Clicar em "Novo Cliente"
2. Preencher:
   - CNPJ: 11222333000181
   - Nome: Empresa Teste
   - Email: teste@empresa.com
3. Clicar "Salvar"
4. Validar se aparece na tabela

### 5. Testar Validações

- Tente criar cliente com CNPJ vazio → Deve exibir erro
- Tente salvar peça com valor negativo → Deve recusar
- Tente atualizar com dados inválidos → Deve retornar 400

---

## 📊 Dados de Teste (Seed)

Se quiser popular banco com dados iniciais:

```sql
-- Cliente
INSERT INTO clientes (cnpj, nome_fantasia, razao_social, email)
VALUES ('11222333000181', 'Empresa A', 'Empresa A LTDA', 'empresa.a@teste.com');

-- Peça
INSERT INTO pecas (nome_peca, codigo_fabrica, valor_custo, valor_venda)
VALUES ('Parafuso M10', 'PS-M10-001', 2.50, 5.00);

-- Serviço
INSERT INTO servicos (nome_servico, valor_unitario)
VALUES ('Instalação', 150.00);
```

---

## 🔍 Debug

### Ver logs do Backend
```bash
docker-compose logs -f backend
```

### Ver console do Frontend
```
F12 → Console
```

### Testar Context
```javascript
// No console do navegador
import { useData } from '@/contexts/DataContext'
const { clientes, loadClientes } = useData()
await loadClientes()
console.log(clientes)
```

---

## ✅ Checklist de Validação

- [ ] Backend iniciando sem erros
- [ ] Frontend carregando Dashboard
- [ ] Sidebar navegando para todas as páginas
- [ ] Tabela de Clientes carregando
- [ ] Botão "Novo Cliente" abrindo modal
- [ ] Form salvando novo cliente
- [ ] Busca/filtro funcionando
- [ ] Editar cliente modificando dados
- [ ] Deletar cliente removendo da tabela
- [ ] Validação de CNPJ rejeitando inválidos
- [ ] Logout desconectando usuário

---

## 🆘 Troubleshooting

### Erro: "Cannot GET /dashboard/clientes"
- Verificar se `DashboardLayoutNew.jsx` está usando `<Outlet />`
- Verificar se rotas estão corretas em `App.jsx`

### Erro: "API call failed"
- Validar `API_BASE_URL` no `.env`
- Verificar se Backend está rodando na porta correta
- Checar token JWT no localStorage

### Erro: "Validação falhou"
- Checar se o middleware `validateRequest` está ativo
- Validar schema em `validations/`
- Ver detalhes no erro retornado (400 response)

### Dados não aparecem na tabela
- Verificar se `useData()` está chamando `loadClientes()`
- Checar Network tab no DevTools
- Validar resposta da API

---

**Pronto para testar! 🚀**
