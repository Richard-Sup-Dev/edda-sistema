// src/pages/Admin/Configuracoes.jsx
import { motion } from 'framer-motion';
import { Settings, Save, Database, Globe, Bell, Palette, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';

export default function Configuracoes() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/config');
        setConfig(response.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
        setError('Erro ao carregar configurações. Verifique se o backend está rodando.');
        // Fallback com configurações de exemplo
        setConfig({
          database: 'PostgreSQL 16.0',
          timezone: 'GMT-3 (Brasil)',
          notifications: true,
          theme: 'dark'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async (key, value) => {
    try {
      setSaving(true);
      await apiClient.put('/admin/config', { [key]: value });
      alert('✅ Configuração salva com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar configuração:', err);
      alert('❌ Erro ao salvar configuração');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
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
          <p className="text-yellow-600 text-sm mt-1">Mostrando configurações de exemplo</p>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          Configurações do Sistema
        </h1>
        <p className="text-gray-600 mt-2">Gerencie configurações globais da aplicação</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Banco de Dados', icon: Database, color: 'blue' },
          { title: 'Localização', icon: Globe, color: 'green' },
          { title: 'Notificações', icon: Bell, color: 'orange' },
          { title: 'Aparência', icon: Palette, color: 'purple' },
        ].map((config, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className={`w-12 h-12 bg-${config.color}-100 rounded-xl flex items-center justify-center mb-4`}>
              <config.icon className={`w-6 h-6 text-${config.color}-600`} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{config.title}</h3>
            <p className="text-sm text-gray-600 mb-4">Configure {config.title.toLowerCase()}</p>
            <button className={`w-full bg-${config.color}-50 text-${config.color}-600 px-4 py-2 rounded-lg hover:bg-${config.color}-100 transition-colors font-semibold`}>
              Configurar
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
