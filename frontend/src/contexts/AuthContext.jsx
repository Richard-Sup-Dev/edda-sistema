// src/contexts/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, logger } from '@/config/api';

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
      return;
    }

    // Configura o header padrão para todas as requisições futuras
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Valida o token com /api/auth/me
    axios.get(API_ENDPOINTS.AUTH_ME)
      .then((response) => {
        const userData = response.data.user || response.data;
        setUser(userData);
      })
      .catch((error) => {
        logger.error('Token validation failed:', error.response?.data || error.message);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Função de login
  const login = async (email, senha) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH_LOGIN, {
        email,
        senha
      });

      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);

      return { success: true };
    } catch (error) {
      const mensagem = error.response?.data?.erro || 'Erro ao fazer login';
      return { success: false, erro: mensagem };
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login'; // redireciona para login
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