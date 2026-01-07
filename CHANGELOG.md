# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Não Lançado]

### Planejado
- Sistema de notificações em tempo real
- Exportação de relatórios em PDF
- Integração com sistemas de pagamento
- Dashboard customizável por usuário
- Migração para TypeScript (frontend e backend)

## [1.2.0] - 2026-01-06

### Adicionado
- 📄 **Licença MIT** (mais amigável para open source)
- 🏷️ **Badges adicionais** no README (CI/CD, Tests, PRs Welcome)
- 📸 **Seção de Screenshots** no README (com placeholders)
- 🚀 **Guia Completo de Deploy em VPS** ([GUIA_DEPLOY_VPS.md](./docs/GUIA_DEPLOY_VPS.md))
  - Instruções para DigitalOcean, Hetzner, Railway, Render, AWS
  - Configuração de SSL/HTTPS
  - Backup automático
  - Monitoramento e troubleshooting
  - Comparação de custos
- 🗺️ **Roadmap de Features** públicas no README
  - Versões planejadas 1.2 e 2.0
  - Exportação PDF, Notificações, Multi-tenant, etc.

### Modificado
- Licença alterada de ISC para MIT em todos os arquivos
- README reorganizado com seção de deploy
- Links para documentação melhorados

## [1.1.0] - 2026-01-06

### Adicionado
- 🚀 **CI/CD Pipeline** com GitHub Actions
  - Testes automatizados em cada push/PR
  - Verificação de qualidade de código (linting)
  - Build e teste de imagens Docker
  - Auditoria de segurança automática
  - Relatórios de cobertura de testes
- 📚 **Documentação da API** com Swagger/OpenAPI
  - Interface interativa em `/api-docs`
  - Especificação completa de todos os endpoints
  - Modelos de dados documentados
  - Autenticação JWT documentada
  - Exemplos de requisições e respostas
- Badges no README (License, Node, React, PostgreSQL, Docker)

### Modificado
- README melhorado com links para documentação
- URLs do repositório corrigidas
- Estrutura de documentação reorganizada

## [1.0.0] - 2026-01-06

### Organizacional
- Reorganização da estrutura do repositório
- Documentação movida para pasta `docs/`
- Remoção de arquivos redundantes e temporários
- Adição de badges ao README
- Melhoria na documentação principal

### Adicionado
- Sistema completo de gestão de relatórios técnicos
- Dashboard interativo com métricas e gráficos
- CRUD completo de clientes
- Catálogo de peças com controle de inventário
- Registro detalhado de serviços
- Sistema de autenticação JWT com roles
- Validação de dados no servidor
- Interface responsiva com TailwindCSS
- 34+ testes automatizados
- Rate limiting avançado
- Integração com Sentry para monitoramento
- Logging estruturado com Winston
- Docker e Docker Compose para deploy
- Nginx como reverse proxy

### Backend
- API RESTful com Node.js e Express
- Banco de dados PostgreSQL
- Middleware de autenticação e autorização
- Validação de entrada de dados
- Tratamento centralizado de erros
- Sistema de logs estruturado
- Testes unitários e de integração

### Frontend
- Interface React 19 com Vite
- Componentes reutilizáveis
- Hooks customizados para estado
- Integração com API via Axios
- Gráficos interativos com Recharts
- Design responsivo

### Segurança
- Autenticação JWT
- Hash de senhas com bcrypt
- Validação de CORS
- Sanitização de inputs
- Rate limiting
- Variáveis de ambiente
- HTTPS ready

### Infraestrutura
- Docker para desenvolvimento e produção
- Docker Compose para orquestração
- Nginx para servir frontend e proxy reverso
- Scripts de deploy automatizados
- Configuração de CI/CD ready

## [0.1.0] - 2026-01-05

### Adicionado
- Configuração inicial do projeto
- Estrutura básica do backend
- Estrutura básica do frontend
- Configuração do Docker
- Documentação inicial

---

## Tipos de Mudanças

- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Descontinuado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correção de bugs
- **Segurança** para vulnerabilidades

[Não Lançado]: https://github.com/Richard-Sup-Dev/edda-sistema/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Richard-Sup-Dev/edda-sistema/releases/tag/v1.0.0
[0.1.0]: https://github.com/Richard-Sup-Dev/edda-sistema/releases/tag/v0.1.0
