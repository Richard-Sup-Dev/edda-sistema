// src/pages/Financeiro.jsx
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';

export default function Financeiro() {
  const [periodo, setPeriodo] = useState('mes');
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFinanceiro = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/financeiro/resumo?periodo=${periodo}`);
        setDados(response.data);
      } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFinanceiro();
  }, [periodo]);

  // Calcular dados do resumo a partir da API
  const resumo = dados ? [
    { 
      label: 'Total Faturado', 
      valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dados.totalFaturado || 0), 
      variacao: `${dados.variacaoFaturado >= 0 ? '+' : ''}${(dados.variacaoFaturado || 0).toFixed(1)}%`, 
      tipo: 'positivo', 
      icon: TrendingUp 
    },
    { 
      label: 'Total Concluído', 
      valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dados.totalConcluido || 0), 
      variacao: `${dados.variacaoConcluido >= 0 ? '+' : ''}${(dados.variacaoConcluido || 0).toFixed(1)}%`, 
      tipo: 'positivo', 
      icon: ArrowUpRight 
    },
    { 
      label: 'Total Pendente', 
      valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dados.totalPendente || 0), 
      variacao: `${dados.variacaoPendente >= 0 ? '+' : ''}${(dados.variacaoPendente || 0).toFixed(1)}%`, 
      tipo: dados.variacaoPendente > 0 ? 'negativo' : 'positivo', 
      icon: dados.variacaoPendente > 0 ? TrendingDown : TrendingUp 
    },
    { 
      label: 'OS Abertas', 
      valor: String(dados.contadores?.osAbertas || 0), 
      variacao: `${dados.contadores?.finalizadas || 0} Finalizadas`, 
      tipo: 'neutral', 
      icon: ArrowUpRight 
    },
  ] : [];

  const evolucaoMensal = dados?.evolucaoMensal || [];

  return (
    <div className="space-y-6 p-6">
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando dados financeiros...</p>
        </div>
      )}

      {!loading && (
        <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          Financeiro
        </h1>
        <p className="text-gray-600 mt-2">Controle de receitas, despesas e fluxo de caixa</p>
      </motion.div>

      {/* Filtro de Período */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="hoje">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="trimestre">Este Trimestre</option>
            <option value="ano">Este Ano</option>
          </select>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resumo.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${item.tipo === 'positivo' ? 'bg-green-50' : item.tipo === 'negativo' ? 'bg-red-50' : 'bg-blue-50'} rounded-xl flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 ${item.tipo === 'positivo' ? 'text-green-600' : item.tipo === 'negativo' ? 'text-red-600' : 'text-blue-600'}`} />
              </div>
              {item.variacao && (
                <div className={`px-3 py-1 ${item.tipo === 'positivo' ? 'bg-green-100 text-green-700' : item.tipo === 'negativo' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} rounded-lg text-xs font-bold`}>
                  {item.variacao}
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">{item.label}</p>
            <p className="text-3xl font-black text-gray-900">{item.valor}</p>
          </motion.div>
        ))}
      </div>

      {/* Gráfico Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Evolução Mensal</h2>
        {evolucaoMensal.length > 0 ? (
          <div className="space-y-4">
            {evolucaoMensal.slice(0, 6).map((mes, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-gray-900">{mes.mes}/{mes.ano}</p>
                  <p className="text-sm text-gray-500">{mes.total_relatorios || 0} relatórios</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-green-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mes.total_faturado || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 bg-linear-to-br from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
            <p className="text-gray-500 text-lg">Nenhum dado de evolução disponível</p>
          </div>
        )}
      </motion.div>

      {/* Resumo Adicional */}
      {dados && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo Geral</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-600 font-semibold mb-1">OS Abertas</p>
              <p className="text-3xl font-black text-blue-900">{dados.contadores?.osAbertas || 0}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-green-600 font-semibold mb-1">Finalizadas</p>
              <p className="text-3xl font-black text-green-900">{dados.contadores?.finalizadas || 0}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-600 font-semibold mb-1">NF Emitidas</p>
              <p className="text-3xl font-black text-purple-900">{dados.contadores?.nfEmitidas || 0}</p>
            </div>
          </div>
        </motion.div>
      )}
      </>
      )}
    </div>
  );
}
