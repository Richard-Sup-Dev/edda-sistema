# 🚀 Deploy Guide - Sistema de Relatórios

Guia completo para fazer deploy do sistema em produção.

## 📋 Checklist Pré-Deploy

- [ ] Testes passando (Frontend 99%+, Backend 60%+)
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados PostgreSQL provisionado
- [ ] SSL/TLS configurado
- [ ] Backups automáticos configurados
- [ ] Monitoramento configurado
- [ ] Rate limiting ativo

---

## 🌐 Opções de Deploy

### 1. VPS (DigitalOcean, Linode, AWS EC2)

#### a) Preparar Servidor

```bash
# Ubuntu 22.04 LTS
sudo apt update
sudo apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL 14+
sudo apt install -y postgresql postgresql-contrib

# Instalar Redis (opcional)
sudo apt install -y redis-server

# Instalar Nginx
sudo apt install -y nginx

# Instalar Certbot (SSL grátis)
sudo apt install -y certbot python3-certbot-nginx
```

#### b) Configurar PostgreSQL

```bash
sudo -u postgres psql

CREATE DATABASE relatorios_prod;
CREATE USER relatorios_user WITH ENCRYPTED PASSWORD 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON DATABASE relatorios_prod TO relatorios_user;
\q
```

#### c) Deploy Backend

```bash
# Clone repositório
cd /var/www
sudo git clone https://github.com/seu-usuario/sistema-relatorios.git
cd sistema-relatorios/backend

# Instalar dependências
npm ci --only=production

# Configurar .env
sudo nano .env
```

**.env Produção**:
```env
NODE_ENV=production
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=relatorios_prod
DB_USER=relatorios_user
DB_PASSWORD=senha_forte_aqui
DB_SSL=true

# JWT
JWT_SECRET=chave_super_secreta_produção_2024
JWT_EXPIRES_IN=24h

# Email (Gmail, SendGrid, etc)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-app

# Redis (opcional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=senha_redis

# URLs
API_URL=https://api.seudominio.com
FRONTEND_URL=https://app.seudominio.com

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# Sentry (opcional)
SENTRY_DSN=https://...@sentry.io/...
```

```bash
# Rodar migrations
npm run migrate

# Criar usuário admin
node scripts/create-admin.js

# Testar servidor
npm start
```

#### d) Configurar PM2 (Process Manager)

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar aplicação
pm2 start src/server.js --name "relatorios-backend"

# Auto-restart on reboot
pm2 startup
pm2 save

# Monitorar
pm2 status
pm2 logs relatorios-backend
pm2 monit
```

#### e) Deploy Frontend

```bash
cd /var/www/sistema-relatorios/frontend

# Instalar dependências
npm ci

# Configurar .env.production
nano .env.production
```

**.env.production**:
```env
VITE_API_URL=https://api.seudominio.com/api
VITE_APP_NAME=Sistema de Relatórios
VITE_APP_VERSION=1.0.0
```

```bash
# Build para produção
npm run build

# Arquivos gerados em dist/
ls -la dist/
```

#### f) Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/relatorios
```

**Configuração Nginx**:
```nginx
# Backend API
server {
    listen 80;
    server_name api.seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout para uploads grandes
        client_max_body_size 50M;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}

# Frontend
server {
    listen 80;
    server_name app.seudominio.com;

    root /var/www/sistema-relatorios/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/relatorios /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

#### g) Configurar SSL (Let's Encrypt)

```bash
# SSL automático para ambos os domínios
sudo certbot --nginx -d api.seudominio.com -d app.seudominio.com

# Auto-renovação (já configurado)
sudo certbot renew --dry-run
```

#### h) Firewall

```bash
# Configurar UFW
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

---

### 2. Docker / Docker Compose

#### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: relatorios_prod
      POSTGRES_USER: relatorios_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - relatorios-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    networks:
      - relatorios-network
    restart: unless-stopped

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      REDIS_HOST: redis
      REDIS_PORT: 6379
    env_file:
      - ./backend/.env
    depends_on:
      - postgres
      - redis
    networks:
      - relatorios-network
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - relatorios-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  relatorios-network:
    driver: bridge
```

#### Deploy

```bash
# Build e start
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

---

### 3. Plataformas Cloud

#### Vercel (Frontend) + Railway (Backend)

**Frontend no Vercel**:
```bash
# Instalar Vercel CLI
npm i -g vercel

cd frontend
vercel --prod
```

**Backend no Railway**:
1. Conecte repositório GitHub
2. Configure variáveis de ambiente
3. Deploy automático a cada push

#### Heroku (Ambos)

