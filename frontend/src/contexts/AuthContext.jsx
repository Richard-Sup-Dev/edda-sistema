// src/contexts/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { logger } from '@/config/api';
import { verificarVersaoToken, marcarVersaoToken } from '@/utils/tokenVersion';

// Cria o contexto
const AuthContext = createContext({});

// Provider principal
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica token ao carregar a página
  useEffect(() => {
    // Não usa mais localStorage para token, apenas para user (opcional)
    apiClient.get('/auth/me')
      .then((response) => {
        const userData = response.data.user || response.data;
        setUser(userData);
        marcarVersaoToken(); // Marca versão como válida
      })
      .catch((error) => {
        logger.error('Token validation failed:', error.response?.data || error.message);
        setUser(null);
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Função de login
  const login = async (email, senha) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        senha
      });
      const userData = response.data.user;
      setUser(userData);
      marcarVersaoToken();
      return { success: true };
    } catch (error) {
      const mensagem = error.response?.data?.erro || 'Erro ao fazer login';
      return { success: false, erro: mensagem };
    }
  };

  // Função de logout
  const logout = async () => {
    // Opcional: pode criar endpoint /auth/logout para limpar cookies no backend
    setUser(null);
    window.location.href = '/login';
  };

  // Verifica se é admin
  const isAdmin = user?.role === 'admin';

  // Verifica se é técnico (ou outro role futuro)
  const isTecnico = user?.role === 'tecnico' || isAdmin;

  // Valor fornecido pelo contexto
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isTecnico
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook customizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};