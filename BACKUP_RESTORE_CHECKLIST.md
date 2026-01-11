# Checklist de Backup e Restore

## Backup
- [ ] Validar script de backup automático do banco (ex: `backend/scripts/backup-postgres.sh`)
- [ ] Testar backup manualmente semanalmente
- [ ] Armazenar backups em local seguro (cloud, S3, Google Drive, etc)
- [ ] Verificar logs de backup e alertas de falha

## Restore
- [ ] Testar restore em ambiente de homologação a cada sprint
- [ ] Documentar passo a passo de restore
- [ ] Validar integridade dos dados restaurados

## Checklist Rápido
- [ ] Backup diário agendado
- [ ] Notificação de falha de backup
- [ ] Backup criptografado
- [ ] Restore testado e documentado

## Exemplo de Restore
```bash
# Restaurar banco PostgreSQL
gunzip < backup.sql.gz | psql -U usuario -d banco
```
