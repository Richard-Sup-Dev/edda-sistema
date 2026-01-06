#!/bin/bash

# ============================================
# DEPLOY SCRIPT - AUTOMATIZADO
# Build, Push e Up de Containers em Produção
# ============================================

set -e  # Exit se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# FUNÇÕES AUXILIARES
# ============================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# ============================================
# VALIDAÇÕES INICIAIS
# ============================================

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     EDDA RELATORIOS - DEPLOY SCRIPT       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Verificar Docker
if ! command_exists docker; then
    log_error "Docker não está instalado!"
    echo "  Instale com: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
    exit 1
fi
log_success "Docker encontrado: $(docker --version)"

# Verificar Docker Compose
if ! command_exists docker-compose; then
    log_error "Docker Compose não está instalado!"
    echo "  Instale com: sudo apt-get install docker-compose"
    exit 1
fi
log_success "Docker Compose encontrado: $(docker-compose --version)"

# Verificar se está na pasta correta
if [ ! -f "docker-compose.yml" ]; then
    log_error "docker-compose.yml não encontrado!"
    echo "  Execute este script na raiz do projeto onde está o docker-compose.yml"
    exit 1
fi
log_success "docker-compose.yml encontrado"

# Verificar arquivo .env
if [ ! -f ".env" ]; then
    log_warning ".env não encontrado, criando a partir do exemplo..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        log_info "Arquivo .env criado. EDITE COM SEUS VALORES ANTES DE CONTINUAR!"
        echo ""
        echo "   Variáveis críticas a configurar em .env:"
        echo "   - DB_PASSWORD (senha do PostgreSQL)"
        echo "   - JWT_SECRET (gere com: openssl rand -hex 32)"
        echo "   - ALLOWED_ORIGINS (seu domínio)"
        echo "   - FRONTEND_URL (seu domínio)"
        echo "   - EMAIL_USER (seu email)"
        echo "   - EMAIL_APP_PASS (sua senha)"
        echo ""
        read -p "Pressione Enter após configurar o .env ou Ctrl+C para cancelar..."
    else
        log_error ".env.example também não encontrado!"
        exit 1
    fi
fi
log_success ".env encontrado"

# ============================================
# FUNÇÃO: BUILD IMAGES
# ============================================

build_images() {
    echo ""
    log_info "Iniciando BUILD das imagens Docker..."
    echo ""
    
    docker-compose build --no-cache
    
    if [ $? -eq 0 ]; then
        log_success "Build completado com sucesso!"
    else
        log_error "Erro durante o build!"
        exit 1
    fi
}

# ============================================
# FUNÇÃO: PULL IMAGES (para registries)
# ============================================

pull_images() {
    echo ""
    log_info "Fazendo pull das imagens..."
    echo ""
    
    docker-compose pull
    
    if [ $? -eq 0 ]; then
        log_success "Pull completado!"
    else
        log_warning "Alguns pulls podem ter falhado (imagens locais serão usadas)"
    fi
}

# ============================================
# FUNÇÃO: START SERVICES
# ============================================

start_services() {
    echo ""
    log_info "Iniciando serviços..."
    echo ""
    
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        log_success "Serviços iniciados!"
        
        # Aguardar um pouco para os serviços ficarem prontos
        log_info "Aguardando serviços ficarem prontos (15 segundos)..."
        sleep 15
        
        # Verificar status
        echo ""
        log_info "Status dos containers:"
        docker-compose ps
    else
        log_error "Erro ao iniciar serviços!"
        exit 1
    fi
}

# ============================================
# FUNÇÃO: HEALTH CHECKS
# ============================================

health_checks() {
    echo ""
    log_info "Executando health checks..."
    echo ""
    
    # Check PostgreSQL
    log_info "Verificando PostgreSQL..."
    if docker-compose exec -T postgres pg_isready -U ${DB_USER:-edda_user} > /dev/null 2>&1; then
        log_success "PostgreSQL OK"
    else
        log_error "PostgreSQL não respondendo!"
    fi
    
    # Check Backend
    log_info "Verificando Backend..."
    if docker-compose exec -T backend curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        log_success "Backend OK"
    else
        log_warning "Backend ainda iniciando..."
    fi
    
    # Check Frontend
    log_info "Verificando Frontend..."
    if docker-compose exec -T frontend curl -s http://localhost/index.html > /dev/null 2>&1; then
        log_success "Frontend OK"
    else
        log_warning "Frontend ainda iniciando..."
    fi
}

# ============================================
# FUNÇÃO: LOGS
# ============================================

show_logs() {
    echo ""
    log_info "Exibindo últimos 50 linhas de logs..."
    echo ""
    
    echo -e "${BLUE}=== BACKEND ===${NC}"
    docker-compose logs --tail=50 backend
    
    echo ""
    echo -e "${BLUE}=== FRONTEND ===${NC}"
    docker-compose logs --tail=50 frontend
    
    echo ""
    echo -e "${BLUE}=== POSTGRES ===${NC}"
    docker-compose logs --tail=50 postgres
}

# ============================================
# FUNÇÃO: STOP SERVICES
# ============================================

stop_services() {
    echo ""
    log_info "Parando serviços..."
    echo ""
    
    docker-compose down
    
    if [ $? -eq 0 ]; then
        log_success "Serviços parados!"
    else
        log_error "Erro ao parar serviços!"
        exit 1
    fi
}

# ============================================
# FUNÇÃO: FULL DEPLOY
# ============================================

full_deploy() {
    echo ""
    log_info "Iniciando DEPLOY COMPLETO..."
    echo ""
    
    # Parar serviços atuais
    if docker-compose ps | grep -q "Up"; then
        log_warning "Serviços já estão rodando. Parando..."
        stop_services
        sleep 5
    fi
    
    # Build
    build_images
    
    # Start
    start_services
    
    # Health checks
    health_checks
    
    # Logs
    show_logs
}

# ============================================
# MENU PRINCIPAL
# ============================================

show_menu() {
    echo ""
    echo -e "${BLUE}Selecione uma opção:${NC}"
    echo ""
    echo "  1) Full Deploy (build + start + health check)"
    echo "  2) Build apenas"
    echo "  3) Iniciar serviços (sem build)"
    echo "  4) Parar serviços"
    echo "  5) Ver logs"
    echo "  6) Health checks"
    echo "  7) Sair"
    echo ""
    read -p "Opção: " choice
}

# ============================================
# EXECUÇÃO PRINCIPAL
# ============================================

if [ $# -eq 0 ]; then
    # Modo interativo
    while true; do
        show_menu
        case $choice in
            1) full_deploy ;;
            2) build_images ;;
            3) start_services ;;
            4) stop_services ;;
            5) show_logs ;;
            6) health_checks ;;
            7) log_info "Saindo..."; exit 0 ;;
            *) log_error "Opção inválida!" ;;
        esac
    done
else
    # Modo command-line
    case "$1" in
        build)
            build_images
            ;;
        start)
            start_services
            ;;
        deploy)
            full_deploy
            ;;
        stop)
            stop_services
            ;;
        logs)
            show_logs
            ;;
        health)
            health_checks
            ;;
        *)
            echo "Uso: $0 {build|start|deploy|stop|logs|health}"
            echo ""
            echo "  build   - Build das imagens Docker"
            echo "  start   - Iniciar serviços"
            echo "  deploy  - Deploy completo (recomendado)"
            echo "  stop    - Parar serviços"
            echo "  logs    - Exibir logs"
            echo "  health  - Health checks"
            exit 1
            ;;
    esac
fi
