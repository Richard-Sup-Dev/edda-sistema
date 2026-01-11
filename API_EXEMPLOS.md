
# Exemplos de Uso da API

Exemplos práticos de requisições e respostas para os principais endpoints.
Consulte a [documentação Swagger](./backend/SWAGGER_DOCUMENTATION.md) para detalhes completos.

## Autenticação
### Login
```
POST /api/auth/login
{
  "email": "usuario@exemplo.com",
  "senha": "suasenha"
}
```
**Resposta:**
```
{
  "mensagem": "Login realizado com sucesso!",
  "user": { "id": 1, "nome": "Usuário", "email": "usuario@exemplo.com", "role": "user" }
}
```

### Refresh Token
```
POST /api/auth/refresh-token
# (Cookies HttpOnly são usados)
```
**Resposta:**
```
{
  "mensagem": "Token renovado com sucesso."
}
```

## CRUD Clientes
### Listar clientes
```
GET /api/clientes
# Headers: (autenticado)
```
**Resposta:**
```
[
  { "id": 1, "nome": "Cliente 1", ... },
  { "id": 2, "nome": "Cliente 2", ... }
]
```

### Criar cliente
```
POST /api/clientes
{
  "nome": "Novo Cliente",
  "email": "cliente@exemplo.com"
}
```
**Resposta:**
```
{
  "id": 3,
  "nome": "Novo Cliente",
  "email": "cliente@exemplo.com"
}
```

## Observações
- Todas as rotas protegidas exigem autenticação via cookie HttpOnly.
- Para mais exemplos, consulte a documentação Swagger em `/api-docs`.
