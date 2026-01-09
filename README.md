# Sistema de Relatórios Técnicos

Sistema para gestão e geração de relatórios técnicos de manutenção.

## Funcionalidades

- Autenticação de usuários
- Gestão de clientes
- Criação de relatórios técnicos (Motor e Bomba)
- Upload de fotos
- Geração de PDF profissional
- Orçamentos (peças e serviços)
- Dashboard

## Stack

**Backend:** Node.js + Express + PostgreSQL + Sequelize  
**Frontend:** React + Vite + TailwindCSS

## Instalação

### Pré-requisitos
- Node.js 20+
- PostgreSQL 14+

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure o .env com suas credenciais
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Docker
```bash
docker-compose up -d
```

## Licença
MIT
