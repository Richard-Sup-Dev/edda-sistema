# ⚡ QUICK REFERENCE - COMANDOS ESSENCIAIS

## 🚀 DEPLOY EM 5 PASSOS

```bash
# 1. Instalar dependências
cd backend
npm install

# 2. Configurar variáveis (copie o template)
cp .env.production.example .env.production
nano .env.production  # Edite as variáveis

# 3. Rodar testes (validar tudo)
npm test

# 4. Iniciar containers
docker-compose up -d

# 5. Verificar status
docker-compose ps
curl http://localhost/api/health
```

---

## 🔍 COMANDOS FREQUENTES

### Logs & Monitoramento

```bash
# Ver logs em tempo real
docker-compose logs -f backend

# Ver logs do nginx
docker-compose logs -f nginx

# Ver logs do PostgreSQL
docker-compose logs -f postgres

# Ver logs de erro específicos
docker-compose logs backend | grep -i error

# Ver uso de recursos
docker stats
```

### Testes

```bash
# Rodar todos os testes
cd backend && npm test

# Ver cobertura
npm test -- --coverage

# Ver cobertura em HTML
npm test -- --coverage --coverageReporters=html
# Abrir: coverage/index.html

# Rodar um teste específico
npm test -- auth.test.js

# Modo watch (rerun no change)
npm test -- --watch
```

### Containers

```bash
# Iniciar tudo
docker-compose up -d

# Parar tudo
docker-compose down

# Reiniciar tudo
docker-compose restart

# Reiniciar apenas backend
docker-compose restart backend

# Remover volumes (CUIDADO - deleta dados)
docker-compose down -v

# Ver status dos containers
docker-compose ps

# Entrar no container backend
docker exec -it backend sh

# Entrar no container postgres
docker exec -it postgres-edda psql -U postgres -d edda_db
```

### Database

```bash
# Conectar ao banco
docker exec -it postgres-edda psql -U postgres -d edda_db

# Backup manual
docker exec postgres-edda pg_dump -U postgres -d edda_db > backup.sql

# Restaurar backup
docker exec -i postgres-edda psql -U postgres -d edda_db < backup.sql

# Listar bancos
docker exec postgres-edda psql -U postgres -l
```

### Ambiente

```bash
# Validar variáveis de ambiente
cat .env.production

# Gerar novo JWT_SECRET (32+ chars)
openssl rand -base64 48

# Ver todas variáveis do container
docker-compose config | grep -A 20 'environment:'

# Atualizar variável de ambiente
# 1. Editar .env.production
nano .env.production
# 2. Reiniciar container
docker-compose restart backend
```

---

## 🔐 SEGURANÇA

```bash
# Gerar JWT_SECRET seguro
openssl rand -base64 48

# Gerar senha forte para banco
openssl rand -base64 32

# Verificar porta 3001 está livre
lsof -i :3001

# Liberar porta (se necessário)
sudo kill -9 <PID>

# Verificar SSL/HTTPS
curl -I https://seu-dominio.com

# Testar rate limiting
for i in {1..10}; do curl http://localhost/api/auth/login; done
```

---

## 🐛 TROUBLESHOOTING RÁPIDO

```bash
# Porta em uso
sudo lsof -i :3001 | grep LISTEN
sudo kill -9 <PID>

# Erro de conexão no banco
docker-compose logs postgres | tail -20

# Certificado SSL expirado
sudo certbot renew --force-renewal

# Nginx com erro
sudo nginx -t

# Memória cheia
docker system prune -a
docker system prune --volumes

# Backup não está rodando
sudo crontab -l
tail -f /var/log/edda-backup-cron.log

# Erro de permissão
sudo chown -R $USER:$USER /var/backups/edda-database
```

---

## 📊 VERIFICAÇÕES PRÉ-DEPLOY

```bash
# 1. Verificar Node
node -v  # Deve ser 18+

# 2. Verificar Docker
docker -v && docker-compose -v

# 3. Verificar banco
docker-compose logs postgres | grep "ready to accept"

# 4. Rodar testes
cd backend && npm test 2>&1 | grep -E "passed|failed"

# 5. Verificar API
curl -s http://localhost/api/health | jq .

# 6. Verificar permissões
ls -la backend/src/config/

# 7. Verificar env vars
grep -E "JWT_SECRET|DATABASE_URL|NODE_ENV" .env.production
```

---

## 📈 PERFORMANCE

```bash
# Ver quantidade de testes
grep -r "describe\|test\|it(" backend/src/__tests__/ | wc -l

# Ver cobertura resumida
npm test -- --coverage --silent 2>&1 | tail -10

# Tamanho das imagens Docker
docker images | grep -E "backend|frontend|postgres"

# Uso de memória dos containers
docker stats --no-stream

# Tempo de inicialização
time docker-compose up -d
```

---

## 🔄 ATUALIZAÇÃO

```bash
# Atualizar código
git pull origin main

# Atualizar dependências
cd backend && npm update
cd ../frontend && npm update

# Reconstruir containers
docker-compose down
docker-compose build
docker-compose up -d

# Testar após update
npm test
```

---

## 📚 ROTAS IMPORTANTES

```bash
# Health check
GET http://localhost/api/health

# Login
POST http://localhost/api/auth/login
{
  "email": "admin@test.com",
  "password": "password123"
}

# Listar clientes
GET http://localhost/api/clientes
# Com token no header:
# Authorization: Bearer <seu-token>

# Criar cliente
POST http://localhost/api/clientes
{
  "nome": "Empresa Teste",
  "cnpj": "11222333000181",
  "email": "empresa@test.com"
}

# Frontend
GET http://localhost/
```

---

## 🎯 CHECKLIST PRÉ-DEPLOY

```bash
# ✅ 1. Validar env
grep "JWT_SECRET\|DATABASE_URL" .env.production | wc -l

# ✅ 2. Rodar testes
npm test 2>&1 | grep -E "Tests|PASS|FAIL"

# ✅ 3. Validar containers
docker-compose config > /dev/null && echo "OK"

# ✅ 4. Verificar portas
netstat -tuln | grep -E "3001|80|443"

# ✅ 5. Começar
docker-compose up -d && echo "✅ Deploy iniciado"
```

---

## 🚨 EMERGÊNCIA - ROLLBACK

```bash
# Se algo deu errado:

# 1. Parar tudo
docker-compose down

# 2. Ver últimas mudanças
git log --oneline -5

# 3. Reverter
git reset --hard HEAD~1

# 4. Reiniciar
docker-compose up -d

# 5. Verificar
docker-compose ps
docker-compose logs backend | tail -20
```

---

## 💡 DICAS RÁPIDAS

- Use `docker-compose logs -f` para debug em tempo real
- Sempre rodar `npm test` antes de push
- Manter `.env.production` seguro (nunca committar)
- Backup semanal: `ls -lah /var/backups/edda-database`
- Monitorar CPU: `watch -n 1 'docker stats --no-stream'`
- Certificado expira em 3 meses, renovar automático ativa

---

**Salve este arquivo para referência rápida!**

📄 Arquivo: `QUICK_REFERENCE_COMANDOS.md`
