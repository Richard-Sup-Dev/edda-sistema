# Política de Segurança

## Reportando Vulnerabilidades

**Não abra uma issue pública para problemas de segurança!**

Se você descobrir uma vulnerabilidade de segurança, por favor envie um email para [seu-email@dominio.com] em vez de usar o rastreador de issues.

Inclua:

- Descrição da vulnerabilidade
- Passos para reproduzir
- Potencial impacto
- Sugestão de correção (se houver)

Você receberá uma resposta em até 48 horas.

## Práticas de Segurança Implementadas

### Autenticação
- JWT (JSON Web Tokens) para autenticação stateless
- Tokens expiráveis
- Refresh tokens para renovação segura

### Senhas
- Hasheadas com bcrypt (salt rounds: 10)
- Nunca armazenadas em texto plano
- Validação de força de senha

### Dados Sensíveis
- Variáveis de ambiente para credenciais
- `.env` não é versionado
- Sanitização de entrada em todos os endpoints

### Rate Limiting
- Limite geral: 100 requisições por IP a cada 15 minutos
- Limite de autenticação: 5 tentativas por IP a cada 15 minutos
- Proteção contra brute force

### Headers de Segurança
- Helmet.js configurado
- HSTS habilitado em produção
- X-Frame-Options para prevenir clickjacking
- X-Content-Type-Options para prevenir MIME sniffing

### CORS
- Configurável por variável de ambiente
- Restrito a origens específicas
- Métodos HTTP limitados

### SQL Injection
- Prepared statements com Sequelize
- Validação de entrada com Joi
- Sanitização de queries

### Logging
- Erros registrados estruturadamente
- Dados sensíveis não são logados
- Logs armazenados em arquivos rotacionados

## Dependências

- Mantenha npm atualizado: `npm update`
- Verifique vulnerabilidades: `npm audit`
- Corrija issues críticas imediatamente

## Deployment

### Em Produção

- Use HTTPS/SSL obrigatoriamente
- Configure CORS para domínios específicos
- Use variáveis de ambiente para credenciais
- Mantenha senhas de banco de dados complexas
- Revise logs regularmente
- Faça backup do banco de dados frequentemente

### Banco de Dados

- Use conexões SSL quando possível
- Limite permissões do usuário DB
- Faça backups regulares
- Teste restauração de backups periodicamente

## Atualizações de Segurança

Atualizações críticas de segurança serão:

- Corrigidas imediatamente
- Lançadas como patch version
- Comunicadas via security advisories

## Conformidade

O EDDA segue as melhores práticas de segurança web, incluindo:

- OWASP Top 10
- CWE (Common Weakness Enumeration)
- Práticas recomendadas da comunidade Node.js

---

Obrigado por ajudar a manter o EDDA seguro! 🔒
