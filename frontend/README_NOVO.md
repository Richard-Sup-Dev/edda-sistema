# EDDA Frontend - Interface do Sistema

Aplicação React moderna para a plataforma EDDA de gestão de relatórios técnicos.

## Desenvolvimento

### Requisitos
- Node.js 18+
- npm ou yarn

### Setup

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Pré-visualizar build
npm run preview
```

### Tecnologias

- **React 19** - Biblioteca UI moderna
- **Vite** - Build tool rápido
- **TailwindCSS** - Utility-first CSS
- **React Router** - Navegação entre páginas
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos e visualizações
- **Framer Motion** - Animações suaves

## Estrutura de Componentes

```
src/
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas principais
├── hooks/          # Hooks customizados
├── constants/      # Constantes globais
├── App.jsx         # Componente raiz
└── main.jsx        # Ponto de entrada
```

## Variáveis de Ambiente

Crie `.env.local`:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=EDDA Sistema
```

## Deploy

O build está pronto para ser servido em qualquer servidor web estático:

```bash
npm run build
# Os arquivos estão em dist/
```
