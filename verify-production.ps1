#!/usr/bin/env pwsh
# ==============================================================================
# Script de Verificação 100% Produção
# ==============================================================================

Write-Host "🔍 VERIFICAÇÃO COMPLETA PARA PRODUÇÃO" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# ==============================================================================
# 1. TESTES BACKEND
# ==============================================================================
Write-Host "📦 1. Executando testes do BACKEND..." -ForegroundColor Yellow
Push-Location backend

$testOutput = npm test 2>&1 | Out-String
$testsPassed = $testOutput -match "Tests:\s+(\d+) passed"
$testsTotal = if ($testsPassed) { $Matches[1] } else { 0 }

if ($testOutput -match "FAIL") {
    Write-Host "   ❌ FALHA nos testes do backend" -ForegroundColor Red
    $errors++
} else {
    Write-Host "   ✅ Backend: $testsTotal testes passando" -ForegroundColor Green
}

Pop-Location

# ==============================================================================
# 2. TESTES FRONTEND
# ==============================================================================
Write-Host "📦 2. Executando testes do FRONTEND..." -ForegroundColor Yellow
Push-Location frontend

$testOutput = npm test 2>&1 | Out-String
$testsPassed = $testOutput -match "(\d+) passed"
$testsTotal = if ($testsPassed) { $Matches[1] } else { 0 }

if ($testOutput -match "FAIL") {
    Write-Host "   ❌ FALHA nos testes do frontend" -ForegroundColor Red
    $errors++
} else {
    Write-Host "   ✅ Frontend: $testsTotal testes passando" -ForegroundColor Green
}

Pop-Location

# ==============================================================================
# 3. BUILD FRONTEND
# ==============================================================================
Write-Host "📦 3. Build do FRONTEND..." -ForegroundColor Yellow
Push-Location frontend

$buildOutput = npm run build 2>&1 | Out-String

if ($buildOutput -match "error|Error|ERROR") {
    Write-Host "   ❌ ERRO no build do frontend" -ForegroundColor Red
    $errors++
} elseif ($buildOutput -match "warning|Warning|WARN") {
    Write-Host "   ⚠️  Build com warnings" -ForegroundColor Yellow
    $warnings++
} else {
    Write-Host "   ✅ Build sem erros ou warnings" -ForegroundColor Green
}

Pop-Location

# ==============================================================================
# 4. VARIÁVEIS DE AMBIENTE
# ==============================================================================
Write-Host "📦 4. Verificando arquivos .env..." -ForegroundColor Yellow

$envBackend = Test-Path "backend/.env"
$envFrontend = Test-Path "frontend/.env"

if ($envBackend) {
    Write-Host "   ✅ backend/.env existe" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  backend/.env não encontrado" -ForegroundColor Yellow
    $warnings++
}

if ($envFrontend) {
    Write-Host "   ✅ frontend/.env existe" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  frontend/.env não encontrado" -ForegroundColor Yellow
    $warnings++
}

# ==============================================================================
# 5. ESTRUTURA DE DIRETÓRIOS
# ==============================================================================
Write-Host "📦 5. Verificando estrutura crítica..." -ForegroundColor Yellow

$criticalDirs = @(
    "backend/src",
    "backend/src/config",
    "backend/src/controllers",
    "backend/src/services",
    "frontend/src",
    "frontend/src/pages",
    "frontend/src/components"
)

$missingDirs = @()
foreach ($dir in $criticalDirs) {
    if (-not (Test-Path $dir)) {
        $missingDirs += $dir
    }
}

if ($missingDirs.Count -gt 0) {
    Write-Host "   ❌ Diretórios faltando: $($missingDirs -join ', ')" -ForegroundColor Red
    $errors++
} else {
    Write-Host "   ✅ Todos os diretórios críticos presentes" -ForegroundColor Green
}

# ==============================================================================
# 6. DEPENDÊNCIAS
# ==============================================================================
Write-Host "📦 6. Verificando node_modules..." -ForegroundColor Yellow

$backendModules = Test-Path "backend/node_modules"
$frontendModules = Test-Path "frontend/node_modules"

if ($backendModules -and $frontendModules) {
    Write-Host "   ✅ Dependências instaladas" -ForegroundColor Green
} else {
    if (-not $backendModules) {
        Write-Host "   ⚠️  backend/node_modules faltando - execute: cd backend && npm install" -ForegroundColor Yellow
        $warnings++
    }
    if (-not $frontendModules) {
        Write-Host "   ⚠️  frontend/node_modules faltando - execute: cd frontend && npm install" -ForegroundColor Yellow
        $warnings++
    }
}

# ==============================================================================
# 7. ARQUIVOS DE CONFIGURAÇÃO
# ==============================================================================
Write-Host "📦 7. Verificando configurações críticas..." -ForegroundColor Yellow

$configFiles = @(
    @{Path="backend/package.json"; Name="Backend package.json"},
    @{Path="frontend/package.json"; Name="Frontend package.json"},
    @{Path="docker-compose.yml"; Name="Docker Compose"},
    @{Path="backend/jest.config.js"; Name="Jest config"}
)

foreach ($config in $configFiles) {
    if (Test-Path $config.Path) {
        Write-Host "   ✅ $($config.Name)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($config.Name) não encontrado" -ForegroundColor Red
        $errors++
    }
}

# ==============================================================================
# RELATÓRIO FINAL
# ==============================================================================
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "📊 RELATÓRIO FINAL" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✅ SISTEMA 100% PRONTO PARA PRODUÇÃO!" -ForegroundColor Green
    Write-Host "   Nenhum erro ou warning encontrado" -ForegroundColor Green
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "⚠️  Sistema pronto com $warnings warning(s)" -ForegroundColor Yellow
    Write-Host "   Nenhum erro crítico encontrado" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "❌ SISTEMA COM PROBLEMAS" -ForegroundColor Red
    Write-Host "   Erros: $errors" -ForegroundColor Red
    Write-Host "   Warnings: $warnings" -ForegroundColor Yellow
    exit 1
}
