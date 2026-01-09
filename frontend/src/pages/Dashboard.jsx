// src/pages/Dashboard.jsx
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useEffect, useState } from 'react';
import { Users, Package, Wrench, FileText, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import apiClient from '@/services/apiClient';

export default function Dashboard() {
  const { user } = useAuth();
  const { clientes, pecas, servicos, relatorios, loadClientes, loadPecas, loadServicos, loadRelatorios } = useData();
  const [financeiro, setFinanceiro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          loadClientes(),
          loadPecas(),
          loadServicos(),
          loadRelatorios(),
        ]);

        // Buscar dados financeiros
        const resFinanceiro = await apiClient.get('/financeiro/resumo');
        setFinanceiro(resFinanceiro.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = [
    { 
      label: 'Clientes', 
      value: clientes.length, 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: '+0%'
    },
    { 
      label: 'Peças', 
      value: pecas.length, 
      icon: Package, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: '+0%'
    },
    { 
      label: 'Serviços', 
      value: servicos.length, 
      icon: Wrench, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      change: '+0%'
    },
    { 
      label: 'Relatórios', 
      value: relatorios.length, 
      icon: FileText, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      change: '+0%'
    },
  ];

  // Estatísticas financeiras do mês
  const receitaMes = financeiro?.totalFaturado || 0;
  const variacaoReceita = financeiro?.variacaoFaturado || 0;

  // Alertas do sistema
  const alertas = [];
  
  // Verifica peças com estoque baixo (menos de 5 unidades)
  const pecasEstoqueBaixo = pecas.filter(p => (p.quantidade || 0) < 5).length;
  if (pecasEstoqueBaixo > 0) {
    alertas.push({
      tipo: 'warning',
      mensagem: `${pecasEstoqueBaixo} peças com estoque baixo`
    });
  }

  // Verifica relatórios pendentes
  const relatoriosPendentes = relatorios.filter(r => r.status === 'pendente' || r.status === 'aberto').length;
  if (relatoriosPendentes > 0) {
    alertas.push({
      tipo: 'info',
      mensagem: `${relatoriosPendentes} relatórios pendentes`
    });
  }

  const recentActivity = [
    { action: 'Sistema carregado com sucesso', time: 'Agora', icon: FileText, color: 'text-green-600' },
  ];

  return (
    <div className="space-y-6 p-6">
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando dados...</p>
        </div>
      )}

      {!loading && (
        <>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl"
      >
        <h1 className="text-4xl font-black mb-2">
          Olá, {user?.nome || 'Administrador'}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Bem-vindo ao Sistema de Gestão. Aqui está um resumo do seu negócio.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              {stat.change !== '+0%' && (
                <div className={`px-3 py-1 bg-gradient-to-r ${stat.color} text-white rounded-lg text-xs font-bold`}>
                  {stat.change}
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Atividade Recente</h2>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">Receita do Mês</h3>
            </div>
            <p className="text-4xl font-black mb-2">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitaMes)}
            </p>
            <div className="flex items-center gap-2 text-green-100">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {variacaoReceita >= 0 ? '+' : ''}{variacaoReceita.toFixed(1)}% vs mês anterior
              </span>
            </div>
          </div>

          {/* Alerts Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Alertas</h3>
            </div>
            {alertas.length > 0 ? (
              <div className="space-y-3">
                {alertas.map((alerta, index) => (
                  <div 
                    key={index}
                    className={`p-3 ${
                      alerta.tipo === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'
                    } rounded-lg`}
                  >
                    <p className={`text-sm font-semibold ${
                      alerta.tipo === 'warning' ? 'text-yellow-900' : 'text-blue-900'
                    }`}>
                      {alerta.mensagem}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum alerta no momento</p>
            )}
          </div>
        </motion.div>
      </div>
      </>
      )}
    </div>
  );
}