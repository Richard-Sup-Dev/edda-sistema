#!/bin/bash

# 🚀 SCRIPT SEGURO PARA UPLOAD NO GITHUB
# Execute este arquivo para fazer upload seguro do projeto

set -e  # Para em qualquer erro

echo "=========================================="
echo "🚀 UPLOAD SEGURO PARA GITHUB - EDDA SISTEMA"
echo "=========================================="
echo ""

# PASSO 1: Verificação de Segurança
echo "📋 PASSO 1: Verificando segurança..."
echo ""

# Verificar se .env será ignorado
if grep -q "^\.env$" .gitignore; then
    echo "✅ .env está no .gitignore"
else
    echo "❌ ERRO: .env não está no .gitignore!"
    exit 1
fi

# Verificar se .env existir como arquivo
if [ -f .env ]; then
    echo "⚠️  Arquivo .env existe (será ignorado pelo git)"
fi

# Verificar credenciais que podem ser expostas
echo ""
echo "🔍 Procurando por credenciais expostas..."
CREDENCIAIS_ENCONTRADAS=0

# Procurar em arquivos .js
if grep -r "password.*=" --include="*.js" src/ 2>/dev/null | grep -v "hashed\|hash\|encrypted"; then
    echo "⚠️  Possível credencial encontrada em .js"
    CREDENCIAIS_ENCONTRADAS=$((CREDENCIAIS_ENCONTRADAS + 1))
fi

if [ $CREDENCIAIS_ENCONTRADAS -eq 0 ]; then
    echo "✅ Nenhuma credencial óbvia encontrada"
fi

echo ""

# PASSO 2: Limpar Git
echo "🧹 PASSO 2: Limpando histórico local..."

# Remover .env do git (se já estiver commitado)
if git ls-files | grep -q "^\.env$"; then
    echo "⚠️  Removendo .env do histórico do Git..."
    git rm --cached .env 2>/dev/null || true
    git commit -m "🔒 Remove .env do controle de versão" || true
fi

echo "✅ Git limpo"
echo ""

# PASSO 3: Adicionar arquivos
echo "📦 PASSO 3: Adicionando arquivos para commit..."

git add .

echo "✅ Arquivos adicionados"
echo ""

# PASSO 4: Status
echo "📊 PASSO 4: Verificando status..."
echo ""
git status

echo ""

# PASSO 5: Confirmação
echo "=========================================="
echo "✅ TUDO PRONTO PARA UPLOAD!"
echo "=========================================="
echo ""
echo "Próximos passos:"
echo ""
echo "1️⃣  Revisar mudanças:"
echo "   git diff --cached"
echo ""
echo "2️⃣  Fazer commit:"
echo "   git commit -m \"Publicar EDDA Sistema no GitHub\""
echo ""
echo "3️⃣  Fazer upload:"
echo "   git push origin main"
echo ""
echo "Ou execute tudo de uma vez:"
echo ""
echo "   git commit -m \"Publicar EDDA Sistema no GitHub\" && git push origin main"
echo ""
echo "=========================================="
echo "🎉 Sucesso! Seu projeto estará no GitHub!"
echo "=========================================="
