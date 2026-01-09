// src/pages/Admin/Seguranca.jsx
import { motion } from 'framer-motion';
import { Shield, Lock, Key, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';

export default function Seguranca() {
  const [statusSeguranca, setStatusSeguranca] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSecurityStatus = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/security/status');
        setStatusSeguranca(response.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar status de segurança:', err);
        setError('Erro ao carregar status. Verifique se o backend está rodando.');
        // Fallback com dados de exemplo
        setStatusSeguranca([
          { item: 'Autenticação JWT', status: 'ok', descricao: 'Token válido e seguro' },
          { item: 'Criptografia SSL/TLS', status: 'ok', descricao: 'Certificado válido até 2027' },
          { item: 'Backup Automático', status: 'ok', descricao: 'Último backup: hoje às 03:00' },
          { item: 'Firewall', status: 'warning', descricao: 'Algumas portas abertas' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSecurityStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
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
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          Segurança
        </h1>
        <p className="text-gray-600 mt-2">Monitore a segurança e proteção do sistema</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Senhas Fortes', icon: Lock, valor: '100%', color: 'green' },
          { title: 'Autenticação 2FA', icon: Key, valor: 'Ativa', color: 'blue' },
          { title: 'Tentativas Bloqueadas', icon: AlertTriangle, valor: '3 hoje', color: 'orange' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border border-${stat.color}-200 rounded-2xl p-6`}
          >
            <div className={`w-12 h-12 bg-${stat.color}-500 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">{stat.title}</h3>
            <p className={`text-2xl font-black text-${stat.color}-900`}>{stat.valor}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Status de Segurança</h2>
        <div className="space-y-3">
          {statusSeguranca.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl ${
                item.status === 'ok' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.status === 'ok' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
                <div>
                  <h3 className="font-bold text-gray-900">{item.item}</h3>
                  <p className="text-sm text-gray-600">{item.descricao}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                item.status === 'ok' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {item.status === 'ok' ? 'OK' : 'Atenção'}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
