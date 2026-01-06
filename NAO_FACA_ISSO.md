# ⚠️ Não Faça Isso - Erros Comuns no GitHub

Leia isso para **não cometer os mesmos erros** que poderiam prejudicar seu projeto.

---

## 🚫 CRÍTICO - Nunca Faça

### 1. ❌ Versionar o `.env`
```bash
# ERRADO ❌
git add .env
git commit -m "adicionar configuração"
```

**Por quê?** Expõe senha do banco, chaves API, tokens JWT.

**Correto ✅:**
```bash
git add .env.example    # OK
git add .env.example   # OK
# Mas .env está no .gitignore
```

---

### 2. ❌ Commit de Credenciais
```bash
# ERRADO ❌ 
password="minha_senha_123"
DATABASE_URL="postgresql://user:senha@host"
JWT_SECRET="chave_super_secreta"
```

**Por quê?** Qualquer um que clonar o repo terá suas credenciais.

**Correto ✅:**
```
# Use variáveis de ambiente
process.env.DATABASE_URL
process.env.JWT_SECRET
```

---

### 3. ❌ Código com Prints de Tela
```bash
# ERRADO ❌
git add screenshots/senhas_de_producao.png
git add downloads/backup_com_dados_sensiveis.zip
```

**Correto ✅:**
```
# Use .gitignore
downloads/
*.png (se não for necessário)
```

---

## ⚠️ IMPORTANTE - Muito Importante

### 4. ❌ Descrição Genérica de IA
```bash
# ERRADO ❌
"Este é um sistema implementado utilizando as mais 
modernas tecnologias de desenvolvimento web, proporcionando 
uma solução robusta e escalável para gerenciamento de dados."
```

**Por quê?** Parece IA, desinteressa potenciais usuários/contribuidores.

**Correto ✅:**
```
"Um sistema para gerenciar relatórios técnicos. 
Construído com React, Node.js e PostgreSQL."
```

---

### 5. ❌ README Confuso
```bash
# ERRADO ❌
# Incluir todo histórico de desenvolvimento
# Incluir notas pessoais
# Tabelas com muitos emojis
# Instruções muito longas (>1000 linhas)
```

**Correto ✅:**
```
# Simples, direto, útil
1. O que é?
2. Como começar?
3. Como usar?
4. Como contribuir?
```

---

### 6. ❌ Comentários Inapropriados no Código
```javascript
// ERRADO ❌
// TODO: fazer isso quando o chefe sair
// HACK: gambiarrada do caralho, não mexer!
// console.log('XXXXX DEBUG XXXXX - TIRAR ISSO')
```

**Correto ✅:**
```javascript
// Melhorado: refatorar validação
// Nota: workaround temporário para Issue #42
// TODO: resolver performance em próxima release
```

---

## 🟡 AVISO - Cuidado

### 7. ⚠️ Dependências Vulneráveis
```bash
# ERRADO ❌
npm install package-com-bug-conhecida
npm install e_depender_de_codigo_descontinuado
```

**Correto ✅:**
```bash
npm audit
npm audit fix
npm update
```

---

### 8. ⚠️ Documentação em Inglês e Português Misturados
```bash
# ERRADO ⚠️
README.md em inglês
LEIA_ME.md em português
Alguns comentários em inglês, outros em português
```

**Correto ✅:**
```
Escolha um idioma para o repositório
Mantenha consistência
(Português é OK se seu projeto é brasileiro)
```

---

### 9. ⚠️ Estrutura Confusa
```bash
# ERRADO ⚠️
projeto/
├── README.md
├── LEIA-ME.md
├── COMECE_AQUI.md
├── GUIA_RAPIDO.md
├── RESUMO_EXECUTIVO.md
├── CHECKLIST_FINAL.md
└── 20+ outros documentos
```

**Correto ✅:**
```
projeto/
├── README.md (único ponto de entrada)
├── docs/ (documentação adicional)
│   ├── SETUP.md
│   ├── API.md
│   └── CONTRIBUTING.md
```

---

### 10. ⚠️ Sem Licença
```bash
# ERRADO ⚠️
# Sem arquivo LICENSE
# Usuários não sabem como usar seu código
```

**Correto ✅:**
```
LICENSE (arquivo com licença escolhida)
README.md menciona a licença
```

---

## 🔍 Verificação Rápida

Antes de fazer push, execute:

```bash
# 1. Verificar o que será enviado
git diff --cached

# 2. Procurar por credenciais
grep -r "password\|secret\|token" . --include="*.js"

# 3. Verificar .gitignore
cat .gitignore

# 4. Revisar commits
git log --oneline -5
```

---

## 📝 Checklist Anti-Erros

- [ ] Nenhum `.env` com valores reais será enviado
- [ ] Nenhuma senha ou token no código ou git history
- [ ] README é claro e em idioma consistente
- [ ] Estrutura de pastas é lógica
- [ ] Comentários são profissionais
- [ ] Dependências não têm vulnerabilidades conhecidas
- [ ] Projeto foi testado localmente
- [ ] LICENSE existe
- [ ] .gitignore protege dados sensíveis
- [ ] Nenhuma nota pessoal ou desabafo no código

---

## 🆘 Oops, Já Commitei!

Se você já fez commit de algo sensível:

```bash
# 1. Remove arquivo do histórico
git rm --cached .env
git commit --amend -m "Remove .env"

# 2. Regenere credenciais!
# Senha do banco: altere
# JWT secret: gere novo
# API keys: regenere

# 3. Força push (cuidado!)
git push --force-with-lease
```

---

## 📚 Referências

- [GitHub Best Practices](https://github.github.io/gitignore)
- [Node.js Security](https://nodejs.org/en/docs/guides/nodejs-security/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ✅ Você Está Seguro?

Se você:
- ✅ Leu este arquivo
- ✅ Verificou os 10 pontos
- ✅ Fez o checklist
- ✅ Testou localmente

Então sim, está seguro para publicar! 🎉

---

**Desenvolvido para evitar problemas de segurança**
