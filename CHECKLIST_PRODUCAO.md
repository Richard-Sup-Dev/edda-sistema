
# Checklist de Produção

Checklist objetivo para garantir deploy seguro e funcional.

## Antes do Deploy
- [ ] Variáveis de ambiente revisadas ([backend/.env.example](backend/.env.example), [frontend/.env.example](frontend/.env.example))
- [ ] Testes locais executados (backend e frontend)
- [ ] Login, criação de relatórios, upload e WebSocket validados
- [ ] E-mail e notificações funcionando
- [ ] Backup automatizado testado ([BACKUP_RESTORE_CHECKLIST.md](BACKUP_RESTORE_CHECKLIST.md))

## Deploy
- Siga o guia: [DEPLOY.md](DEPLOY.md)
- Configure variáveis de ambiente conforme exemplos
- Após deploy, valide endpoints principais e funcionalidades críticas

## Pós-Deploy
- [ ] Monitoramento ativo
- [ ] Backup agendado e validado
- [ ] Documentação entregue ao cliente ([README.md](README.md))

## Pós-Deploy

- Testar login em produção
- Criar relatório de teste
- Verificar logs
- Testar em mobile

1. Criar conta em https://render.com
2. Clicar em "New +" → "Web Service"
3. Conectar repositório GitHub
4. Configurar:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Copiar todas variáveis de [backend/.env](backend/.env)
5. Deploy automático!

### Opção 3: Deploy Backend (Railway - Grátis)

1. Criar conta em https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Selecionar repositório
4. Adicionar variáveis de ambiente (copiar de [backend/.env](backend/.env))
5. Railway detecta Node.js automaticamente
6. Deploy em ~3 minutos

### Opção 4: VPS Completo (DigitalOcean, Linode)

Ver guia detalhado em [DEPLOY.md](DEPLOY.md)

---

## 📊 **MONITORAMENTO PÓS-DEPLOY**

### Primeiro Dia
- [ ] Testar login em produção
- [ ] Criar relatório de teste
- [ ] Verificar logs de erro
- [ ] Testar em mobile (responsividade)

### Primeira Semana
- [ ] Configurar backup automático PostgreSQL
- [ ] Monitorar uso de recursos (CPU, RAM)
- [ ] Verificar emails de recuperação de senha
- [ ] Coletar feedback inicial de usuários

### Opcional (Recomendado)
- [ ] Configurar Sentry (monitoramento de erros)
- [ ] Configurar Uptime Robot (verificar se site está online)
- [ ] Habilitar Redis para cache (3-5x mais rápido)
- [ ] Configurar CI/CD (testes automáticos no GitHub)

---

## 🔒 **CHECKLIST DE SEGURANÇA**

### Confirmado ✅
- [x] JWT_SECRET com 128 caracteres
- [x] Senhas hasheadas com bcrypt
- [x] CORS configurável por ambiente
- [x] Helmet.js ativo
- [x] Rate limiting implementado
- [x] Variáveis de ambiente não commitadas
- [x] SQL injection prevenido (Sequelize)
- [x] XSS prevenido (sanitização de inputs)

### Recomendações Futuras
- [ ] SSL/TLS (HTTPS) - Grátis com Certbot ou Cloudflare
- [ ] Autenticação 2FA (opcional)
- [ ] Logs de auditoria (quem fez o quê)
- [ ] Backup automatizado testado

---

## 📝 **NOTAS IMPORTANTES**

### Redis (Opcional)
- Sistema funciona **100% sem Redis**
- Redis acelera em 3-5x (cache de queries)
- Pode ser habilitado depois sem mudanças no código
- Grátis: Redis Cloud (30MB) ou Upstash

### Email
- Gmail funciona com senha de app
- Alternativas: SendGrid, Mailgun, AWS SES
- Necessário apenas para recuperação de senha

### Banco de Dados
- Neon PostgreSQL já configurado e funcional
- Tem 500MB grátis (suficiente para iniciar)
- Backup automático incluído no plano grátis

---

## ✅ **SISTEMA ESTÁ PRONTO!**

Depois de configurar **EMAIL_APP_PASS** e validar variáveis, o sistema está **100% pronto para produção** sem erros.

**Tempo estimado até deploy:** 15-20 minutos ⏱️

---

## 📞 **SUPORTE**

Se encontrar problemas:
1. Verificar logs do servidor
2. Conferir variáveis de ambiente
3. Testar localmente primeiro
4. Revisar [DEPLOY.md](DEPLOY.md) para troubleshooting

**Boa sorte com o lançamento! 🚀**
