// backend/src/services/websocketService.js
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // userId -> Set of WebSocket connections
  }

  initialize(server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws, request) => {
      this.handleConnection(ws, request);
    });

    logger.info('WebSocket server initialized');
  }

  handleConnection(ws, request) {
    // Autenticar via token no query string
    const url = new URL(request.url, `http://${request.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(1008, 'Token não fornecido');
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Adicionar cliente ao mapa
      if (!this.clients.has(userId)) {
        this.clients.set(userId, new Set());
      }
      this.clients.get(userId).add(ws);

      logger.info(`Cliente ${userId} conectado via WebSocket`);

      // Enviar mensagem de boas-vindas
      this.sendToClient(ws, {
        type: 'connected',
        message: 'Conectado ao servidor de notificações',
        timestamp: new Date().toISOString(),
      });

      // Handlers
      ws.on('message', (message) => {
        this.handleMessage(ws, userId, message);
      });

      ws.on('close', () => {
        this.handleDisconnect(userId, ws);
      });

      ws.on('error', (error) => {
        logger.error(`WebSocket error for user ${userId}:`, error);
      });
    } catch (error) {
      logger.error('WebSocket authentication failed:', error);
      ws.close(1008, 'Autenticação falhou');
    }
  }

  handleMessage(ws, userId, message) {
    try {
      const data = JSON.parse(message.toString());
      
      switch (data.type) {
        case 'ping':
          this.sendToClient(ws, { type: 'pong', timestamp: new Date().toISOString() });
          break;
        
        case 'subscribe':
          // Implementar lógica de subscrição a canais específicos
          break;
        
        default:
          logger.warn(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      logger.error('Error handling WebSocket message:', error);
    }
  }

  handleDisconnect(userId, ws) {
    if (this.clients.has(userId)) {
      this.clients.get(userId).delete(ws);
      if (this.clients.get(userId).size === 0) {
        this.clients.delete(userId);
      }
    }
    logger.info(`Cliente ${userId} desconectado`);
  }

  sendToClient(ws, data) {
    if (ws.readyState === 1) { // OPEN
      ws.send(JSON.stringify(data));
    }
  }

  // Enviar notificação para um usuário específico
  sendNotificationToUser(userId, notification) {
    const userConnections = this.clients.get(userId);
    if (userConnections) {
      userConnections.forEach((ws) => {
        this.sendToClient(ws, {
          type: 'notification',
          data: notification,
          timestamp: new Date().toISOString(),
        });
      });
      logger.info(`Notification sent to user ${userId}`);
    }
  }

  // Enviar notificação para múltiplos usuários
  sendNotificationToUsers(userIds, notification) {
    userIds.forEach((userId) => {
      this.sendNotificationToUser(userId, notification);
    });
  }

  // Broadcast para todos os usuários conectados
  broadcast(data) {
    this.clients.forEach((connections, userId) => {
      connections.forEach((ws) => {
        this.sendToClient(ws, {
          type: 'broadcast',
          data,
          timestamp: new Date().toISOString(),
        });
      });
    });
    logger.info('Broadcast message sent to all clients');
  }

  // Enviar update de atividade
  sendActivityUpdate(userId, activity) {
    this.sendNotificationToUser(userId, {
      type: 'activity',
      data: activity,
    });
  }

  // Obter número de usuários online
  getOnlineCount() {
    return this.clients.size;
  }

  // Obter lista de usuários online
  getOnlineUsers() {
    return Array.from(this.clients.keys());
  }
}

// Singleton instance
const websocketService = new WebSocketService();

export default websocketService;
