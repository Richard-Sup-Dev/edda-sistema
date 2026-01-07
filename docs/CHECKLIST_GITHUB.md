# Checklist para Publicar no GitHub

Antes de fazer push para o GitHub, verifique se tudo está correto:

## Segurança

- [ ] `.env` contém apenas variáveis de desenvolvimento local
- [ ] `.env` não será versionado (verificar .gitignore)
- [ ] Nenhum arquivo com credenciais sensíveis
- [ ] `package.json` não contém segredos
- [ ] Nenhum token API, chave privada ou senha no código
- [ ] `.gitignore` está configurado corretamente
- [ ] `.env.example` contém placeholders seguros

## Documentação

- [ ] README.md é claro e atualizado
- [ ] CONTRIBUTING.md explica como contribuir
- [ ] SECURITY.md descreve políticas de segurança
- [ ] Instruções de setup são precisas
- [ ] Exemplos de código funcionam
- [ ] Variáveis de ambiente estão documentadas

## Código

- [ ] Sem console.logs de debug desnecessários
- [ ] Sem console.logs com dados sensíveis
- [ ] Sem TODOs embaraçosos ou comentários pessoais
- [ ] Sem arquivos temporários (.tmp, .bak)
- [ ] Sem arquivos compilados ou gerados
- [ ] Sem dependências não usadas

## Projeto

- [ ] `package.json` contém descrição apropriada
- [ ] Nome do projeto é profissional
- [ ] License definida (ISC, MIT, etc)
- [ ] Keywords relevantes adicionadas
- [ ] Versão sensata (1.0.0 ou similar)

## Estrutura

- [ ] Sem arquivos desnecessários
- [ ] Pastas organizadas logicamente
- [ ] Sem arquivos grandes que não devem estar no repo
- [ ] Docker files prontos para produção
- [ ] Configuração está externalizada em .env

## Teste Local

```bash
# Remover .env antes de testar
rm .env

# Verificar que repo está limpo
git status

# Construir projeto
docker-compose up -d
docker-compose down

# Não deve haver erros
```

## Último Passo

Antes de fazer `git push`:

```bash
# Verificar o que será enviado
git diff --cached

# Revisar último commit
git log --oneline -5

# Tem certeza?
git push
```

---

✅ Se todos os itens estão marcados, seu projeto está pronto para o GitHub!
