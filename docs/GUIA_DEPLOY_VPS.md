# 🚀 Guia de Deploy em Produção (VPS)

Este guia mostra como fazer deploy do EDDA Sistema em servidores VPS populares.

## 📋 Pré-requisitos

- VPS com **Ubuntu 22.04 LTS** (mínimo 1GB RAM, 20GB disco)
- Domínio configurado apontando para seu VPS (opcional mas recomendado)
- Acesso SSH ao servidor

## 🎯 Opções de Deploy

### 1️⃣ DigitalOcean (Recomendado para iniciantes)

**Custo**: A partir de $6/mês (1GB RAM)

```bash
# 1. Criar Droplet Ubuntu 22.04
# 2. Conectar via SSH
ssh root@seu-ip

# 3. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install docker-compose-plugin -y

# 4. Clonar repositório
git clone https://github.com/Richard-Sup-Dev/edda-sistema.git
cd edda-sistema

# 5. Configurar variáveis de ambiente
cp .env.example .env
nano .env  # Editar com suas configurações

# 6. Iniciar aplicação
docker compose up -d

# 7. Verificar logs
docker compose logs -f
```

**Configurar domínio**:
```bash
# Instalar Nginx e Certbot
apt update
apt install nginx certbot python3-certbot-nginx -y

# Configurar SSL
certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

---

### 2️⃣ Hetzner (Melhor custo-benefício)

**Custo**: A partir de €4.15/mês (~$4.50) (2GB RAM!)

```bash
# Mesmo processo do DigitalOcean
# Hetzner oferece mais recursos pelo mesmo preço
# Servidores na Alemanha (ping pode ser maior para BR)
```

---

### 3️⃣ Render (PaaS - Mais fácil)

**Custo**: Gratuito (com limitações) ou $7/mês

1. Conecte seu repositório GitHub no [Render.com](https://render.com)
2. Crie novo **Web Service**:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
3. Adicione **PostgreSQL Database** (addon)
4. Configure variáveis de ambiente no dashboard
5. Deploy automático a cada push!

**Pros**: Zero configuração, SSL automático, deploy contínuo
**Cons**: Pode dormir após inatividade (plano free)

---

### 4️⃣ Railway

**Custo**: $5/mês de crédito gratuito, depois paga pelo uso

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Criar projeto
railway init

# 4. Adicionar PostgreSQL
railway add postgresql

# 5. Deploy
railway up
```

**Pros**: Muito simples, PostgreSQL incluído, SSL automático
**Cons**: Preço pode variar com tráfego

---

### 5️⃣ AWS EC2 (Para produção enterprise)

**Custo**: A partir de $10/mês (t3.micro)

```bash
# 1. Criar instância EC2 Ubuntu 22.04
# 2. Configurar Security Group:
#    - Porta 22 (SSH)
#    - Porta 80 (HTTP)
#    - Porta 443 (HTTPS)
#    - Porta 3001 (API - opcional)

# 3. Conectar via SSH
ssh -i sua-chave.pem ubuntu@seu-ip

# 4. Seguir passos do DigitalOcean acima
```

---

## 🔧 Configuração de Produção

### Variáveis de Ambiente (.env)

```env
# Banco de Dados
DB_NAME=edda_production
DB_USER=edda_user
DB_PASSWORD=SENHA_FORTE_AQUI_123!@#
DATABASE_URL=postgresql://edda_user:SENHA_FORTE@localhost:5432/edda_production

# JWT
JWT_SECRET=gere_com_crypto_64_caracteres_aleatorios
JWT_EXPIRY=8h

# Servidor
PORT=3001
NODE_ENV=production

# Frontend
FRONTEND_URL=https://seu-dominio.com
VITE_API_URL=https://api.seu-dominio.com
```

### Gerar JWT Secret Seguro

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🔒 Checklist de Segurança

- [ ] Trocar **todas** as senhas padrão
- [ ] Configurar **firewall** (ufw no Ubuntu)
- [ ] Habilitar **SSL/HTTPS** (Certbot gratuito)
- [ ] Configurar **backups automáticos** do banco
- [ ] Atualizar sistema: `apt update && apt upgrade`
- [ ] Desabilitar login root SSH
- [ ] Configurar **fail2ban** contra ataques
- [ ] Monitoramento: Sentry, New Relic, ou Datadog

```bash
# Firewall básico
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw enable
```

---

## 📊 Monitoramento

### Logs em Tempo Real

```bash
# Docker logs
docker compose logs -f

# Logs específicos
docker compose logs -f backend
docker compose logs -f frontend
```

### Verificar Status

```bash
# Containers rodando
docker compose ps

# Uso de recursos
docker stats

# Health check
curl http://localhost:3001/api/test
```

---

## 🔄 Atualizações

```bash
# 1. Pull do repositório
cd edda-sistema
git pull origin main

# 2. Rebuild e restart
docker compose down
docker compose up -d --build

# 3. Verificar
docker compose logs -f
```

---

## 💾 Backup do Banco

```bash
# Backup manual
docker compose exec postgres pg_dump -U edda_user edda_db > backup_$(date +%Y%m%d).sql

# Restaurar
docker compose exec -T postgres psql -U edda_user edda_db < backup.sql
```

### Backup Automático (cron)

```bash
# Editar crontab
crontab -e

# Adicionar backup diário às 3h
0 3 * * * cd /root/edda-sistema && docker compose exec -T postgres pg_dump -U edda_user edda_db > /backups/edda_$(date +\%Y\%m\%d).sql
```

---

## 🆘 Troubleshooting

### Containers não sobem

```bash
# Ver logs detalhados
docker compose logs

# Reconstruir do zero
docker compose down -v
docker compose up -d --build
```

### Banco não conecta

```bash
# Verificar se PostgreSQL está rodando
docker compose ps

# Testar conexão manualmente
docker compose exec postgres psql -U edda_user -d edda_db
```

### Erro de memória

```bash
# Verificar uso
free -h
docker stats

# Solução: aumentar swap ou RAM do servidor
```

---

## 📈 Próximos Passos

1. **CDN**: Cloudflare para cache e proteção DDoS
2. **Load Balancer**: Para múltiplas instâncias
3. **Redis**: Cache e sessions
4. **CI/CD**: GitHub Actions para deploy automático
5. **Monitoring**: Grafana + Prometheus

---

## 💰 Comparação de Custos

| Provedor | Preço/mês | RAM | vCPU | Storage | Extras |
|----------|-----------|-----|------|---------|--------|
| **Hetzner** | $4.50 | 2GB | 1 | 20GB | Melhor custo-benefício |
| **DigitalOcean** | $6.00 | 1GB | 1 | 25GB | Interface simples |
| **Railway** | $5-20 | Variável | - | - | Deploy fácil, PostgreSQL incluído |
| **Render** | $7.00 | 512MB | 0.5 | - | SSL automático, free tier |
| **AWS EC2** | $10.00 | 1GB | 2 | 8GB | Escalável, enterprise |

---

## 🎓 Recomendação

**Para começar**: Railway ou Render (mais fácil, zero config)
**Para produção séria**: Hetzner ou DigitalOcean (melhor controle)
**Para enterprise**: AWS ou Google Cloud (escalabilidade máxima)

---

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/Richard-Sup-Dev/edda-sistema/issues)
- **Discussões**: [GitHub Discussions](https://github.com/Richard-Sup-Dev/edda-sistema/discussions)
- **Documentação**: [docs/](../docs/)

---

**Boa sorte com o deploy! 🚀**
