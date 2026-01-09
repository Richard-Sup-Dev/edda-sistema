# ==============================================================================
# Script de Verificacao 100% Producao
# ==============================================================================

Write-Host "Verificacao Completa para Producao" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# 1. TESTES BACKEND
Write-Host "1. Executando testes do BACKEND..." -ForegroundColor Yellow
Push-Location backend
$testOutput = npm test 2>&1 | Out-String
if ($testOutput -match "FAIL") {
    Write-Host "   [X] FALHA nos testes do backend" -ForegroundColor Red
    $errors++
} else {
    Write-Host "   [OK] Backend: testes passando" -ForegroundColor Green
}
Pop-Location

# 2. TESTES FRONTEND
Write-Host "2. Executando testes do FRONTEND..." -ForegroundColor Yellow
Push-Location frontend
$testOutput = npm test 2>&1 | Out-String
if ($testOutput -match "FAIL") {
    Write-Host "   [X] FALHA nos testes do frontend" -ForegroundColor Red
    $errors++
} else {
    Write-Host "   [OK] Frontend: testes passando" -ForegroundColor Green
}
Pop-Location

# 3. BUILD FRONTEND
Write-Host "3. Build do FRONTEND..." -ForegroundColor Yellow
Push-Location frontend
$buildOutput = npm run build 2>&1 | Out-String
if ($buildOutput -match "error|Error|ERROR") {
    Write-Host "   [X] ERRO no build do frontend" -ForegroundColor Red
    $errors++
} elseif ($buildOutput -match "warning|Warning|WARN") {
    Write-Host "   [!] Build com warnings" -ForegroundColor Yellow
    $warnings++
} else {
    Write-Host "   [OK] Build sem erros ou warnings" -ForegroundColor Green
}
Pop-Location

# 4. VARIAVEIS DE AMBIENTE
Write-Host "4. Verificando arquivos .env..." -ForegroundColor Yellow
if (Test-Path "backend/.env") {
    Write-Host "   [OK] backend/.env existe" -ForegroundColor Green
} else {
    Write-Host "   [!] backend/.env nao encontrado" -ForegroundColor Yellow
    $warnings++
}

if (Test-Path "frontend/.env") {
    Write-Host "   [OK] frontend/.env existe" -ForegroundColor Green
} else {
    Write-Host "   [!] frontend/.env nao encontrado" -ForegroundColor Yellow
    $warnings++
}

# 5. ESTRUTURA DE DIRETORIOS
Write-Host "5. Verificando estrutura critica..." -ForegroundColor Yellow
$criticalDirs = @(
    "backend/src",
    "backend/src/config",
    "backend/src/controllers",
    "backend/src/services",
    "frontend/src",
    "frontend/src/pages",
    "frontend/src/components"
)

$allPresent = $true
foreach ($dir in $criticalDirs) {
    if (-not (Test-Path $dir)) {
        $allPresent = $false
        break
    }
}

if ($allPresent) {
    Write-Host "   [OK] Todos os diretorios criticos presentes" -ForegroundColor Green
} else {
    Write-Host "   [X] Diretorios faltando" -ForegroundColor Red
    $errors++
}

# 6. DEPENDENCIAS
Write-Host "6. Verificando node_modules..." -ForegroundColor Yellow
$backendModules = Test-Path "backend/node_modules"
$frontendModules = Test-Path "frontend/node_modules"

if ($backendModules -and $frontendModules) {
    Write-Host "   [OK] Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "   [!] Dependencias faltando" -ForegroundColor Yellow
    $warnings++
}

# RELATORIO FINAL
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "RELATORIO FINAL" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "[OK] SISTEMA 100% PRONTO PARA PRODUCAO!" -ForegroundColor Green
    Write-Host "      Nenhum erro ou warning encontrado" -ForegroundColor Green
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "[!] Sistema pronto com $warnings warning(s)" -ForegroundColor Yellow
    Write-Host "      Nenhum erro critico encontrado" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "[X] SISTEMA COM PROBLEMAS" -ForegroundColor Red
    Write-Host "      Erros: $errors | Warnings: $warnings" -ForegroundColor Red
    exit 1
}
