/**
 * Utilidades de notificação profissionais para produção
 * Substitui alert() por toast notifications
 */

import toast from 'react-hot-toast';

/**
 * Notificação de sucesso
 */
export const notifySuccess = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
      fontWeight: '500',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
};

/**
 * Notificação de erro
 */
export const notifyError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
      fontWeight: '500',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
};

/**
 * Notificação de informação
 */
export const notifyInfo = (message) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#3b82f6',
      color: '#fff',
      fontWeight: '500',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
};

/**
 * Notificação de aviso
 */
export const notifyWarning = (message) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#f59e0b',
      color: '#fff',
      fontWeight: '500',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
};

/**
 * Loading toast (não fecha automaticamente)
 */
export const notifyLoading = (message) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#6366f1',
      color: '#fff',
      fontWeight: '500',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
};

/**
 * Fechar um toast
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Notificação de confirmação com callback
 */
export const confirmAction = (title, onConfirm, onCancel) => {
  const toastId = toast((t) => (
    <div>
      <p style={{ marginBottom: '12px', fontWeight: '500' }}>{title}</p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          style={{
            background: '#10b981',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Confirmar
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onCancel?.();
          }}
          style={{
            background: '#6b7280',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: 'top-center',
    style: {
      background: '#1f2937',
      color: '#fff',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    },
  });

  return toastId;
};
