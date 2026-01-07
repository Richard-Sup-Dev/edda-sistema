# 🚀 GUIA COMPLETO DE DEPLOYMENT EM PRODUÇÃO

## 📋 PRÉ-REQUISITOS

- ✅ Servidor Linux (Ubuntu 22.04 LTS recomendado)
- ✅ Docker e Docker Compose instalados
- ✅ Domínio registrado (ex: seu-dominio.com)
- ✅ Acesso SSH ao servidor
- ✅ 2GB RAM mínimo
- ✅ 10GB espaço em disco

## 🔧 PASSO 1: PREPARAÇÃO DO SERVIDOR

```bash
# 1.1 Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 1.2 Instalar essenciais
sudo apt install -y curl wget git nano htop net-tools

# 1.3 Instalar Docker (se não tiver)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# 1.4 Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 1.5 Verificar instalação
docker --version && docker-compose --version
```

## 🌐 PASSO 2: CONFIGURAR DOMÍNIO

```bash
# 2.1 Apontar DNS do seu domínio para o IP do servidor
# No seu provedor DNS, adicione:
#   A record: seu-dominio.com → IP_DO_SERVIDOR
#   A record: www.seu-dominio.com → IP_DO_SERVIDOR
#   A record: api.seu-dominio.com → IP_DO_SERVIDOR

# 2.2 Testar DNS (espere 15-30 minutos)
nslookup seu-dominio.com
```

## 🔐 PASSO 3: INSTALAR CERTIFICADO SSL/TLS (Let's Encrypt)

```bash
# 3.1 Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# 3.2 Criar diretório para validação Let's Encrypt
sudo mkdir -p /var/www/certbot

# 3.3 Gerar certificado (STOP container nginx antes!)
docker-compose down nginx

# 3.4 Obter certificado
sudo certbot certonly --standalone \
  -d seu-dominio.com \
  -d www.seu-dominio.com \
  -d api.seu-dominio.com \
  --email seu-email@dominio.com \
  --agree-tos \
  --non-interactive

# 3.5 Certificado será salvo em:
# /etc/letsencrypt/live/seu-dominio.com/

# 3.6 Verificar permissões
sudo chmod -R 755 /etc/letsencrypt
```

## 📦 PASSO 4: CLONAR E CONFIGURAR APLICAÇÃO

```bash
# 4.1 Clonar repositório
cd /opt
sudo git clone https://github.com/seu-usuario/sistema-relatorios.git
cd sistema-relatorios
sudo chown -R $USER:$USER .

# 4.2 Criar variáveis de ambiente
cp .env.production.example .env.production

# 4.3 Editar arquivo .env.production
nano .env.production

# 4.4 Configurações CRÍTICAS a validar:
# NODE_ENV=production
# DATABASE_URL=postgresql://usuario:senha@db:5432/edda_db
# JWT_SECRET=gerar-com-openssl-rand-base64-48 (MÍNIMO 32 chars)
# FRONTEND_URL=https://seu-dominio.com
# ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
# BACKEND_PORT=3001
# DB_PASSWORD=gerar-senha-forte
```

## 📝 PASSO 5: ATUALIZAR NGINX PARA HTTPS

```bash
# 5.1 Copiar configuração HTTPS
sudo cp frontend/nginx-https.conf /etc/nginx/nginx.conf

# 5.2 IMPORTANTES: Editar o arquivo e SUBSTITUIR:
#     - seu-dominio.com → seu domínio real
#     - /etc/letsencrypt/live/seu-dominio.com → seu caminho real
sudo nano /etc/nginx/nginx.conf

# 5.3 Testar configuração nginx
sudo nginx -t

# 5.4 Se OK, recarregar
sudo systemctl restart nginx
```

## 🐳 PASSO 6: INICIAR CONTAINERS

```bash
# 6.1 Montar volume para Let's Encrypt
sudo mkdir -p /var/letsencrypt
sudo cp -r /etc/letsencrypt/live/seu-dominio.com /var/letsencrypt/

# 6.2 Ajustar permissões
sudo chown -R 33:33 /var/letsencrypt

# 6.3 Atualizar docker-compose.yml
# Adicionar volume:
# volumes:
#   - /var/letsencrypt:/etc/letsencrypt

# 6.4 Iniciar aplicação
docker-compose up -d

# 6.5 Verificar logs
docker-compose logs -f backend
```

## ✅ PASSO 7: VALIDAR DEPLOYMENT

