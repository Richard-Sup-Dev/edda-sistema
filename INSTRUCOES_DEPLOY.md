# 🚀 INSTRUÇÕES DE DEPLOY - PRODUÇÃO LINUX (Ubuntu/Debian)

**Status**: ✅ Pronto para Deploy  
**Tempo estimado**: 30-45 minutos  
**Dificuldade**: Intermediária  
**Plataforma**: Ubuntu 20.04+ / Debian 11+  

---

## 📋 PRÉ-REQUISITOS

### 1. **Servidor Linux (Locação Recomendada)**

Qualquer um desses provedores funciona:

- **DigitalOcean** - $5-6/mês (recomendado, simples)
- **Linode** - $5+/mês (confiável)
- **AWS Lightsail** - $4-5/mês (mais complexo)
- **Contabo** - €4/mês (bom custo-benefício)
- **Locaweb/Hostinger** - VPS Linux

**Requisitos Mínimos**:
- CPU: 2 cores (4 melhor)
- RAM: 2GB (4GB melhor)
- Storage: 20GB SSD
- SO: Ubuntu 20.04 LTS ou Debian 11+

### 2. **Domínio (Opcional mas Recomendado)**

- Registrar em: **Namecheap**, **GoDaddy**, **Registro.br**, etc
- Apontar DNS para IP do servidor
- Exemplo: `seu-dominio.com` → `123.45.67.89`

### 3. **Conhecimentos Necessários**

- Comandos bash básicos (ssh, cp, chmod)
- Conceitos de Docker (não precisa ser expert)
- SSH (como conectar ao servidor)

---

## 🔧 PASSO 1: Preparar o Servidor

### 1.1 Conectar via SSH

```bash
# Onde user é 'root' ou seu username, e IP é o IP do servidor
ssh user@123.45.67.89

# DigitalOcean: ssh root@seu_droplet_ip
# Vai pedir a senha na primeira vez
```

### 1.2 Atualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Instalar Docker

```bash
# Download e install script oficial
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker (para não precisar de sudo)
sudo usermod -aG docker $USER

# Log out e log in novamente, ou:
newgrp docker
```

**Verificar instalação**:
```bash
docker --version
docker run hello-world
```

### 1.4 Instalar Docker Compose

```bash
# Download versão estável
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Tornar executável
sudo chmod +x /usr/local/bin/docker-compose

# Verificar
docker-compose --version
```

### 1.5 Instalar Ferramentas Úteis

```bash
sudo apt install -y curl wget git htop nano
```

### 1.6 Habilitar Firewall (UFW)

```bash
# Verificar status
sudo ufw status

# Ativar firewall
sudo ufw enable

# Permitir SSH (IMPORTANTE - senão perde acesso!)
sudo ufw allow 22/tcp

# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Verificar portas abertas
sudo ufw status numbered
```

---

## 📦 PASSO 2: Preparar Código no Servidor

### 2.1 Clonar Repositório ou Fazer Upload

**Opção A: Clonar do GitHub** (recomendado)

```bash
cd /home
mkdir -p apps
cd apps

# Clone seu repositório
git clone https://github.com/seu-usuario/sistema-relatorios.git
cd sistema-relatorios
```

**Opção B: Upload via SCP**

```bash
# Do seu computador local:
scp -r /path/to/sistema-relatorios user@123.45.67.89:/home/apps/
```

### 2.2 Verificar Estrutura

```bash
# Verificar se arquivos estão presentes
ls -la

# Verificar Dockerfiles
ls -la backend/Dockerfile frontend/Dockerfile

# Verificar docker-compose
ls -la docker-compose.yml

# Verificar deploy script
ls -la deploy.sh
chmod +x deploy.sh  # Tornar executável
```

---

## ⚙️ PASSO 3: Configurar Variáveis de Ambiente

### 3.1 Criar arquivo .env

```bash
# Copiar exemplo (se existir)
cp .env.production.example .env

# Ou criar novo
nano .env
```

### 3.2 Preencher com seus valores

```env
# ============================================
# BANCO DE DADOS
# ============================================
DB_NAME=edda_db
DB_USER=edda_user
DB_PASSWORD=SUA_SENHA_SUPER_SEGURA_123456  # USAR ALGO FORTE!

# ============================================
# JWT
# ============================================
# Gerar com: openssl rand -hex 32
JWT_SECRET=seu_token_aleatorio_gerado_aqui
JWT_EXPIRY=8h

# ============================================
# URLs (SUBSTITUIR COM SEU DOMÍNIO)
# ============================================
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
FRONTEND_URL=https://seu-dominio.com
SERVER_BASE_URL=https://api.seu-dominio.com

# ============================================
# EMAIL (Nodemailer/Gmail)
# ============================================
EMAIL_USER=seu-email@gmail.com
EMAIL_APP_PASS=sua_senha_app_gmail  # Gerar em https://myaccount.google.com/apppasswords
EMAIL_FROM=noreply@seu-dominio.com

# ============================================
# DEBUG
# ============================================
DEBUG_MODE=false
NODE_ENV=production
```

