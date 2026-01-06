# 🚀 GUIA DE DEPLOYMENT EM PRODUÇÃO - EDDA SISTEMA

**Versão**: 1.0.0  
**Data**: 05 de Janeiro de 2026  
**Status**: ✅ Pronto para Deploy  

---

## 📋 PRÉ-REQUISITOS

- [x] VPS Linux (Ubuntu 22.04 recomendado)
- [x] Docker + Docker Compose
- [x] Domínio configurado (DNS)
- [x] Email para Let's Encrypt

---

## 🔧 PASSO 1: PREPARAÇÃO DO SERVIDOR

### 1.1. Atualizar Sistema
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget git nano
```

### 1.2. Instalar Docker
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalação
docker --version
docker compose version
```

### 1.3. Criar Estrutura de Diretórios
```bash
# Criar pasta do projeto
sudo mkdir -p /var/www/edda-sistema
sudo chown $USER:$USER /var/www/edda-sistema
cd /var/www/edda-sistema

# Clonar o repositório
git clone SEU_REPO_AQUI .
cd backend
```

---

## 🔐 PASSO 2: CONFIGURAR VARIÁVEIS DE PRODUÇÃO

### 2.1. Gerar JWT_SECRET Seguro
```bash
# Gerar uma chave de 32 caracteres aleatória
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Guardar o resultado! Vamos usar abaixo
```

### 2.2. Criar .env.production
```bash
# Criar arquivo
nano .env.production

# Colar conteúdo abaixo com SEU dados:
```

```env
# ====== SERVIDOR ======
NODE_ENV=production
PORT=3001

# ====== BANCO DE DADOS ======
# Use a string de conexão do seu provedor (Neon, Supabase, AWS RDS, etc)
DATABASE_URL=postgresql://usuario:senha@host:5432/edda_db?sslmode=require

# ====== JWT (Use a chave gerada acima) ======
JWT_SECRET=COLE_AQUI_A_CHAVE_GERADA

# ====== URLS ======
ALLOWED_ORIGINS=https://seu-dominio.com
FRONTEND_URL=https://seu-dominio.com
SERVER_BASE_URL=https://api.seu-dominio.com

# ====== EMAIL (Gmail com App Password) ======
EMAIL_USER=seu-email@gmail.com
EMAIL_APP_PASS=sua-app-password-gerada
EMAIL_FROM="EDDA Energia <seu-email@gmail.com>"
EMAIL_SERVICE=gmail
```

### 2.3. Criar .env para Frontend
```bash
cd ../frontend
nano .env.production

# Colar:
VITE_API_URL=https://api.seu-dominio.com
VITE_APP_NAME=EDDA
```

---

## 🐳 PASSO 3: CONFIGURAR DOCKER COMPOSE

### 3.1. Verificar docker-compose.yml
```bash
cd /var/www/edda-sistema

# Verificar se arquivo existe
cat docker-compose.yml

# Deve ter 3 serviços:
# - nginx (porta 80/443)
# - node (backend, porta 3001)
# - postgres (banco de dados)
```

### 3.2. Criar arquivo .dockerignore
```bash
# Na raiz do projeto
nano .dockerignore

# Colar:
node_modules
npm-debug.log
.git
.env
.env.*.example
logs
coverage
dist
build
.DS_Store
```

---

## 🌍 PASSO 4: CONFIGURAR NGINX COM HTTPS

### 4.1. Instalar Certbot (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 4.2. Gerar Certificado SSL
```bash
# Substituir seu-dominio.com com seu domínio
sudo certbot certonly --standalone \
  -d seu-dominio.com \
  -d api.seu-dominio.com \
  --non-interactive \
  --agree-tos \
  --email seu-email@gmail.com
```

### 4.3. Certificados estarão em:
```
/etc/letsencrypt/live/seu-dominio.com/
├── fullchain.pem   (certificado completo)
├── privkey.pem     (chave privada)
└── cert.pem        (certificado)
```

### 4.4. Atualizar nginx.conf

Editar `frontend/nginx.conf`:

```nginx
# Redirecionamento HTTP → HTTPS
server {
    listen 80;
    server_name seu-dominio.com api.seu-dominio.com;
    return 301 https://$server_name$request_uri;
}

# Frontend HTTPS
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API HTTPS
server {
    listen 443 ssl http2;
    server_name api.seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🚀 PASSO 5: FAZER BUILD E DEPLOY

### 5.1. Build das Imagens Docker
```bash
cd /var/www/edda-sistema

# Build das imagens (pode levar 5-10 minutos)
docker compose build

# Verificar se foram criadas
docker images | grep edda
```

### 5.2. Iniciar os Serviços
```bash
# Iniciar em background
docker compose up -d

# Verificar se iniciou corretamente
docker compose ps

# Ver logs em tempo real
docker compose logs -f

# Para containers específicos:
docker compose logs -f backend
docker compose logs -f postgres
```

### 5.3. Verificar se Está Funcionando
```bash
# Testar frontend
curl https://seu-dominio.com

