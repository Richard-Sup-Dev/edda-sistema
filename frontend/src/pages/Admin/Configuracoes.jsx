// src/pages/Admin/Configuracoes.jsx
import { motion } from 'framer-motion';
import { Settings, Save, Database, Globe, Bell, Palette, Loader2, ArrowLeft, Mail, Server, Shield, Users, FileText, Clock, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifySuccess, notifyError } from '@/utils/notifications';
import apiClient from '@/services/apiClient';

export default function Configuracoes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('geral');
  
  const [config, setConfig] = useState({
    // Geral
    siteName: 'EDDA - Sistema de Relatórios',
    siteUrl: 'http://localhost:3001',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
    
    // Email
    emailEnabled: true,
    emailHost: 'smtp.gmail.com',
    emailPort: '587',
    emailUser: '',
    emailFrom: '',
    
    // Notificações
    notificationsEnabled: true,
    emailNotifications: true,
    systemNotifications: true,
    notificationSound: true,
    
    // Segurança
    sessionTimeout: '60',
    passwordMinLength: '6',
    requireStrongPassword: false,
    twoFactorAuth: false,
    maxLoginAttempts: '5',
    
    // Sistema
    maintenanceMode: false,
    allowRegistration: false,
    debugMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    
    // Relatórios
    maxFileSize: '50',
    allowedFileTypes: 'pdf,doc,docx,jpg,png',
    autoGeneratePDF: true,
    watermarkEnabled: false,
  });

  const handleChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiClient.put('/admin/config', config);
      notifySuccess('Configurações salvas com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      notifyError('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'geral', label: 'Geral', icon: Settings },
    { id: 'email', label: 'E-mail', icon: Mail },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'sistema', label: 'Sistema', icon: Server },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar ao Dashboard</span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">Configurações do Sistema</h1>
                <p className="text-gray-600 mt-1">Gerencie todas as configurações da aplicação</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          {/* ABA GERAL */}
          {activeTab === 'geral' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações Gerais</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Sistema
                  </label>
                  <input
                    type="text"
                    value={config.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL do Sistema
                  </label>
                  <input
                    type="url"
                    value={config.siteUrl}
                    onChange={(e) => handleChange('siteUrl', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuso Horário
                  </label>
                  <select
                    value={config.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                    <option value="America/Manaus">Manaus (GMT-4)</option>
                    <option value="America/Rio_Branco">Acre (GMT-5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma
                  </label>
                  <select
                    value={config.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ABA EMAIL */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações de E-mail</h2>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
                <div>
                  <p className="font-medium text-gray-900">E-mail habilitado</p>
                  <p className="text-sm text-gray-600">Ativar envio de e-mails pelo sistema</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.emailEnabled}
                    onChange={(e) => handleChange('emailEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servidor SMTP
                  </label>
                  <input
                    type="text"
                    value={config.emailHost}
                    onChange={(e) => handleChange('emailHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Porta SMTP
                  </label>
                  <input
                    type="number"
                    value={config.emailPort}
                    onChange={(e) => handleChange('emailPort', e.target.value)}
                    placeholder="587"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuário SMTP
                  </label>
                  <input
                    type="email"
                    value={config.emailUser}
                    onChange={(e) => handleChange('emailUser', e.target.value)}
                    placeholder="seu-email@gmail.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail de Envio
                  </label>
                  <input
                    type="email"
                    value={config.emailFrom}
                    onChange={(e) => handleChange('emailFrom', e.target.value)}
                    placeholder="noreply@sistema.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ABA NOTIFICAÇÕES */}
          {activeTab === 'notificacoes' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações de Notificações</h2>
              
              <div className="space-y-4">
                {[
                  { key: 'notificationsEnabled', label: 'Notificações Habilitadas', desc: 'Ativar sistema de notificações' },
                  { key: 'emailNotifications', label: 'Notificações por E-mail', desc: 'Enviar notificações via e-mail' },
                  { key: 'systemNotifications', label: 'Notificações do Sistema', desc: 'Mostrar notificações na interface' },
                  { key: 'notificationSound', label: 'Som de Notificação', desc: 'Reproduzir som ao receber notificações' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config[item.key]}
                        onChange={(e) => handleChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA SEGURANÇA */}
          {activeTab === 'seguranca' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações de Segurança</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout de Sessão (minutos)
                  </label>
                  <input
                    type="number"
                    value={config.sessionTimeout}
                    onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamanho Mínimo da Senha
                  </label>
                  <input
                    type="number"
                    value={config.passwordMinLength}
                    onChange={(e) => handleChange('passwordMinLength', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tentativas Máximas de Login
                  </label>
                  <input
                    type="number"
                    value={config.maxLoginAttempts}
                    onChange={(e) => handleChange('maxLoginAttempts', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {[
                  { key: 'requireStrongPassword', label: 'Exigir Senha Forte', desc: 'Obrigar uso de letras, números e caracteres especiais' },
                  { key: 'twoFactorAuth', label: 'Autenticação em Dois Fatores', desc: 'Ativar 2FA para todos os usuários' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config[item.key]}
                        onChange={(e) => handleChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA SISTEMA */}
          {activeTab === 'sistema' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações do Sistema</h2>
              
              <div className="space-y-4">
                {[
                  { key: 'maintenanceMode', label: 'Modo Manutenção', desc: 'Desabilitar acesso ao sistema para manutenção', color: 'red' },
                  { key: 'allowRegistration', label: 'Permitir Registro', desc: 'Permitir que novos usuários se cadastrem' },
                  { key: 'debugMode', label: 'Modo Debug', desc: 'Ativar logs detalhados para desenvolvimento', color: 'yellow' },
                  { key: 'autoBackup', label: 'Backup Automático', desc: 'Realizar backup automático do banco de dados' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config[item.key]}
                        onChange={(e) => handleChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-${item.color || 'purple'}-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${item.color || 'purple'}-600`}></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência de Backup
                </label>
                <select
                  value={config.backupFrequency}
                  onChange={(e) => handleChange('backupFrequency', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="hourly">A cada hora</option>
                  <option value="daily">Diariamente</option>
                  <option value="weekly">Semanalmente</option>
                  <option value="monthly">Mensalmente</option>
                </select>
              </div>
            </div>
          )}

          {/* ABA RELATÓRIOS */}
          {activeTab === 'relatorios' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações de Relatórios</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamanho Máximo de Arquivo (MB)
                  </label>
                  <input
                    type="number"
                    value={config.maxFileSize}
                    onChange={(e) => handleChange('maxFileSize', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipos de Arquivo Permitidos
                  </label>
                  <input
                    type="text"
                    value={config.allowedFileTypes}
                    onChange={(e) => handleChange('allowedFileTypes', e.target.value)}
                    placeholder="pdf,doc,docx,jpg,png"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {[
                  { key: 'autoGeneratePDF', label: 'Gerar PDF Automaticamente', desc: 'Criar PDF ao finalizar relatório' },
                  { key: 'watermarkEnabled', label: 'Marca d\'água', desc: 'Adicionar marca d\'água nos PDFs' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config[item.key]}
                        onChange={(e) => handleChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer com estatísticas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status do Sistema</p>
                <p className="text-lg font-bold text-green-600">Online</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Banco de Dados</p>
                <p className="text-lg font-bold text-blue-600">PostgreSQL</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Último Backup</p>
                <p className="text-lg font-bold text-orange-600">Hoje</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