```bash
# Instalar Heroku CLI
heroku login

# Criar apps
heroku create relatorios-backend
heroku create relatorios-frontend

# Backend
cd backend
git push heroku main
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini

# Frontend
cd frontend
# Configure buildpack
heroku buildpacks:set heroku/nodejs
```

---

## 🔒 Segurança em Produção

### Checklist de Segurança

- [ ] **HTTPS obrigatório** - SSL/TLS ativo
- [ ] **Helmet.js** - Headers de segurança
- [ ] **Rate Limiting** - Prevenir DDoS
- [ ] **CORS configurado** - Apenas domínios permitidos
- [ ] **Senhas seguras** - JWT_SECRET forte (32+ chars)
- [ ] **DB_SSL=true** - Conexão criptografada
- [ ] **Logs sanitizados** - Sem senhas/tokens nos logs
- [ ] **Backups automáticos** - Diários do banco
- [ ] **Monitoramento** - Sentry/CloudWatch
- [ ] **Atualizações** - npm audit fix regular

### Hardening Backend

```javascript
// backend/src/server.js
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests por IP
  message: 'Muitas requisições, tente novamente mais tarde',
});

app.use('/api/', limiter);
```

---

## 📊 Monitoramento

### 1. PM2 Monitoring

```bash
# Instalar PM2 Plus (grátis até 3 servidores)
pm2 link your-secret-key your-public-key

# Dashboard: https://app.pm2.io
```

### 2. Sentry (Error Tracking)

```bash
npm install @sentry/node @sentry/profiling-node
```

```javascript
// backend/src/config/sentry.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### 3. Logs

```bash
# Ver logs em tempo real
pm2 logs relatorios-backend --lines 100

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 💾 Backup

### Backup Automático PostgreSQL

```bash
# Criar script de backup
sudo nano /usr/local/bin/backup-relatorios.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/relatorios"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="relatorios_prod"

mkdir -p $BACKUP_DIR

# Backup
pg_dump -U relatorios_user $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Manter apenas últimos 30 dias
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completo: $DATE"
```

```bash
# Tornar executável
sudo chmod +x /usr/local/bin/backup-relatorios.sh

# Agendar no cron (diário às 2h)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-relatorios.sh >> /var/log/backup-relatorios.log 2>&1
```

---

## 🔄 CI/CD (GitHub Actions)

```.github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      # Frontend tests
      - name: Test Frontend
        run: |
          cd frontend
          npm ci
          npm test
      
      # Backend tests
      - name: Test Backend
        run: |
          cd backend
          npm ci
          npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/sistema-relatorios
            git pull origin main
            cd backend && npm ci --only=production && pm2 restart relatorios-backend
            cd ../frontend && npm ci && npm run build
            sudo systemctl reload nginx
```

---

## ✅ Pós-Deploy

### Verificações

```bash
# 1. Saúde da API
curl https://api.seudominio.com/health
# Esperado: {"status":"ok","uptime":123}

# 2. Frontend carregando
curl -I https://app.seudominio.com
# Esperado: HTTP/2 200

# 3. SSL válido
openssl s_client -connect api.seudominio.com:443 -servername api.seudominio.com

# 4. Logs sem erros
pm2 logs relatorios-backend --lines 50 --nostream
```

### Performance

```bash
# Teste de carga
npm install -g artillery
artillery quick --count 10 --num 50 https://api.seudominio.com/health

# Lighthouse (Frontend)
npx lighthouse https://app.seudominio.com --view
```

---

## 🆘 Troubleshooting Produção

### Backend não responde
```bash
pm2 restart relatorios-backend
pm2 logs relatorios-backend --err
```

### Erro 502 Bad Gateway
```bash
# Verificar se backend está rodando
pm2 status
netstat -tulpn | grep 3000

# Testar Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### Banco de dados lento
```sql
-- Ver queries lentas
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

-- Matar query travada
SELECT pg_terminate_backend(pid);
```

---

## 📈 Escalabilidade

### Horizontal Scaling

1. **Load Balancer** (Nginx/HAProxy)
2. **Múltiplas instâncias** do backend
3. **Redis** para sessions/cache compartilhado
4. **CDN** para assets estáticos (Cloudflare)
5. **Database Read Replicas** para leitura

### Vertical Scaling

- Aumentar RAM/CPU do servidor
- Otimizar queries do banco
- Implementar cache agressivo
- Comprimir responses (gzip)

---

**Tempo estimado de deploy**: ⏱️ 30-60 minutos

**Próxima revisão**: Trimestral

**Última atualização**: Janeiro 2026
