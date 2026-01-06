# 🚀 DEPLOYMENT RÁPIDO (5 MINUTOS)

## OPÇÃO 1: Vercel (Recomendado - Mais Fácil)

### Pré-requisito
```bash
npm i -g vercel
```

### Passos
```bash
# 1. Entrar na pasta
cd frontend

# 2. Fazer login (primeira vez)
vercel login

# 3. Variáveis de Ambiente
# Na dashboard do Vercel:
# - Ir em: Project Settings → Environment Variables
# - Adicionar:
#   VITE_API_URL=https://seu-backend.com
#   VITE_ENV=production
#   VITE_DEBUG=false

# 4. Deploy
vercel --prod
```

**URL gerada**: Automática (ex: seu-projeto.vercel.app)

---

## OPÇÃO 2: Netlify

### Pré-requisito
```bash
npm i -g netlify-cli
```

### Passos
```bash
# 1. Entrar na pasta
cd frontend

# 2. Fazer login
netlify login

# 3. Build local (opcional)
npm run build

# 4. Variáveis de Ambiente
# Na dashboard do Netlify:
# - Site Settings → Build & Deploy → Environment
# - Adicionar as variáveis

# 5. Deploy
netlify deploy --prod
```

---

## OPÇÃO 3: GitHub Pages

### Passos
```bash
# 1. Adicionar ao package.json
"deploy": "npm run build && gh-pages -d dist"

# 2. Instalar gh-pages
npm i -g gh-pages

# 3. Build e deploy
npm run deploy

# 4. Ir em GitHub → Settings → Pages
# - Selecionar branch "gh-pages"
```

---

## OPÇÃO 4: Servidor Próprio (Linux)

### Pré-requisito
- Node.js 16+
- npm

### Passos
```bash
# 1. Clonar repositório
git clone seu-repo
cd frontend

# 2. Instalar dependências
npm install

# 3. Criar arquivo .env
cat > .env.production << EOF
VITE_API_URL=https://seu-backend.com
VITE_ENV=production
VITE_DEBUG=false
EOF

# 4. Build
npm run build

# 5. Servir com http-server
npm i -g http-server
http-server dist -p 3000 -c-1

# OU com Nginx
sudo cp -r dist/* /var/www/seu-app/
```

---

## Checklist Pré-Deploy

- [ ] API_URL está correto no backend?
- [ ] Backend está rodando? (teste: curl https://seu-backend.com/api/health)
- [ ] VITE_DEBUG=false em produção?
- [ ] Token JWT funciona?
- [ ] Toasts aparecem (não alerts)?

---

## Verificar Após Deploy

```javascript
// No navegador (F12 → Console)

// ✅ Deve estar vazio (sem console.logs)
console.log('Teste');  // Não deve aparecer se VITE_DEBUG=false

// ✅ Deve fazer request correta
fetch('https://seu-api.com/api/clientes').then(r => r.json()).then(console.log)

// ✅ Toast deve aparecer ao invés de alert
// (Abrir qualquer formulário com erro)
```

---

## Se Der Erro

### Erro: "API connection failed"
```bash
# Verificar se backend está rodando
curl https://seu-backend.com/api/auth/me -H "Authorization: Bearer seu-token"

# Se houver erro CORS, avisar o backend:
# Adicionar no CORS: https://seu-dominio.com
```

### Erro: "VITE_API_URL is undefined"
```bash
# Ir em Deploy Settings e verificar variáveis
# Se não achar, adicionar manualmente na plataforma
```

### Erro: "Token expirado"
```bash
# Normal em produção nova
# Fazer login novamente
```

---

## Rollback (Se Necessário)

### Vercel
```bash
vercel --prod  # Deploy anterior fica em rascunho
# Ir em Deployments e clicar em "Promote to Production"
```

### Netlify
```bash
# Ir em Deploys → Selecionar versão anterior → "Publish Deploy"
```

---

## Monitoramento

### Logs
```bash
# Vercel
vercel logs

# Netlify
netlify logs:tail
```

### Erros
- Console do navegador (F12)
- Network tab para requisições
- Application tab para localStorage

---

## Performance

Após deploy, testar em: https://lighthouse-ci.com/

Deveria ter:
- Performance: 80+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

## Sucesso! 🎉

Seu sistema está em produção!

**URL**: `https://seu-dominio.com`

**Próximas melhorias**:
- [ ] Configurar CDN
- [ ] Implementar analytics
- [ ] Setup de monitoring
- [ ] Backups automáticos

---

*Tempo estimado: 5-10 minutos*  
*Dificuldade: Fácil* 🟢
