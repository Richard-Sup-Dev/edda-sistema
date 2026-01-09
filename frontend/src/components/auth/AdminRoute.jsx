// src/components/auth/AdminRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { notifyError } from '@/utils/notifications';
import { useEffect } from 'react';

/**
 * Componente para proteger rotas que só administradores podem acessar
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      notifyError('Acesso negado. Apenas administradores podem acessar esta página.');
    }
  }, [loading, user]);

  // Aguarda carregar dados do usuário
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Não autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Não é admin
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // É admin, renderiza o conteúdo
  return children;
}
