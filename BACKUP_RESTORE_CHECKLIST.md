
# Checklist de Backup e Restore

## Backup
- [ ] Script de backup automático validado (`backend/scripts/backup-postgres.sh`)
- [ ] Backup manual testado semanalmente
- [ ] Backups armazenados em local seguro (cloud, S3, etc)
- [ ] Logs e alertas de falha revisados

## Restore
- [ ] Restore testado em ambiente de homologação
- [ ] Passo a passo documentado
- [ ] Integridade dos dados restaurados validada

## Checklist Rápido
- [ ] Backup diário agendado
- [ ] Notificação de falha ativa
- [ ] Backup criptografado
- [ ] Restore testado e documentado

## Exemplo de Restore
```bash
gunzip < backup.sql.gz | psql -U usuario -d banco
```
