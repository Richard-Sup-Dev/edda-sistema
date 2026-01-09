#!/bin/bash

# ============================================
# SCRIPT DE INSTALAÇÃO - PRÓXIMAS MELHORIAS
# Sistema EDDA - 09/01/2026
# ============================================

echo ""
echo "========================================="
echo "  EDDA - Instalação de Melhorias"
echo "========================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "${YELLOW}[1/6] Verificando Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}  ✅ Node.js instalado: $NODE_VERSION${NC}"
else
    echo -e "${RED}  ❌ Node.js não encontrado! Instale em: https://nodejs.org${NC}"
    exit 1
fi

echo ""

# Verificar npm
echo -e "${YELLOW}[2/6] Verificando npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}  ✅ npm instalado: v$NPM_VERSION${NC}"
else
    echo -e "${RED}  ❌ npm não encontrado!${NC}"
    exit 1
fi

echo ""

# Instalar dependências do BACKEND
echo -e "${YELLOW}[3/6] Instalando dependências do Backend...${NC}"
echo -e "${CYAN}  📦 Instalando ws@^8.18.0 (WebSocket)...${NC}"

cd backend

if npm install ws@^8.18.0 --save > /dev/null 2>&1; then
    echo -e "${GREEN}  ✅ Backend: Dependências instaladas!${NC}"
else
    echo -e "${YELLOW}  ⚠️  Erro ao instalar dependências do backend${NC}"
    echo -e "${GRAY}  Execute manualmente: cd backend && npm install${NC}"
fi

cd ..
echo ""

# Configurar .env do BACKEND
echo -e "${YELLOW}[4/6] Configurando variáveis de ambiente (Backend)...${NC}"

if [ -f "backend/.env" ]; then
    echo -e "${YELLOW}  ⚠️  backend/.env já existe. Pulando...${NC}"
else
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "${GREEN}  ✅ backend/.env criado a partir do .env.example${NC}"
        echo -e "${CYAN}  📝 IMPORTANTE: Edite backend/.env com suas credenciais!${NC}"
    else
        echo -e "${YELLOW}  ⚠️  backend/.env.example não encontrado${NC}"
    fi
fi

echo ""

# Instalar dependências do FRONTEND
echo -e "${YELLOW}[5/6] Instalando dependências do Frontend...${NC}"
echo -e "${CYAN}  📦 Instalando Vitest, React Testing Library, jsdom...${NC}"

cd frontend

if npm install > /dev/null 2>&1; then
    echo -e "${GREEN}  ✅ Frontend: Dependências instaladas!${NC}"
else
    echo -e "${YELLOW}  ⚠️  Erro ao instalar dependências do frontend${NC}"
    echo -e "${GRAY}  Execute manualmente: cd frontend && npm install${NC}"
fi

cd ..
echo ""

# Configurar .env do FRONTEND
echo -e "${YELLOW}[6/6] Configurando variáveis de ambiente (Frontend)...${NC}"

if [ -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}  ⚠️  frontend/.env.local já existe. Pulando...${NC}"
else
    if [ -f "frontend/.env.example" ]; then
        cp frontend/.env.example frontend/.env.local
        echo -e "${GREEN}  ✅ frontend/.env.local criado a partir do .env.example${NC}"
        echo -e "${CYAN}  📝 Variáveis WebSocket já configuradas!${NC}"
    else
        echo -e "${YELLOW}  ⚠️  frontend/.env.example não encontrado${NC}"
    fi
fi

echo ""
echo "========================================="
echo -e "${GREEN}  ✅ INSTALAÇÃO CONCLUÍDA!${NC}"
echo "========================================="
echo ""

echo -e "${YELLOW}📋 PRÓXIMOS PASSOS:${NC}"
echo ""
echo -e "${CYAN}1️⃣  Editar configurações (se necessário):${NC}"
echo -e "${GRAY}   - backend/.env (credenciais do banco)${NC}"
echo -e "${GRAY}   - frontend/.env.local (URLs da API)${NC}"
echo ""
echo -e "${CYAN}2️⃣  Iniciar Backend:${NC}"
echo -e "${GRAY}   cd backend${NC}"
echo -e "${GRAY}   npm start${NC}"
echo ""
echo -e "${CYAN}3️⃣  Iniciar Frontend (em outro terminal):${NC}"
echo -e "${GRAY}   cd frontend${NC}"
echo -e "${GRAY}   npm run dev${NC}"
echo ""
echo -e "${CYAN}4️⃣  Rodar testes do Frontend:${NC}"
echo -e "${GRAY}   cd frontend${NC}"
echo -e "${GRAY}   npm test${NC}"
echo ""
echo -e "${CYAN}5️⃣  Ver UI de testes (opcional):${NC}"
echo -e "${GRAY}   cd frontend${NC}"
echo -e "${GRAY}   npm run test:ui${NC}"
echo ""
echo "========================================="
echo ""
echo -e "${YELLOW}📚 DOCUMENTAÇÃO:${NC}"
echo -e "${GRAY}   - PROXIMOS_PASSOS.md (este guia)${NC}"
echo -e "${GRAY}   - frontend/TESTING.md (guia de testes)${NC}"
echo -e "${GRAY}   - MELHORIAS_IMPLEMENTADAS.md (todas as features)${NC}"
echo ""
echo -e "${GREEN}🎉 Sistema atualizado com sucesso!${NC}"
echo ""
