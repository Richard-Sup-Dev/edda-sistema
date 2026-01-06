# ============================================
# BACKEND DOCKERFILE - MULTISTAGE BUILD
# Node.js + Express + PostgreSQL
# ============================================

# STAGE 1: BUILDER
# Instala dependências e prepara o código
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar apenas package.json e package-lock.json (se houver)
COPY package*.json ./

# Instalar dependências em modo produção
# --only=production para remover devDependencies no final
RUN npm ci --only=production && \
    npm cache clean --force

# STAGE 2: RUNTIME
# Imagem final enxuta apenas com código necessário
FROM node:20-alpine

# Dados de manutenção
LABEL maintainer="EDDA Relatorios"
LABEL version="1.0"
LABEL description="Backend EDDA - API REST com Express"

WORKDIR /app

# Variáveis de ambiente padrão (podem ser sobrescritas no docker-compose ou na execução)
ENV NODE_ENV=production \
    PORT=3001 \
    NODE_OPTIONS="--max-old-space-size=512"

# Copiar node_modules do builder (cache otimizado)
COPY --from=builder /app/node_modules ./node_modules

# Copiar código da aplicação
COPY src ./src
COPY package*.json ./

# Criar diretório para uploads
RUN mkdir -p /app/uploads/nfs && \
    chmod -R 755 /app/uploads

# Expor porta (referência, não abre porta automaticamente)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Usuário não-root por segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Comando para iniciar a aplicação
CMD ["node", "src/server.js"]
