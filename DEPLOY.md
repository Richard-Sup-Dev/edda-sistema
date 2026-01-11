
# 🚀 Deploy Guide - Sistema de Relatórios

Guia de referência para deploy em produção.

## Índice
- [Checklist Pré-Deploy](#checklist-pré-deploy)
- [Opções de Deploy](#opções-de-deploy)
  - [VPS (DigitalOcean, AWS, etc.)](#vps-digitalocean-aws-etc)
  - [Render (Backend)](#render-backend)
  - [Vercel (Frontend)](#vercel-frontend)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Dicas e Troubleshooting](#dicas-e-troubleshooting)

---

## 📋 Checklist Pré-Deploy

- [ ] Testes passando (Frontend e Backend)
- [ ] Variáveis de ambiente configuradas ([.env.example](backend/.env.example), [frontend/.env.example](frontend/.env.example))
- [ ] Banco de dados PostgreSQL provisionado
- [ ] SSL/TLS configurado
- [ ] Backups automáticos configurados
- [ ] Monitoramento configurado
- [ ] Rate limiting ativo

---

## 🌐 Opções de Deploy

### 1. VPS (DigitalOcean, Linode, AWS EC2)
Veja instruções detalhadas em [DEPLOY_VPS.md](DEPLOY_VPS.md) (crie este arquivo se quiser manter o passo a passo completo).

### 2. Render (Backend)
1. Crie conta em [render.com](https://render.com/)
2. Novo Web Service → Conecte o repositório
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Configure variáveis de ambiente conforme `.env.example`

### 3. Vercel (Frontend)
1. Crie conta em [vercel.com](https://vercel.com/)
2. Novo Projeto → Import GitHub → `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure variáveis de ambiente conforme `frontend/.env.example`

---

## Configuração de Ambiente
Consulte os arquivos `.env.example` no backend e frontend para todas as variáveis necessárias.

---

## Dicas e Troubleshooting
- Veja [CHECKLIST_PRODUCAO.md](CHECKLIST_PRODUCAO.md) para checklist de produção.
- Consulte [README.md](README.md) e [QUICK_START.md](QUICK_START.md) para instruções rápidas.
- Para configurações avançadas (Nginx, PM2, SSL), consulte exemplos no arquivo antigo ou peça um guia específico.

---

**Dúvidas?** Abra uma issue ou consulte a documentação completa.
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
