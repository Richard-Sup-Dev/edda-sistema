import { useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';

export function useWebSocket(enabled = true) {
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const reconnectTimeout = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const connect = useCallback(() => {
    if (!enabled) return;

    // Pegar token do localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      // Conectar com token na query string
      const wsUrl = `${WS_URL}?token=${token}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        toast.success('Conectado ao servidor de notificações em tempo real', {
          duration: 2000,
          icon: '🔔',
        });

        // Iniciar ping/pong para manter conexão viva
        startHeartbeat();
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          // Mensagem inválida ignorada
        }
      };

      ws.current.onerror = (error) => {
        // Erro de conexão
      };

      ws.current.onclose = (event) => {
        setIsConnected(false);
        stopHeartbeat();

        // Tentar reconectar após 5 segundos
        if (enabled && event.code !== 1000) {
          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, 5000);
        }
      };
    } catch (error) {
      // Error creating WebSocket - silent fail
    }
  }, [enabled]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close(1000, 'Client disconnect');
      ws.current = null;
    }
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    stopHeartbeat();
  }, []);

  const heartbeatInterval = useRef(null);

  const startHeartbeat = () => {
    heartbeatInterval.current = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        send({ type: 'ping' });
      }
    }, 30000); // A cada 30 segundos
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }
  };

  const send = useCallback((data) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
    // WebSocket não está aberto - ignorar mensagem
  }, []);

  const handleMessage = (data) => {
    setLastMessage(data);

    switch (data.type) {
      case 'connected':
        // WebSocket connection confirmed
        break;

      case 'notification':
        handleNotification(data.data);
        break;

      case 'activity':
        // Activity update received
        break;

      case 'broadcast':
        // Broadcast message received
        break;

      case 'online_users':
        setOnlineUsers(data.data || []);
        break;

      case 'pong':
        // Resposta ao ping
        break;

      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  };

  const handleNotification = (notification) => {
    // Mostrar toast de notificação
    const notifToast = toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="shrink-0 pt-0.5">
                <span className="text-2xl">
                  {notification.tipo === 'success' && '✅'}
                  {notification.tipo === 'warning' && '⚠️'}
                  {notification.tipo === 'error' && '❌'}
                  {notification.tipo === 'info' && '📢'}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.titulo || 'Notificação'}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.mensagem || ''}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-orange-600 hover:text-orange-500 focus:outline-none"
            >
              Fechar
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-right',
      }
    );

    // Reproduzir som de notificação (opcional)
    playNotificationSound();

    // Disparar evento customizado para outros componentes
    window.dispatchEvent(
      new CustomEvent('newNotification', { detail: notification })
    );
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch((e) => console.log('Could not play sound:', e));
    } catch (error) {
      // Ignorar erro de som
    }
  };

  // Conectar ao montar, desconectar ao desmontar
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    onlineUsers,
    send,
    reconnect: connect,
  };
}
