// src/hooks/useAuth.js
import { useState } from 'react';
import { API_ENDPOINTS } from '@/config/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const login = async (email, senha) => {
    setLoading(true);
    setErro('');

    try {
      const res = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.erro || 'Email ou senha incorretos');
      }

      // Armazena token e usuário
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return true; // Sucesso → Login.jsx vai redirecionar
    } catch (err) {
      const mensagem = err.message || 'Erro ao fazer login';
      setErro(mensagem);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ nome, email, senha }) => {
    setLoading(true);
    setErro('');

    try {
      const res = await fetch(API_ENDPOINTS.AUTH_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.erro || 'Erro ao criar conta');
      }

      return true; // Sucesso → Login.jsx mostra mensagem e volta pro login
    } catch (err) {
      const mensagem = err.message || 'Erro ao registrar';
      setErro(mensagem);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função opcional para logout (útil no futuro)
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    login,
    register,
    logout,
    loading,
    erro,
    setErro
  };
};