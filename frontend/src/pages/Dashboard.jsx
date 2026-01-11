// src/pages/Dashboard.jsx

import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useEffect, useState } from 'react';
import { useDashboardActivities } from '@/hooks/useDashboardActivities';
import { Users, Package, Wrench, FileText, DollarSign, TrendingUp, Clock, AlertCircle, Plus, BarChart3 } from 'lucide-react';
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

  // Estatísticas premium com dados reais
  const stats = [
    { label: 'Clientes', value: clientes.length, icon: Users, color: 'from-blue-400 to-blue-600', trend: 'up', change: '+0%' },
    { label: 'Peças', value: pecas.length, icon: Package, color: 'from-purple-400 to-purple-600', trend: 'up', change: '+0%' },
    { label: 'Serviços', value: servicos.length, icon: Wrench, color: 'from-green-400 to-green-600', trend: 'up', change: '+0%' },
    { label: 'Relatórios', value: relatorios.length, icon: FileText, color: 'from-orange-400 to-orange-600', trend: 'up', change: '+0%' },
  ];

  // Quick Actions premium
  const quickActions = [
    { label: 'Novo Relatório', icon: FileText, color: 'from-orange-500 to-orange-600', onClick: () => {} },
    { label: 'Novo Cliente', icon: Users, color: 'from-blue-500 to-blue-600', onClick: () => {} },
    { label: 'Nova Receita', icon: DollarSign, color: 'from-green-500 to-green-600', onClick: () => {} },
    { label: 'Nova Análise', icon: BarChart3, color: 'from-purple-500 to-purple-600', onClick: () => {} },
  ];

  // Horário atual
  const [currentTime] = useState(new Date());

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


  // Atividades reais do backend
  const { atividadesRecentes, loadingAtividades } = useDashboardActivities();

  // Apenas renderiza o conteúdo do dashboard, sem header/sidebar/layout
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Carregando dados...</p>
      </div>
    );
  }

  // Conteúdo principal do dashboard (cards, widgets, gráficos, alertas, etc.)
  return (
    <div className="space-y-10 p-6">
      {/* Estatísticas premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.04, y: -2 }}
              className={`relative p-6 rounded-2xl shadow-xl border-0 bg-linear-to-br ${stat.color} text-white overflow-hidden min-h-30 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 shadow-lg">
                    <Icon size={28} />
                  </span>
                  <div>
                    <div className="text-2xl font-black leading-tight">{stat.value}</div>
                    <div className="text-xs font-semibold opacity-80">{stat.label}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-100`}>
                    <TrendingUp size={14} />
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="absolute right-4 bottom-4 opacity-10 text-7xl pointer-events-none select-none">
                <Icon size={64} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Widgets e gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-80 border-0 flex flex-col">
          <h3 className="font-black text-lg mb-4 text-gray-900 flex items-center gap-2">
            <BarChart3 size={22} className="text-blue-500" />
            Gráfico de Desempenho
          </h3>
          <div className="flex-1 flex items-center justify-center text-gray-300">
            {/* Aqui pode entrar um gráfico real (ex: Chart.js, Recharts, etc) */}
            <span className="text-xl font-bold">[ Gráfico aqui ]</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-80 border-0 flex flex-col">
          <h3 className="font-black text-lg mb-4 text-gray-900 flex items-center gap-2">
            <Users size={22} className="text-green-500" />
            Atividades Recentes
          </h3>
          <ul className="space-y-4 text-gray-700 flex-1">
            {loadingAtividades ? (
              <li className="text-gray-400">Carregando atividades...</li>
            ) : atividadesRecentes.length === 0 ? (
              <li className="text-gray-400">Nenhuma atividade encontrada</li>
            ) : (
              atividadesRecentes.map((a, i) => (
                <li key={a.id || i} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="font-bold text-gray-900">{a.usuario || a.user || 'Usuário'}</span>
                  <span className="text-sm">{a.descricao || a.action}</span>
                  <span className="ml-auto text-xs text-gray-400">{a.data ? new Date(a.data).toLocaleString('pt-BR') : ''}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Alerts Card premium */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-8">
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
    </div>
  );
}