```bash
# 7.1 Testar frontend HTTPS
curl -I https://seu-dominio.com

# 7.2 Testar API HTTPS
curl -I https://api.seu-dominio.com/health

# 7.3 Verificar redirecionamento HTTP → HTTPS
curl -I http://seu-dominio.com

# 7.4 Ver status dos containers
docker-compose ps

# 7.5 Verificar logs de erro
docker-compose logs backend | tail -50
```

## 🔄 PASSO 8: CONFIGURAR BACKUP AUTOMÁTICO

```bash
# 8.1 Copiar script de backup
sudo cp backend/scripts/backup-postgres.sh /usr/local/bin/backup-edda-postgres.sh
sudo chmod +x /usr/local/bin/backup-edda-postgres.sh

# 8.2 Criar diretório de backups
sudo mkdir -p /var/backups/edda-database
sudo chown postgres:postgres /var/backups/edda-database
sudo chmod 700 /var/backups/edda-database

# 8.3 Configurar crontab
sudo crontab -e

# 8.4 Copiar linhas do arquivo crontab-backup-config.txt:
# 0 6 * * * /usr/local/bin/backup-edda-postgres.sh >> /var/log/edda-backup-cron.log 2>&1
# 0 14 * * * /usr/local/bin/backup-edda-postgres.sh >> /var/log/edda-backup-cron.log 2>&1
# 0 22 * * * /usr/local/bin/backup-edda-postgres.sh >> /var/log/edda-backup-cron.log 2>&1

# 8.5 Testar backup manualmente
sudo /usr/local/bin/backup-edda-postgres.sh

# 8.6 Verificar arquivo criado
ls -lh /var/backups/edda-database/
```

## 🛡️ PASSO 9: CONFIGURAR FIREWALL

```bash
# 9.1 Instalar UFW
sudo apt install -y ufw

# 9.2 Habilitar UFW
sudo ufw enable

# 9.3 Permitir SSH (MUITO IMPORTANTE!)
sudo ufw allow 22/tcp

# 9.4 Permitir HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 9.5 Negar todo o resto
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 9.6 Verificar status
sudo ufw status
```

## 🔄 PASSO 10: RENOVAÇÃO AUTOMÁTICA DO CERTIFICADO

```bash
# 10.1 Configurar renovação automática (Let's Encrypt)
sudo certbot renew --dry-run

# 10.2 Se sucesso, configurar cron
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# 10.3 Verificar status
sudo systemctl status certbot.timer
```

## 📊 PASSO 11: MONITORAMENTO E LOGS

```bash
# 11.1 Ver status da aplicação
docker-compose ps

# 11.2 Ver logs da aplicação
docker-compose logs -f backend

# 11.3 Ver logs do nginx
docker-compose logs -f nginx

# 11.4 Ver logs do backup
tail -f /var/log/edda-backup-cron.log

# 11.5 Ver uso de disco
df -h

# 11.6 Ver uso de memória
free -h

# 11.7 Ver estado dos containers
docker stats
```

## 🔧 TROUBLESHOOTING

### ❌ Certificado SSL não carrega
```bash
# Verificar se Let's Encrypt conseguiu validar
sudo certbot certificates

# Renew manualmente
sudo certbot renew --force-renewal

# Verificar arquivo de configuração nginx
sudo nginx -t
```

### ❌ Aplicação não conecta ao banco
```bash
# Verificar container do banco
docker-compose logs postgres

# Testar conexão
docker exec -it postgres-edda psql -U postgres -d edda_db -c "SELECT 1;"

# Verificar variáveis de ambiente
docker-compose config | grep DATABASE
```

### ❌ Porta 443 já está em uso
```bash
# Encontrar processo usando porta
sudo lsof -i :443

# Matar processo se necessário
sudo kill -9 <PID>
```

### ❌ Nginx não inicia
```bash
# Testar configuração
sudo nginx -t

# Ver erro específico
sudo nginx -T | grep error
```

## 📈 MELHORIAS PÓS-DEPLOYMENT

- [ ] Habilitar Sentry para error tracking (backend/src/config/sentry.js)
- [ ] Adicionar documentação Swagger em /api/docs
- [ ] Configurar CI/CD com GitHub Actions
- [ ] Aumentar testes para 80%+ cobertura
- [ ] Configurar alertas de email para erros críticos
- [ ] Implementar cache Redis
- [ ] Configurar CDN para assets estáticos

## 📞 SUPORTE

Se encontrar problemas:

1. Verificar logs: `docker-compose logs -f`
2. Validar certificado: `sudo certbot certificates`
3. Testar firewall: `sudo ufw status`
4. Verificar DNS: `nslookup seu-dominio.com`
5. Contatar suporte do servidor

---

**Versão:** 1.0  
**Data:** 2024  
**Status:** Production Ready ✅