### 3.3 Gerar JWT_SECRET Seguro

```bash
# Executar no servidor
openssl rand -hex 32

# Copiar resultado e colar no .env
# Exemplo output: 
# 4f3a2b1c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f
```

### 3.4 Validar arquivo .env

```bash
cat .env | grep -E "JWT_SECRET|DB_PASSWORD|ALLOWED_ORIGINS"

# Deve mostrar seus valores (mascarados são ok):
# JWT_SECRET=xxxxx
# DB_PASSWORD=xxxxx
# ALLOWED_ORIGINS=https://seu-dominio.com
```

---

## 🐳 PASSO 4: Deploy com Docker Compose

### 4.1 Executar Script de Deploy (Recomendado)

```bash
# Opção 1: Modo interativo (menu)
./deploy.sh

# Opção 2: Modo automático (full deploy)
./deploy.sh deploy
```

**O que o script faz**:
1. ✅ Verifica Docker e Docker Compose
2. ✅ Valida arquivo .env
3. ✅ Build das imagens
4. ✅ Start dos containers
5. ✅ Health checks
6. ✅ Exibe logs

### 4.2 Ou Executar Manualmente (sem script)

```bash
# Build das imagens (primeira vez ou após mudanças)
docker-compose build

# Iniciar todos os serviços
docker-compose up -d

# Ver status
docker-compose ps

# Ver logs (deixa seguindo em tempo real)
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 4.3 Verificar Status

```bash
# Todos os containers rodando?
docker-compose ps

# Saída esperada:
# NAME           IMAGE              STATUS              PORTS
# edda_frontend  xxx_frontend       Up About a minute   0.0.0.0:80->80/tcp
# edda_backend   xxx_backend        Up About a minute   3001/tcp
# edda_postgres  postgres:16-alpine Up About a minute   5432/tcp
```

---

## 🔍 PASSO 5: Testar Conectividade

### 5.1 Teste do Frontend

```bash
# No seu navegador:
# http://seu-dominio.com (ou http://IP_DO_SERVIDOR)

# Deve abrir a aplicação React
# Verifica Console (F12) - não deve ter erros
```

### 5.2 Teste da API

```bash
# Listar todos os clientes (sem autenticação, pode dar erro)
curl http://seu-dominio.com/api/clientes

# Deve retornar JSON (até erro é ok, significa que a API respondeu)
# Exemplo: {"error":"Unauthorized"} ou lista de clientes
```

### 5.3 Teste de Validação

```bash
# Tentar criar cliente com CNPJ inválido
curl -X POST http://seu-dominio.com/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj":"00000000000000",
    "nome_fantasia":"Teste",
    "email":"teste@email.com"
  }'

# Resposta esperada:
# {"message":"CNPJ inválido"}
```

---

## 🔐 PASSO 6: Configurar HTTPS com Let's Encrypt (Recomendado)

### 6.1 Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx

# Ou com docker:
docker run -it --rm --name certbot \
  -v "/etc/letsencrypt:/etc/letsencrypt" \
  -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
  certbot/certbot certonly --standalone \
  -d seu-dominio.com \
  -d www.seu-dominio.com
```

### 6.2 Configurar Nginx com HTTPS

```bash
# Editar nginx.conf em frontend/
nano frontend/nginx.conf

# Adicionar configuration HTTPS (depois do block HTTP):
server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;
    
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # ... resto da configuração igual ao block HTTP ...
}

# Redirecionar HTTP para HTTPS
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    return 301 https://$server_name$request_uri;
}
```

### 6.3 Atualizar docker-compose.yml

```bash
# Na seção frontend, adicionar:
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro
  - /var/lib/letsencrypt:/var/lib/letsencrypt:ro

# E mudar port para:
ports:
  - "80:80"
  - "443:443"
```

### 6.4 Redeploy

```bash
docker-compose build frontend
docker-compose up -d frontend
```

---

## 🛠️ PASSO 7: Gerenciamento e Manutenção

### 7.1 Visualizar Logs em Tempo Real

```bash
# Todos os logs
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas últimas 100 linhas
docker-compose logs --tail=100 backend

# Com timestamps
docker-compose logs -f --timestamps backend
```

### 7.2 Acessar Shell de um Container

```bash
# Backend (Node)
docker-compose exec backend sh

# Dentro do container:
node -v
npm list
exit

# Frontend (Nginx)
docker-compose exec frontend sh
nginx -v
exit

# PostgreSQL
docker-compose exec postgres psql -U edda_user -d edda_db
# \dt (listar tabelas)
# SELECT * FROM "Users"; (ver dados)
# \q (sair)
```

### 7.3 Reiniciar Serviços

```bash
# Reiniciar tudo
docker-compose restart

# Reiniciar um serviço específico
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres

# Parar tudo
docker-compose stop

# Iniciar tudo
docker-compose start
```

### 7.4 Atualizar Código

