param(
    [string]$GithubUsername = "",
    [string]$RepositoryName = "edda-sistema",
    [string]$CommitMessage = "Publicar EDDA Sistema no GitHub"
)

Write-Host ""
Write-Host "=========================================="
Write-Host "🚀 SCRIPT UPLOAD GITHUB - EDDA SISTEMA"
Write-Host "=========================================="
Write-Host ""

# Cores para output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"

# PASSO 1: Verificar se está em repo Git
Write-Host "PASSO 1: Verificando repositório Git..." -ForegroundColor $Yellow
$gitFolder = Test-Path -Path ".git" -PathType Container

if (-not $gitFolder) {
    Write-Host "ℹ️  Repositório Git não existe. Inicializando..." -ForegroundColor $Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao inicializar Git!" -ForegroundColor $Red
        exit 1
    }
    Write-Host "✅ Git inicializado" -ForegroundColor $Green
} else {
    Write-Host "✅ Repositório Git já existe" -ForegroundColor $Green
}

Write-Host ""

# PASSO 2: Verificar .env
Write-Host "PASSO 2: Verificando segurança..." -ForegroundColor $Yellow

if (Test-Path ".env" -PathType Leaf) {
    Write-Host "⚠️  Removendo arquivo .env (será ignorado pelo Git)..." -ForegroundColor $Yellow
    Remove-Item ".env" -Force
    Write-Host "✅ Arquivo .env removido" -ForegroundColor $Green
} else {
    Write-Host "✅ Arquivo .env não existe" -ForegroundColor $Green
}

# Verificar .gitignore
if (-not (Test-Path ".gitignore" -PathType Leaf)) {
    Write-Host "❌ .gitignore não existe!" -ForegroundColor $Red
    exit 1
}

$gitignoreContent = Get-Content ".gitignore"
if ($gitignoreContent -match "\.env") {
    Write-Host "✅ .env está protegido no .gitignore" -ForegroundColor $Green
} else {
    Write-Host "⚠️  .env não está no .gitignore. Adicionando..." -ForegroundColor $Yellow
    Add-Content ".gitignore" ".env"
    Write-Host "✅ .env adicionado ao .gitignore" -ForegroundColor $Green
}

Write-Host ""

# PASSO 3: Configurar Git (primeira vez)
Write-Host "PASSO 3: Configurando Git..." -ForegroundColor $Yellow

$userName = git config user.name
$userEmail = git config user.email

if (-not $userName) {
    Write-Host "⚠️  Nome de usuário não configurado" -ForegroundColor $Yellow
    Write-Host ""
    Write-Host "Configure executando:" -ForegroundColor $Yellow
    Write-Host "  git config --global user.name 'Seu Nome'" -ForegroundColor $Yellow
    Write-Host "  git config --global user.email 'seu-email@github.com'" -ForegroundColor $Yellow
    Write-Host ""
    exit 1
} else {
    Write-Host "✅ Git configurado como: $userName ($userEmail)" -ForegroundColor $Green
}

Write-Host ""

# PASSO 4: Adicionar arquivos
Write-Host "PASSO 4: Adicionando arquivos..." -ForegroundColor $Yellow
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao adicionar arquivos!" -ForegroundColor $Red
    exit 1
}

Write-Host "✅ Arquivos adicionados" -ForegroundColor $Green
Write-Host ""

# PASSO 5: Mostrar status
Write-Host "PASSO 5: Status dos arquivos:" -ForegroundColor $Yellow
git status
Write-Host ""

# PASSO 6: Commit
Write-Host "PASSO 6: Fazendo commit..." -ForegroundColor $Yellow
git commit -m "$CommitMessage"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ℹ️  Nada para fazer commit (tudo já estava commitado)" -ForegroundColor $Yellow
} else {
    Write-Host "✅ Commit realizado" -ForegroundColor $Green
}

Write-Host ""

# PASSO 7: Configurar remote
Write-Host "PASSO 7: Configurando repositório remoto..." -ForegroundColor $Yellow

$remoteExists = git config --get remote.origin.url

if (-not $remoteExists) {
    if ([string]::IsNullOrEmpty($GithubUsername)) {
        Write-Host ""
        Write-Host "⚠️  Username do GitHub não fornecido!" -ForegroundColor $Yellow
        Write-Host ""
        Write-Host "Use o script assim:" -ForegroundColor $Yellow
        Write-Host "  .\upload-github.ps1 -GithubUsername seu-usuario-github" -ForegroundColor $Yellow
        Write-Host ""
        Write-Host "Ou configure manualmente:" -ForegroundColor $Yellow
        Write-Host "  git remote add origin https://github.com/SEU_USUARIO/edda-sistema.git" -ForegroundColor $Yellow
        Write-Host ""
        exit 1
    }
    
    $remoteUrl = "https://github.com/$GithubUsername/$RepositoryName.git"
    Write-Host "Adicionando remoto: $remoteUrl" -ForegroundColor $Yellow
    
    git remote add origin $remoteUrl
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao adicionar repositório remoto!" -ForegroundColor $Red
        exit 1
    }
    Write-Host "✅ Repositório remoto adicionado" -ForegroundColor $Green
} else {
    Write-Host "✅ Repositório remoto já existe: $remoteExists" -ForegroundColor $Green
}

Write-Host ""

# PASSO 8: Configurar branch
Write-Host "PASSO 8: Configurando branch..." -ForegroundColor $Yellow
git branch -M main
Write-Host "✅ Branch configurada como 'main'" -ForegroundColor $Green
Write-Host ""

# PASSO 9: Push
Write-Host "=========================================="
Write-Host "PASSO 9: Fazendo upload..." -ForegroundColor $Yellow
Write-Host "=========================================="
Write-Host ""

Write-Host "Executando: git push -u origin main" -ForegroundColor $Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=========================================="
    Write-Host "✅ SUCESSO! Projeto foi para o GitHub!" -ForegroundColor $Green
    Write-Host "=========================================="
    Write-Host ""
    Write-Host "Seu projeto está em:" -ForegroundColor $Green
    Write-Host "  https://github.com/$GithubUsername/$RepositoryName" -ForegroundColor $Yellow
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor $Green
    Write-Host "  1. Acesse o repositório no GitHub" -ForegroundColor $Green
    Write-Host "  2. Revise README.md" -ForegroundColor $Green
    Write-Host "  3. Adicione topics (tags)" -ForegroundColor $Green
    Write-Host "  4. Compartilhe em LinkedIn!" -ForegroundColor $Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer push!" -ForegroundColor $Red
    Write-Host ""
    Write-Host "Possíveis soluções:" -ForegroundColor $Yellow
    Write-Host "  1. Verificar permissões no GitHub" -ForegroundColor $Yellow
    Write-Host "  2. Verificar autenticação (SSH ou Token)" -ForegroundColor $Yellow
    Write-Host "  3. Revisar: https://github.com/settings/tokens" -ForegroundColor $Yellow
    Write-Host ""
    exit 1
}
