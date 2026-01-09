import { memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Check, Clock, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from '@/utils/dateUtils';

const NotificationPanel = memo(function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  loading,
}) {
  const getIcon = useCallback((type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  }, []);

  const getBgColor = useCallback((type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.lida).length,
    [notifications]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-60"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-70 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-6 h-6 text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-800">Notificações</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Marcar todas como lidas
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Nenhuma notificação</p>
                  <p className="text-sm text-gray-400 mt-1">Você está em dia! 🎉</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      notification.lida
                        ? 'bg-white border-gray-100 opacity-60'
                        : getBgColor(notification.tipo)
                    }`}
                    onClick={() => !notification.lida && onMarkAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="shrink-0 mt-1">
                        {getIcon(notification.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {notification.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.mensagem}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {notification.createdAt
                              ? formatDistanceToNow(new Date(notification.createdAt))
                              : 'Agora'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default NotificationPanel;
