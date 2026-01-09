# Health Checks - Sistema EDDA

## Visão Geral

O sistema EDDA agora possui endpoints de health check para monitoramento, orquestração Kubernetes e balanceamento de carga.

## Endpoints Disponíveis

### 1. `/health/ping` - Ping Básico
**Descrição**: Verifica se a API está respondendo (sempre retorna 200)
**Uso**: ALB/ELB básicos, monitoramento simples
**Resposta**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-09T09:49:00.000Z",
  "uptime": 123.456
}
```

### 2. `/health/live` - Liveness Probe (Kubernetes)
**Descrição**: Verifica se a aplicação está viva (processo funcionando)
**Uso**: Kubernetes liveness probe - se falhar, reinicia o pod
**Comportamento**:
- ✅ **200 OK**: Aplicação está viva
- ❌ **503 Service Unavailable**: Aplicação não está funcionando (Kubernetes reinicia)

**Resposta**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-09T09:49:00.000Z",
  "uptime": 123.456
}
```

**Configuração Kubernetes**:
```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3001
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

### 3. `/health/ready` - Readiness Probe (Kubernetes)
**Descrição**: Verifica se a aplicação está pronta para receber tráfego
**Uso**: Kubernetes readiness probe - se falhar, remove do load balancer
**Verifica**:
- ✅ Conexão PostgreSQL
- ✅ Conexão Redis
- ✅ Status geral (all checks)

**Comportamento**:
- ✅ **200 OK**: Todos os serviços estão operacionais, pronto para tráfego
- ❌ **503 Service Unavailable**: Dependências falhando, NÃO aceitar tráfego

**Resposta (Sucesso)**:
```json
{
  "status": "ready",
  "timestamp": "2026-01-09T09:49:00.000Z",
  "checks": {
    "database": true,
    "redis": true,
    "overall": true
  }
}
```

**Resposta (Falha)**:
```json
{
  "status": "not ready",
  "timestamp": "2026-01-09T09:49:00.000Z",
  "checks": {
    "database": false,
    "redis": false,
    "overall": false
  },
  "errors": [
    "Database: Connection timeout",
    "Redis: ECONNREFUSED"
  ]
}
```

**Configuração Kubernetes**:
```yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 3001
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  successThreshold: 1
  failureThreshold: 3
```

### 4. `/health` - Diagnóstico Detalhado
**Descrição**: Retorna informações completas sobre saúde do sistema
**Uso**: Monitoramento, debugging, Grafana/Prometheus
**Verifica**:
- ✅ PostgreSQL (com latência)
- ✅ Redis (com latência)
- ✅ Versão da aplicação
- ✅ Ambiente (dev/prod)
- ✅ Uptime

**Resposta**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-09T09:49:00.000Z",
  "uptime": 123.456,
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": {
      "status": "healthy",
      "latency": 12
    },
    "redis": {
      "status": "healthy",
      "latency": 3
    }
  }
}
```

**Status Possíveis**:
- `healthy` - Todos os serviços OK (200)
- `degraded` - Alguns serviços falhando (Redis down, mas DB OK) (200)
- `unhealthy` - Serviços críticos falhando (503)

## Uso em Produção

### Docker Compose Healthcheck
```yaml
services:
  backend:
    image: edda-backend:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health/live"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Kubernetes Deployment Completo
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: edda-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: edda-backend
  template:
    metadata:
      labels:
        app: edda-backend
    spec:
      containers:
      - name: backend
        image: edda-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 3
```

### AWS ALB Target Group
```json
{
  "HealthCheckEnabled": true,
  "HealthCheckPath": "/health/ready",
  "HealthCheckProtocol": "HTTP",
  "HealthCheckTimeoutSeconds": 5,
  "HealthCheckIntervalSeconds": 30,
  "HealthyThresholdCount": 2,
  "UnhealthyThresholdCount": 3,
  "Matcher": {
    "HttpCode": "200"
  }
}
```

### Prometheus Monitoring
```yaml
scrape_configs:
  - job_name: 'edda-backend'
    scrape_interval: 15s
    metrics_path: '/health'
    static_configs:
      - targets: ['backend:3001']
```

## Testes

Todos os endpoints possuem testes automatizados em [backend/src/__tests__/health-endpoints.test.js](../src/__tests__/health-endpoints.test.js).

Para executar:
```bash
npm test health-endpoints.test.js
```

**Resultado**: ✅ 5/5 testes passando

## Benefícios

1. **Alta Disponibilidade**: Kubernetes remove automaticamente pods não-saudáveis do load balancer
2. **Auto-recuperação**: Liveness probe reinicia pods travados
3. **Zero Downtime**: Readiness probe garante que apenas instâncias prontas recebem tráfego
4. **Monitoramento**: Diagnóstico detalhado facilita troubleshooting
5. **Observabilidade**: Métricas de latência para análise de performance

## Próximos Passos

- [ ] Integrar com Grafana para dashboards
- [ ] Adicionar mais checks (disco, memória, CPU)
- [ ] Métricas Prometheus format (`/metrics`)
- [ ] Alertas automáticos (PagerDuty, Slack)