# Testar backend
curl https://api.seu-dominio.com/api/test

# Resposta esperada: {"mensagem":"EDDA 2025 RODANDO!","status":"OK"}
```

---

## 📊 PASSO 6: BACKUP E MONITORAMENTO

### 6.1. Criar Script de Backup
```bash
sudo nano /usr/local/bin/backup-edda-db.sh

# Colar este conteúdo:
```

```bash
#!/bin/bash
# Script de backup do PostgreSQL

BACKUP_DIR="/var/backups/edda-db"
DATABASE_NAME="edda_db"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Fazer dump do banco
docker exec edda-postgres pg_dump \
  -U postgres \
  $DATABASE_NAME > $BACKUP_DIR/backup_$DATE.sql

# Manter apenas últimos 30 dias
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete

echo "Backup realizado: $BACKUP_DIR/backup_$DATE.sql"
```

### 6.2. Tornar Script Executável
```bash
sudo chmod +x /usr/local/bin/backup-edda-db.sh

# Testar
/usr/local/bin/backup-edda-db.sh
```

### 6.3. Agendar Backup Automático (Crontab)
```bash
sudo crontab -e

# Adicionar estas linhas (backup 3x ao dia):
0 6 * * * /usr/local/bin/backup-edda-db.sh >> /var/log/edda-backup.log 2>&1
0 14 * * * /usr/local/bin/backup-edda-db.sh >> /var/log/edda-backup.log 2>&1
0 22 * * * /usr/local/bin/backup-edda-db.sh >> /var/log/edda-backup.log 2>&1
```

### 6.4. Renovação Automática de Certificado SSL
```bash
sudo crontab -e

# Renovar certificado 30 dias antes do vencimento
0 3 * * * certbot renew --quiet --post-hook "docker compose -f /var/www/edda-sistema/docker-compose.yml reload nginx"
```

---

## 📝 PASSO 7: MONITORAR LOGS

### 7.1. Logs do Sistema
```bash
# Todos os logs
docker compose logs

# Backend apenas
docker compose logs -f backend

# Erros apenas
docker compose logs backend | grep ERROR

# Últimas 100 linhas
docker compose logs --tail=100 backend
```

### 7.2. Acessar Logs Internos do Backend
```bash
# Dentro do container
docker exec -it edda-backend sh

# Ver logs diários
ls -lah /app/logs/

# Tail em tempo real
tail -f /app/logs/application-*.log
```

---

## 🔍 TROUBLESHOOTING

### Erro: "Connection refused"
```bash
# Verificar se container está rodando
docker compose ps

# Ver logs
docker compose logs backend

# Reiniciar
docker compose restart backend
```

### Erro: "Database connection failed"
```bash
# Verificar database
docker compose ps postgres

# Ver logs postgres
docker compose logs postgres

# Verificar DATABASE_URL no .env.production
echo $DATABASE_URL
```

### Erro: "HTTPS certificate expired"
```bash
# Renovar certificado manualmente
sudo certbot renew

# Recarregar nginx
docker compose exec nginx nginx -s reload
```

---

## 🎯 CHECKLIST DE DEPLOYMENT

- [ ] Servidor Ubuntu 22.04 criado
- [ ] Docker + Docker Compose instalados
- [ ] Domínio DNS apontando para IP do servidor
- [ ] `.env.production` criado com variáveis
- [ ] `.env.production` para frontend criado
- [ ] `nginx.conf` atualizado com domínios
- [ ] Let's Encrypt certificado gerado
- [ ] Images Docker fazem build sem erros
- [ ] `docker compose up -d` iniciou sem erros
- [ ] Frontend acessível em https://seu-dominio.com
- [ ] Backend respondendo em https://api.seu-dominio.com/api/test
- [ ] Banco de dados criado e sincronizado
- [ ] Admin criado (admin@edda.com / Admin@2025EDDA)
- [ ] Backup script testado
- [ ] Crontab configurado
- [ ] Logs sendo gerados corretamente

---

## 🚨 MONITORAMENTO PÓS-DEPLOY

### Primeira Hora
1. Monitorar logs em tempo real
2. Testar login com admin default
3. Testar algumas rotas principais
4. Verificar HTTPS/certificado

### Próximas 24h
1. Monitorar erros nos logs
2. Testar backup automático
3. Validar performance
4. Alterar senha admin default

### Contínuo
1. Monitorar espaço em disco
2. Revisar logs diariamente
3. Renovar certificado antes do vencimento
4. Manter backups sempre

---

## 📞 SUPORTE

### Comandos Úteis
```bash
# Ver status geral
docker compose ps
docker stats

# Reiniciar tudo
docker compose restart

# Parar tudo
docker compose down

# Remover volumes (CUIDADO - deleta dados!)
docker compose down -v

# Atualizar código
git pull
docker compose build
docker compose up -d

# Limpar imagens não usadas
docker image prune -a
```

---

**Este guia foi validado em 05/01/2026**  
**Para dúvidas, consulte os logs: `docker compose logs`**
