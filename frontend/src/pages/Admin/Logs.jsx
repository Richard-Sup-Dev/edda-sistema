// src/pages/Admin/Logs.jsx
import { motion } from 'framer-motion';
import { Database, Activity, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/logs?limit=50');
        setLogs(response.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar logs:', err);
        setError('Erro ao carregar logs. Verifique se o backend está rodando.');
        // Fallback com dados de exemplo
        setLogs([
          { tipo: 'success', acao: 'Login realizado', usuario: 'admin@edda.com', timestamp: '2026-01-07 14:32:18', ip: '192.168.1.100' },
          { tipo: 'info', acao: 'Cliente cadastrado', usuario: 'joao@edda.com', timestamp: '2026-01-07 14:15:03', ip: '192.168.1.101' },
          { tipo: 'warning', acao: 'Tentativa de acesso negada', usuario: 'unknown', timestamp: '2026-01-07 13:45:22', ip: '203.0.113.42' },
          { tipo: 'error', acao: 'Erro ao salvar relatório', usuario: 'maria@edda.com', timestamp: '2026-01-07 12:30:15', ip: '192.168.1.102' },
          { tipo: 'success', acao: 'Backup concluído', usuario: 'system', timestamp: '2026-01-07 03:00:00', ip: 'localhost' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getIcon = (tipo) => {
    switch(tipo) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Activity className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = (tipo) => {
    switch(tipo) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-4"
        >
          <p className="text-yellow-800 font-semibold">⚠️ {error}</p>
          <p className="text-yellow-600 text-sm mt-1">Mostrando dados de exemplo</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          Logs do Sistema
        </h1>
        <p className="text-gray-600 mt-2">Monitore atividades e eventos do sistema</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <div className="space-y-3">
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className={`p-4 rounded-xl border ${getBgColor(log.tipo)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(log.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-gray-900">{log.acao}</h3>
                    <span className="text-xs text-gray-500 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600">Usuário: <span className="font-semibold">{log.usuario}</span></p>
                  <p className="text-xs text-gray-500 mt-1">IP: {log.ip}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