```bash
# Puxar mudanças do Git
git pull origin main

# Rebuild apenas backend
docker-compose build --no-cache backend

# Redeploy backend (sem parar os outros)
docker-compose up -d backend

# Ou tudo:
docker-compose up -d
```

### 7.5 Backup do Banco de Dados

```bash
# Fazer backup
docker-compose exec postgres pg_dump -U edda_user -d edda_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker-compose exec -T postgres psql -U edda_user -d edda_db < backup_20240103_120000.sql
```

### 7.6 Limpeza de Espaço

```bash
# Ver espaço utilizado por Docker
docker system df

# Remover containers parados
docker system prune -f

# Remover tudo (CUIDADO!)
docker system prune -a -f

# Limpar volumes (CUIDADO - perde dados!)
docker volume prune -f
```

---

## 📊 MONITORAMENTO E ALERTAS

### 7.7 Criar Script de Health Check (Cron)

```bash
# Criar arquivo
nano /home/apps/check_health.sh

# Conteúdo:
#!/bin/bash
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/index.html)
BACKEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health)

if [ "$FRONTEND" != "200" ] || [ "$BACKEND" != "200" ]; then
    echo "[$TIMESTAMP] ALERTA: Frontend=$FRONTEND, Backend=$BACKEND" >> /var/log/edda_health.log
    # Pode enviar email ou notificação aqui
fi
```

```bash
# Tornar executável
chmod +x /home/apps/check_health.sh

# Adicionar ao crontab (rodar a cada 5 minutos)
crontab -e

# Adicionar linha:
*/5 * * * * /home/apps/check_health.sh
```

---

## 🚨 TROUBLESHOOTING

### Erro: "Port 80 already in use"

```bash
# Encontrar processo usando porta 80
sudo lsof -i :80

# Matar processo (substitute PID):
sudo kill -9 PID
```

### Erro: "Cannot connect to Docker daemon"

```bash
# Reiniciar Docker
sudo systemctl restart docker

# Ou:
sudo service docker restart
```

### Erro: "PostgreSQL not responding"

```bash
# Ver logs do PostgreSQL
docker-compose logs postgres

# Reiniciar PostgreSQL
docker-compose restart postgres

# Ou reconstruir
docker-compose rm -f postgres
docker-compose up -d postgres
```

### Erro: "Backend keeps restarting"

```bash
# Ver logs detalhados
docker-compose logs --tail=50 backend

# Verificar variáveis de ambiente
docker-compose exec backend env | grep DATABASE_URL

# Checklist:
# - DATABASE_URL está correta?
# - JWT_SECRET foi definido?
# - PostgreSQL está rodando? (docker-compose ps)
```

### Erro: "Frontend mostra blank page"

```bash
# Verificar se build completou
docker-compose logs frontend | grep -i error

# Refazer build
docker-compose build --no-cache frontend
docker-compose up -d frontend

# Limpar cache do navegador (Ctrl+Shift+Delete)
```

---

## 📈 ESCALABILIDADE FUTURA

### Quando o sistema crescer:

1. **Load Balancer** (Nginx, HAProxy)
2. **Múltiplas instâncias do Backend** (com docker-compose scale)
3. **Redis** para cache/sessions
4. **Kubernetes** para orquestração
5. **CDN** para assets estáticos (Cloudflare)

---

## ✅ CHECKLIST FINAL

```
PRÉ-DEPLOY:
□ Servidor Linux criado
□ Docker instalado
□ Código clonado/uploaded
□ arquivo .env configurado
□ JWT_SECRET gerado

APÓS DEPLOY:
□ docker-compose up rodou sem erros
□ docker-compose ps mostra 3 containers "Up"
□ Frontend abre em http://seu-dominio.com
□ API responde em /api/clientes
□ Health checks passam
□ Logs não mostram erros

SEGURANÇA:
□ Firewall ativado (UFW)
□ Apenas portas 22, 80, 443 abertas
□ HTTPS configurado (Let's Encrypt)
□ .env não commitado no Git
□ JWT_SECRET é aleatório (não texto fraco)
□ DB_PASSWORD é forte

PRODUÇÃO:
□ Backup automático configurado
□ Monitoring/alertas configurado
□ Email configurado corretamente
□ CORS configurado para seu domínio
□ Documentação criada para equipe
```

---

## 🎉 PRONTO PARA PRODUÇÃO!

Seu sistema está 100% pronto para ser colocado no ar!

### Próximos passos:
1. ✅ Teste em staging (servidor de teste)
2. ✅ Teste de carga (simule usuários)
3. ✅ Teste de backup/restore
4. ✅ Documenta procedimentos (para equipe)
5. ✅ Deploy em produção com confiança!

**Tempo total estimado**: 30-45 minutos  
**Risco**: Mínimo (arquivos testados e documentados)  
**Suporte**: Todas as ferramentas usadas têm comunidade grande  

---

**Sucesso! 🚀**

Qualquer dúvida, consulte os logs com `docker-compose logs -f`
