// src/components/ProtectedRoute.jsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();

  // Enquanto carrega o auth (verifica token), mostra loading ou nada
  if (loading) {
    return <div>Carregando autenticação...</div>; // Ou um spinner bonito
  }

  // Não autenticado → redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se não especificou roles → qualquer usuário logado pode acessar
  if (allowedRoles.length === 0) {
    return <Outlet />;
  }

  // Verifica se o usuário tem uma das roles permitidas
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />; // Ou uma página de "Acesso negado"
  }

  // Tudo ok → renderiza as rotas filhas
  return <Outlet />;
}