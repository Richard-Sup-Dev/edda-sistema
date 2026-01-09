// src/contexts/DataContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import apiClient from '@/services/apiClient';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CLIENTES
  const loadClientes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/clientes');
      setClientes(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCliente = useCallback(async (data) => {
    try {
      const response = await apiClient.post('/clientes', data);
      setClientes(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao criar cliente');
      throw err;
    }
  }, []);

  const updateCliente = useCallback(async (id, data) => {
    try {
      const response = await apiClient.put(`/clientes/${id}`, data);
      setClientes(prev => prev.map(c => c.id === id ? response.data : c));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao atualizar cliente');
      throw err;
    }
  }, []);

  const deleteCliente = useCallback(async (id) => {
    try {
      await apiClient.delete(`/clientes/${id}`);
      setClientes(prev => prev.filter(c => c.id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao deletar cliente');
      throw err;
    }
  }, []);

  // PEÇAS
  const loadPecas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/pecas');
      setPecas(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar peças');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPeca = useCallback(async (data) => {
    try {
      const response = await apiClient.post('/pecas', data);
      setPecas(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao criar peça');
      throw err;
    }
  }, []);

  const updatePeca = useCallback(async (id, data) => {
    try {
      const response = await apiClient.put(`/pecas/${id}`, data);
      setPecas(prev => prev.map(p => p.id === id ? response.data : p));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao atualizar peça');
      throw err;
    }
  }, []);

  const deletePeca = useCallback(async (id) => {
    try {
      await apiClient.delete(`/pecas/${id}`);
      setPecas(prev => prev.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao deletar peça');
      throw err;
    }
  }, []);

  // SERVIÇOS
  const loadServicos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/servicos');
      setServicos(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar serviços');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createServico = useCallback(async (data) => {
    try {
      const response = await apiClient.post('/servicos', data);
      setServicos(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao criar serviço');
      throw err;
    }
  }, []);

  const updateServico = useCallback(async (id, data) => {
    try {
      const response = await apiClient.put(`/servicos/${id}`, data);
      setServicos(prev => prev.map(s => s.id === id ? response.data : s));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao atualizar serviço');
      throw err;
    }
  }, []);

  const deleteServico = useCallback(async (id) => {
    try {
      await apiClient.delete(`/servicos/${id}`);
      setServicos(prev => prev.filter(s => s.id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao deletar serviço');
      throw err;
    }
  }, []);

  // RELATÓRIOS
  const loadRelatorios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/relatorios');
      setRelatorios(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar relatórios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    // Clientes
    clientes,
    loadClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    
    // Peças
    pecas,
    loadPecas,
    createPeca,
    updatePeca,
    deletePeca,
    
    // Serviços
    servicos,
    loadServicos,
    createServico,
    updateServico,
    deleteServico,
    
    // Relatórios
    relatorios,
    loadRelatorios,
    
    // Estado global
    loading,
    error
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de DataProvider');
  }
  return context;
};
