# 🚀 Quick Start - Sistema de Relatórios

Guia rápido para colocar o sistema no ar em menos de 5 minutos!

## ✅ Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Opcional (para cache)
- **Redis** ([Download](https://redis.io/download))

---

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/sistema-relatorios.git
cd sistema-relatorios
```

# 🚀 Quick Start - Sistema de Relatórios

Guia rápido para rodar o sistema localmente em minutos.

## Pré-requisitos
- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- Git ([Download](https://git-scm.com/))

## Instalação Rápida
```bash
git clone https://github.com/Richard-Sup-Dev/edda-sistema.git
cd edda-sistema
# Backend
cd backend && npm install && cp .env.example .env
# Configure o .env e rode:
npm run migrate && npm run seed && npm start
# Frontend
cd ../frontend && npm install && npm run dev
```

## Primeiro Acesso
1. Crie um usuário admin (veja instrução no README ou scripts do backend)
2. Acesse http://localhost:5173 (ou porta do Vite)

## Testes
```bash
# Backend
cd backend && npm test
# Frontend
cd frontend && npm run test
```

---
Para detalhes, troubleshooting e comandos avançados, consulte o [README.md](README.md) e o [guia de deploy](DEPLOY.md).
# Inicie o servidor
