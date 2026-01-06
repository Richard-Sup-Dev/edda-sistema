# ============================================
# FRONTEND DOCKERFILE - MULTISTAGE BUILD
# React + Vite servido via Nginx
# ============================================

# STAGE 1: BUILDER
# Constrói a aplicação React com Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação Vite
# Isso gera a pasta dist/ pronta para produção
RUN npm run build

# STAGE 2: RUNTIME
# Nginx para servir arquivos estáticos otimizados
FROM nginx:alpine

# Dados de manutenção
LABEL maintainer="EDDA Relatorios"
LABEL version="1.0"
LABEL description="Frontend EDDA - React + Vite servido via Nginx"

# Remover configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copiar arquivos compilados do builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/index.html || exit 1

# Comando padrão do nginx
CMD ["nginx", "-g", "daemon off;"]
