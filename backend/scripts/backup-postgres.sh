#!/bin/bash

# ============================================================
# SCRIPT DE BACKUP AUTOMÁTICO DO POSTGRESQL
# ============================================================
# Local: /usr/local/bin/backup-edda-postgres.sh
# Uso: ./backup-edda-postgres.sh
# Crontab: 0 6,14,22 * * * /usr/local/bin/backup-edda-postgres.sh
# ============================================================

set -e  # Exit on error

# Configurações
BACKUP_DIR="/var/backups/edda-database"
DATABASE_NAME="${DB_NAME:-edda_db}"
POSTGRES_USER="${DB_USER:-postgres}"
RETENTION_DAYS=30  # Manter 30 dias de backups
LOG_FILE="/var/log/edda-backup.log"
DOCKER_CONTAINER="postgres"  # Nome do container Docker
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sql"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'  # No Color

# Função de logging
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_error() {
  echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ ERRO: $1${NC}" | tee -a "$LOG_FILE"
}

log_success() {
  echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
  echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  AVISO: $1${NC}" | tee -a "$LOG_FILE"
}

# Verificar se o diretório de backups existe
if [ ! -d "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR"
  log "Criado diretório de backups: $BACKUP_DIR"
fi

# Verificar se o container Docker está rodando
if ! docker ps | grep -q "$DOCKER_CONTAINER"; then
  log_error "Container Docker '$DOCKER_CONTAINER' não está rodando"
  exit 1
fi

log "Iniciando backup do banco de dados: $DATABASE_NAME"

# Fazer dump do banco de dados
if docker exec "$DOCKER_CONTAINER" pg_dump \
  -U "$POSTGRES_USER" \
  "$DATABASE_NAME" > "$BACKUP_FILE"; then
  
  # Comprimir o backup
  gzip "$BACKUP_FILE"
  BACKUP_FILE="${BACKUP_FILE}.gz"
  
  # Obter tamanho do arquivo
  FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  
  log_success "Backup concluído com sucesso"
  log "Arquivo: $BACKUP_FILE"
  log "Tamanho: $FILE_SIZE"
  
  # Remover backups antigos
  log "Limpando backups antigos (retendo $RETENTION_DAYS dias)..."
  DELETED_COUNT=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete -print | wc -l)
  
  if [ $DELETED_COUNT -gt 0 ]; then
    log "Removidos $DELETED_COUNT backups antigos"
  fi
  
  # Verificar espaço em disco
  DISK_USAGE=$(df -h "$BACKUP_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')
  
  if [ $DISK_USAGE -gt 80 ]; then
    log_warning "Uso de disco acima de 80% ($DISK_USAGE%)"
  else
    log "Uso de disco: ${DISK_USAGE}%"
  fi
  
  # Enviar alerta se configurado
  if [ -n "$ALERT_EMAIL" ]; then
    echo "Backup realizado com sucesso: $FILE_SIZE" | \
    mail -s "✅ Backup EDDA - $TIMESTAMP" "$ALERT_EMAIL"
  fi
  
else
  log_error "Falha ao fazer dump do banco de dados"
  
  # Enviar alerta de erro
  if [ -n "$ALERT_EMAIL" ]; then
    echo "FALHA ao fazer backup do banco de dados" | \
    mail -s "❌ Backup EDDA FALHOU - $TIMESTAMP" "$ALERT_EMAIL"
  fi
  
  exit 1
fi

log "Backup finalizado"
