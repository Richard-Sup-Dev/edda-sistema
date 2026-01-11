

import { FileText, Users, DollarSign, BarChart3, Plus, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useDashboardActivities } from '@/hooks/useDashboardActivities';
import { useData } from '@/contexts/DataContext';


export default function DashboardHome() {
  // Dados reais do contexto global
  const { clientes, pecas, servicos, relatorios } = useData();

  // Estatísticas reais
  const stats = [
    { label: 'Clientes', value: clientes.length, icon: Users, color: 'from-blue-400 to-blue-600', trend: 'up', change: '+0%' },
    { label: 'Peças', value: pecas.length, icon: BarChart3, color: 'from-purple-400 to-purple-600', trend: 'up', change: '+0%' },
    { label: 'Serviços', value: servicos.length, icon: DollarSign, color: 'from-green-400 to-green-600', trend: 'up', change: '+0%' },
    { label: 'Relatórios', value: relatorios.length, icon: FileText, color: 'from-orange-400 to-orange-600', trend: 'up', change: '+0%' },
  ];


  // Ações rápidas (pode ser mantido ou buscar dinamicamente)
  const quickActions = [
    { label: 'Novo Relatório', icon: FileText, color: 'from-orange-500 to-orange-600', onClick: () => {} },
    { label: 'Novo Cliente', icon: Users, color: 'from-blue-500 to-blue-600', onClick: () => {} },
    { label: 'Nova Receita', icon: DollarSign, color: 'from-green-500 to-green-600', onClick: () => {} },
    { label: 'Nova Análise', icon: BarChart3, color: 'from-purple-500 to-purple-600', onClick: () => {} },
  ];


  // Horário atual
  const [currentTime] = useState(new Date());

  // Atividades reais do backend
  const { atividadesRecentes, loadingAtividades } = useDashboardActivities();



  return (
    <div className="space-y-10">
      {/* Estatísticas premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.04, y: -2 }}
              className={`relative p-6 rounded-2xl shadow-xl border-0 bg-gradient-to-br ${stat.color} text-white overflow-hidden min-h-[120px] flex flex-col justify-between`}
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
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${stat.trend === 'up' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
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

      {/* Ações rápidas e horário */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                onClick={action.onClick}
                className={`flex flex-col items-center justify-center gap-2 px-0 py-7 rounded-2xl font-bold text-lg shadow-lg border-0 bg-gradient-to-br ${action.color} text-white transition-all`}
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 mb-2 shadow">
                  <Plus size={20} />
                  <Icon size={22} className="ml-1" />
                </span>
                {action.label}
              </motion.button>
            );
          })}
        </div>
        <div className="w-full md:w-72 flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl shadow-xl p-8 border-0">
          <Clock size={44} className="text-orange-500 mb-2" />
          <div className="text-5xl font-black text-orange-700 mb-1 tabular-nums">
            {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-orange-700 font-bold uppercase tracking-wider">Horário Atual</div>
        </div>
      </div>

      {/* Widgets e gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[320px] border-0 flex flex-col">
          <h3 className="font-black text-lg mb-4 text-gray-900 flex items-center gap-2">
            <BarChart3 size={22} className="text-blue-500" />
            Gráfico de Desempenho
          </h3>
          <div className="flex-1 flex items-center justify-center text-gray-300">
            {/* Aqui pode entrar um gráfico real (ex: Chart.js, Recharts, etc) */}
            <span className="text-xl font-bold">[ Gráfico aqui ]</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[320px] border-0 flex flex-col">
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
    </div>
  );
}
