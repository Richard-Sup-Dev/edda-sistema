/**
 * Configuração do Swagger/OpenAPI para documentação da API
 */

const swaggerJsdoc = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EDDA Sistema API',
      version: '1.0.0',
      description: 'API REST para sistema de gestão de relatórios técnicos',
      contact: {
        name: 'EDDA Sistema',
        url: 'https://github.com/Richard-Sup-Dev/edda-sistema'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.seu-dominio.com',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint de login'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            details: {
              type: 'object',
              description: 'Detalhes adicionais do erro'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do usuário'
            },
            nome: {
              type: 'string',
              description: 'Nome completo do usuário'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'Papel do usuário no sistema'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            }
          }
        },
        Client: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do cliente'
            },
            nome: {
              type: 'string',
              description: 'Nome do cliente'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do cliente'
            },
            telefone: {
              type: 'string',
              description: 'Telefone do cliente'
            },
            endereco: {
              type: 'string',
              description: 'Endereço completo'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Part: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID da peça'
            },
            nome: {
              type: 'string',
              description: 'Nome da peça'
            },
            codigo: {
              type: 'string',
              description: 'Código único da peça'
            },
            preco: {
              type: 'number',
              format: 'float',
              description: 'Preço unitário'
            },
            quantidade_estoque: {
              type: 'integer',
              description: 'Quantidade em estoque'
            },
            descricao: {
              type: 'string',
              description: 'Descrição detalhada'
            }
          }
        },
        Service: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do serviço'
            },
            cliente_id: {
              type: 'integer',
              description: 'ID do cliente'
            },
            descricao: {
              type: 'string',
              description: 'Descrição do serviço'
            },
            status: {
              type: 'string',
              enum: ['pendente', 'em_andamento', 'concluido', 'cancelado'],
              description: 'Status do serviço'
            },
            data_inicio: {
              type: 'string',
              format: 'date-time'
            },
            data_fim: {
              type: 'string',
              format: 'date-time'
            },
            valor_total: {
              type: 'number',
              format: 'float'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticação'
      },
      {
        name: 'Users',
        description: 'Gerenciamento de usuários'
      },
      {
        name: 'Clients',
        description: 'Gerenciamento de clientes'
      },
      {
        name: 'Parts',
        description: 'Catálogo de peças'
      },
      {
        name: 'Services',
        description: 'Registro de serviços'
      },
      {
        name: 'Dashboard',
        description: 'Métricas e estatísticas'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/server.js']
};

export default swaggerJsdoc;
