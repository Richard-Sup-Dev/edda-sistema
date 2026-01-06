# 📤 Guia Prático: Subir Seu Projeto no GitHub

## 🎯 Você Está Pronto!

Seu projeto EDDA está **100% pronto** para ir para o GitHub. Este guia tem todas as instruções.

---

## ⚡ Quick Start (3 minutos)

Se você já tem repo criado no GitHub:

```bash
# 1. Vá para pasta do projeto
cd c:\Users\Natsu\sistema-relatorios

# 2. Remova o .env (apenas local, Git vai ignorar)
del .env

# 3. Configure seu Git (primeira vez apenas)
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@github.com"

# 4. Faça tudo de uma vez
git add .
git commit -m "Publicar EDDA Sistema no GitHub - Sistema de gestão de relatórios técnicos"
git push origin main
```

**Pronto! ✅ Seu projeto está no GitHub!**

---

## 📋 Passo a Passo Detalhado

### PASSO 1: Criar Repositório no GitHub (5 min)

1. Abra https://github.com/new
2. Preencha:
   - **Repository name:** `edda-sistema`
   - **Description:** Sistema de gestão de relatórios técnicos
   - **Visibility:** Public (para portfólio) ou Private
   - **Não inicialize com README** (você já tem)

3. Clique "Create repository"
4. Copie o comando que aparece:

```bash
git remote add origin https://github.com/SEU_USUARIO/edda-sistema.git
git branch -M main
git push -u origin main
```

---

### PASSO 2: Preparar Projeto Localmente (5 min)

Abra PowerShell/Terminal e execute:

```bash
# Entre na pasta do projeto
cd c:\Users\Natsu\sistema-relatorios

# Verifique se está tudo configurado
git status
```

**Você deve ver:**
```
On branch main
nothing to commit, working tree clean
```

Ou:
```
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        CONTRIBUTING.md
        SECURITY.md
        (e outros novos arquivos)

nothing added to commit but untracked files present
```

---

### PASSO 3: Remover .env Local (IMPORTANTE!)

```bash
# Remove arquivo .env do seu computador (local apenas)
del .env

# Verifique que foi removido
dir .env

# Você deve ver: "O sistema não pode encontrar o arquivo especificado"
```

**Por quê?**
- `.env` contém senha do banco
- `.gitignore` já vai proteger
- Mas é mais seguro não ter localmente também

---

### PASSO 4: Verificar .gitignore

```bash
# Verifique que .env está protegido
type .gitignore | find ".env"

# Você deve ver:
# .env
# .env.local
# .env.*.local
# .env.production
```

✅ Se vir isso, está correto!

---

### PASSO 5: Adicionar Tudo

```bash
# Adiciona todos os arquivos para commit
git add .

# Verifique o que será enviado
git status
```

**Você deve ver:**
```
On branch main
Changes to be committed:
  new file: CONTRIBUTING.md
  new file: SECURITY.md
  new file: README.md
  (etc...)
```

⚠️ **Se vir `.env` na lista, PARE e execute:**
```bash
git rm --cached .env
```

---

### PASSO 6: Fazer Commit

```bash
git commit -m "Publicar EDDA Sistema - Sistema de gestão de relatórios técnicos com React, Node.js e PostgreSQL"
```

**Ou mensagem mais curta:**
```bash
git commit -m "Publicar EDDA Sistema no GitHub"
```

---

### PASSO 7: Conectar ao GitHub (primeira vez)

```bash
# Configure seu email e nome (primeira vez)
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@github.com"

# Adicione repositório remoto
git remote add origin https://github.com/SEU_USUARIO/edda-sistema.git

# Configure branch principal
git branch -M main
```

---

### PASSO 8: Upload Final! 🚀

```bash
# Faça upload
git push -u origin main
```

Se pedir autenticação:
- **Opção 1:** Usar token do GitHub (recomendado)
- **Opção 2:** Colar credenciais

---

## ✅ Confirmação de Sucesso

Abra https://github.com/SEU_USUARIO/edda-sistema

Você deve ver:
- ✅ README.md (apresentação do projeto)
- ✅ Pasta `backend/` com código
- ✅ Pasta `frontend/` com código
- ✅ CONTRIBUTING.md
- ✅ SECURITY.md
- ✅ LICENSE

⚠️ Você NÃO deve ver:
- ❌ `.env` (vai estar oculto)
- ❌ `node_modules/` (vai estar oculto)
- ❌ `logs/` ou dados sensíveis

---

## 🆘 Problemas Comuns

### Problema 1: "Permission denied (publickey)"

**Solução:**
```bash
# Gere chave SSH
ssh-keygen -t ed25519 -C "seu-email@github.com"

# Copie a chave
type C:\Users\Natsu\.ssh\id_ed25519.pub

# Adicione em: GitHub Settings → SSH Keys
```

---

### Problema 2: ".env aparece no repositório"

**Solução:**
```bash
# Remova do histórico
git rm --cached .env
git commit -m "Remove .env do repositório"
git push

# Verifique
git status
```

---

### Problema 3: "Branch 'main' não existe"

**Solução:**
```bash
# Crie a branch
git checkout -b main

# Ou renomeie
git branch -M main
```

---

### Problema 4: "Repository not found"

**Solução:**
```bash
# Verifique a URL
git remote -v

# Se errada, remova e adicione novamente
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/edda-sistema.git
```

---

## 📚 Depois do Upload

### Adicione ao GitHub (5 min)

1. **Repository Settings:**
   - ✅ Descrição completa
   - ✅ URL do projeto
   - ✅ Topics (tags): `react`, `nodejs`, `postgresql`, `docker`

2. **Adicione foto:**
   - Vá em Settings → Social Preview
   - Adicione imagem do seu dashboard

3. **Ative Discussions (opcional):**
   - Para comunidade discutir

---

## 🎉 Parabéns!

Seu projeto EDDA agora está no GitHub! 🚀

### Próximos passos sugeridos:

1. **Convide pessoas:**
   - Compartilhe link: `https://github.com/SEU_USUARIO/edda-sistema`
   - Peça feedback no LinkedIn

2. **Mantenha atualizado:**
   - A cada feature nova: `git push`
   - Antes de push: `git pull`

3. **Acompanhe estrelas:**
   - GitHub → Insights → Traffic
   - Veja quem está usando

---

## 💡 Dica Bônus: Git Cheatsheet

```bash
# Status do projeto
git status

# Ver histórico
git log --oneline -10

# Ver mudanças
git diff

# Desfazer último commit (sem apagar arquivos)
git reset --soft HEAD~1

# Desfazer arquivo específico
git checkout -- arquivo.js

# Atualizar repo local
git pull origin main
```

---

## ✨ Você Está Pronto!

Agora execute os 8 passos acima e seu projeto estará no GitHub!

**Qualquer dúvida, execute:**
```bash
git --help
```

**Boa sorte! 🚀**

---

*Guia criado para facilitar seu upload - 6 de Janeiro de 2026*
