# ============================================
# SCRIPT DE INSTALAÇÃO - PRÓXIMAS MELHORIAS
# Sistema EDDA - 09/01/2026
# ============================================

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  EDDA - Instalação de Melhorias" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Função para verificar se comando existe
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    } catch {
        return $false
    }
}

# Verificar Node.js
Write-Host "[1/6] Verificando Node.js..." -ForegroundColor Yellow
if (Test-Command node) {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Node.js não encontrado! Instale em: https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verificar npm
Write-Host "[2/6] Verificando npm..." -ForegroundColor Yellow
if (Test-Command npm) {
    $npmVersion = npm --version
    Write-Host "  ✅ npm instalado: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ npm não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Instalar dependências do BACKEND
Write-Host "[3/6] Instalando dependências do Backend..." -ForegroundColor Yellow
Write-Host "  📦 Instalando ws@^8.18.0 (WebSocket)..." -ForegroundColor Cyan

Set-Location backend

try {
    npm install ws@^8.18.0 --save 2>&1 | Out-Null
    Write-Host "  ✅ Backend: Dependências instaladas!" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Erro ao instalar dependências do backend" -ForegroundColor Yellow
    Write-Host "  Execute manualmente: cd backend && npm install" -ForegroundColor Gray
}

Set-Location ..
Write-Host ""

# Configurar .env do BACKEND
Write-Host "[4/6] Configurando variáveis de ambiente (Backend)..." -ForegroundColor Yellow

if (Test-Path "backend\.env") {
    Write-Host "  ⚠️  backend/.env já existe. Pulando..." -ForegroundColor Yellow
} else {
    if (Test-Path "backend\.env.example") {
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Host "  ✅ backend/.env criado a partir do .env.example" -ForegroundColor Green
        Write-Host "  📝 IMPORTANTE: Edite backend/.env com suas credenciais!" -ForegroundColor Cyan
    } else {
        Write-Host "  ⚠️  backend/.env.example não encontrado" -ForegroundColor Yellow
    }
}

Write-Host ""

# Instalar dependências do FRONTEND
Write-Host "[5/6] Instalando dependências do Frontend..." -ForegroundColor Yellow
Write-Host "  📦 Instalando Vitest, React Testing Library, jsdom..." -ForegroundColor Cyan

Set-Location frontend

try {
    npm install 2>&1 | Out-Null
    Write-Host "  ✅ Frontend: Dependências instaladas!" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Erro ao instalar dependências do frontend" -ForegroundColor Yellow
    Write-Host "  Execute manualmente: cd frontend && npm install" -ForegroundColor Gray
}

Set-Location ..
Write-Host ""

# Configurar .env do FRONTEND
Write-Host "[6/6] Configurando variáveis de ambiente (Frontend)..." -ForegroundColor Yellow

if (Test-Path "frontend\.env.local") {
    Write-Host "  ⚠️  frontend/.env.local já existe. Pulando..." -ForegroundColor Yellow
} else {
    if (Test-Path "frontend\.env.example") {
        Copy-Item "frontend\.env.example" "frontend\.env.local"
        Write-Host "  ✅ frontend/.env.local criado a partir do .env.example" -ForegroundColor Green
        Write-Host "  📝 Variáveis WebSocket já configuradas!" -ForegroundColor Cyan
    } else {
        Write-Host "  ⚠️  frontend/.env.example não encontrado" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  ✅ INSTALAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Editar configurações (se necessário):" -ForegroundColor Cyan
Write-Host "   - backend/.env (credenciais do banco)" -ForegroundColor Gray
Write-Host "   - frontend/.env.local (URLs da API)" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Iniciar Backend:" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Iniciar Frontend (em outro terminal):" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣  Rodar testes do Frontend:" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm test" -ForegroundColor Gray
Write-Host ""
Write-Host "5️⃣  Ver UI de testes (opcional):" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run test:ui" -ForegroundColor Gray
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 DOCUMENTAÇÃO:" -ForegroundColor Yellow
Write-Host "   - PROXIMOS_PASSOS.md (este guia)" -ForegroundColor Gray
Write-Host "   - frontend/TESTING.md (guia de testes)" -ForegroundColor Gray
Write-Host "   - MELHORIAS_IMPLEMENTADAS.md (todas as features)" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Sistema atualizado com sucesso!" -ForegroundColor Green
Write-Host ""
