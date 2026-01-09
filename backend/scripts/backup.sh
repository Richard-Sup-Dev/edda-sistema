#!/bin/bash

# ============================================
# SCRIPT DE BACKUP AUTOMATIZADO - PostgreSQL
# Sistema EDDA
# ============================================

# Configurações
DB_NAME="${DB_NAME:-edda_db}"
DB_USER="${DB_USER:-edda_user}"
DB_PASSWORD="${DB_PASSWORD:-edda_password}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

BACKUP_DIR="/var/backups/edda"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${TIMESTAMP}.sql.gz"

# Retenção (dias)
RETENTION_DAYS=30

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# FUNÇÕES
# ============================================

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

# Verificar se o diretório de backup existe
check_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        log "Criando diretório de backup: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
        if [ $? -ne 0 ]; then
            error "Falha ao criar diretório de backup"
            exit 1
        fi
    fi
}

# Realizar backup do banco de dados
perform_backup() {
    log "Iniciando backup do banco de dados: $DB_NAME"
    
    export PGPASSWORD="$DB_PASSWORD"
    
    # Dump do banco com compressão
    pg_dump -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            -F c \
            -b \
            -v \
            -f "${BACKUP_FILE%.gz}" \
            "$DB_NAME" 2>&1
    
    if [ $? -eq 0 ]; then
        # Comprimir backup
        gzip "${BACKUP_FILE%.gz}"
        
        if [ $? -eq 0 ]; then
            FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
            log "✅ Backup concluído com sucesso!"
            log "   Arquivo: $BACKUP_FILE"
            log "   Tamanho: $FILESIZE"
            
            # Enviar notificação (opcional)
            send_notification "success" "Backup realizado com sucesso" "$FILESIZE"
        else
            error "Falha na compressão do backup"
            return 1
        fi
    else
        error "Falha ao criar backup do banco de dados"
        return 1
    fi
    
    unset PGPASSWORD
}

# Limpar backups antigos
cleanup_old_backups() {
    log "Limpando backups com mais de $RETENTION_DAYS dias..."
    
    OLD_BACKUPS=$(find "$BACKUP_DIR" -name "backup_${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS)
    
    if [ -z "$OLD_BACKUPS" ]; then
        log "Nenhum backup antigo para remover"
    else
        echo "$OLD_BACKUPS" | while read -r backup; do
            log "Removendo: $(basename "$backup")"
            rm -f "$backup"
        done
        log "✅ Limpeza concluída"
    fi
}

# Listar backups existentes
list_backups() {
    log "Backups disponíveis:"
    find "$BACKUP_DIR" -name "backup_${DB_NAME}_*.sql.gz" -type f -exec ls -lh {} \; | awk '{print "  " $9 " (" $5 ")"}'
}

# Verificar integridade do backup
verify_backup() {
    log "Verificando integridade do backup..."
    
    if gzip -t "$BACKUP_FILE" 2>/dev/null; then
        log "✅ Backup íntegro"
        return 0
    else
        error "❌ Backup corrompido!"
        return 1
    fi
}

# Enviar notificação (via webhook, email, etc)
send_notification() {
    local status=$1
    local message=$2
    local details=$3
    
    # Exemplo: enviar para webhook
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
             -H "Content-Type: application/json" \
             -d "{\"status\":\"$status\",\"message\":\"$message\",\"details\":\"$details\"}" \
             >/dev/null 2>&1
    fi
    
    # Exemplo: enviar email (requer mailutils ou sendmail)
    # echo "$message - $details" | mail -s "Backup EDDA - $status" admin@example.com
}

# Upload para cloud storage (opcional)
upload_to_cloud() {
    log "Fazendo upload para cloud storage..."
    
    # AWS S3
    if [ -n "$AWS_S3_BUCKET" ]; then
        aws s3 cp "$BACKUP_FILE" "s3://${AWS_S3_BUCKET}/backups/" && \
        log "✅ Upload para S3 concluído"
    fi
    
    # Google Cloud Storage
    if [ -n "$GCS_BUCKET" ]; then
        gsutil cp "$BACKUP_FILE" "gs://${GCS_BUCKET}/backups/" && \
        log "✅ Upload para GCS concluído"
    fi
    
    # Azure Blob Storage
    if [ -n "$AZURE_CONTAINER" ]; then
        az storage blob upload \
           --account-name "$AZURE_ACCOUNT" \
           --container-name "$AZURE_CONTAINER" \
           --name "backups/$(basename "$BACKUP_FILE")" \
           --file "$BACKUP_FILE" && \
        log "✅ Upload para Azure concluído"
    fi
}

# ============================================
# EXECUÇÃO PRINCIPAL
# ============================================

main() {
    log "=========================================="
    log "EDDA - Backup Automatizado do Banco de Dados"
    log "=========================================="
    
    # Verificar dependências
    if ! command -v pg_dump &> /dev/null; then
        error "pg_dump não encontrado. Instale o PostgreSQL client."
        exit 1
    fi
    
    # Criar diretório de backup
    check_backup_dir
    
    # Realizar backup
    if perform_backup; then
        # Verificar integridade
        verify_backup
        
        # Upload para cloud (se configurado)
        if [ -n "$AWS_S3_BUCKET" ] || [ -n "$GCS_BUCKET" ] || [ -n "$AZURE_CONTAINER" ]; then
            upload_to_cloud
        fi
        
        # Limpar backups antigos
        cleanup_old_backups
        
        # Listar backups
        list_backups
        
        log "=========================================="
        log "✅ Processo de backup concluído com sucesso!"
        log "=========================================="
        
        exit 0
    else
        error "Backup falhou!"
        send_notification "error" "Backup falhou" "Verifique os logs"
        exit 1
    fi
}

# Executar
main "$@"
