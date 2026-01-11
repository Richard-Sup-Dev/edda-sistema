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
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setUser(null);
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return;
    }
    apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        const userData = response.data.user || response.data;
        setUser(userData);
        marcarVersaoToken();
      })
      .catch((error) => {
        logger.error('Token validation failed:', error.response?.data || error.message);
        setUser(null);
        localStorage.removeItem('token');
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
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
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
    setUser(null);
    localStorage.removeItem('token');
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