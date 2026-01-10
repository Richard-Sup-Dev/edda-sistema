# Deploy Rápido - 15 minutos

## Frontend (Vercel)

### Via Dashboard (Recomendado)
1. Acessar: https://vercel.com/new
2. Import Git Repository: `Richard-Sup-Dev/edda-sistema`
3. Configure Project:
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variables:
   ```
   VITE_API_URL=https://seu-backend.onrender.com
   VITE_ENV=production
   ```
5. Deploy

**URL:** https://edda-sistema.vercel.app

---

## Backend (Render)

### Via Dashboard
1. Acessar: https://render.com/
2. New → Web Service
3. Connect Repository: `Richard-Sup-Dev/edda-sistema`
4. Configure:
   - Name: `edda-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Environment Variables (copiar de backend/.env):
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=postgresql://neondb_owner:npg_GOEFfD5eiK2z@ep-little-cake-adyd0fzn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=0775ae759082008cba74ea20dd3102ecb8735c4f8c405a99151f8ae77e1e2a879bd0a5cbaf289fcfb43f544d33666ea6633e70cebd4d402627ea88adcc9c1e62
   ALLOWED_ORIGINS=https://edda-sistema.vercel.app
   EMAIL_SERVICE=gmail
   EMAIL_USER=natsunokill188@gmail.com
   EMAIL_APP_PASS=fdxxdockofacqmgo
   EMAIL_FROM=natsunokill188@gmail.com
   FRONTEND_URL=https://edda-sistema.vercel.app
   LOG_LEVEL=info
   ```
6. Create Web Service

**URL:** https://edda-backend.onrender.com

---

## Pós-Deploy

### 1. Atualizar Frontend com URL do Backend
No Vercel:
- Settings → Environment Variables
- Editar `VITE_API_URL` para a URL do Render
- Redeploy

### 2. Testar
- Login: admin@edda.com
- Criar relatório
- Verificar email
- Testar WebSocket

---

## URLs Finais

- **Frontend:** https://edda-sistema.vercel.app
- **Backend:** https://edda-backend.onrender.com
- **Repositório:** https://github.com/Richard-Sup-Dev/edda-sistema
