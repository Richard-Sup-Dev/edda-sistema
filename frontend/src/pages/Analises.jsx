// src/pages/Analises.jsx
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity, Target, PieChart, LineChart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import apiClient from '@/services/apiClient';

export default function Analises() {
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

  // Calcular métricas reais
  const relatoriosConcluidos = relatorios.filter(r => r.status === 'concluido' || r.status === 'finalizado').length;
  const totalRelatorios = relatorios.length;
  const taxaConversao = totalRelatorios > 0 ? ((relatoriosConcluidos / totalRelatorios) * 100).toFixed(1) : 0;

  const totalFaturado = financeiro?.totalFaturado || 0;
  const variacaoFaturado = financeiro?.variacaoFaturado || 0;
  const crescimentoMensal = variacaoFaturado.toFixed(1);

  const ticketMedio = relatoriosConcluidos > 0 ? (totalFaturado / relatoriosConcluidos) : 0;

  // Calcular insights reais
  const pecasEstoqueBaixo = pecas.filter(p => (p.quantidade || 0) < 5).length;
  const servicosMaisUsados = servicos.length > 0 ? servicos[0] : null;

  const insights = [
    {
      title: 'Desempenho Financeiro',
      descricao: `Faturamento de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFaturado)} este mês`,
      icone: TrendingUp,
      cor: 'green',
    },
    {
      title: 'Taxa de Conclusão',
      descricao: `${relatoriosConcluidos} de ${totalRelatorios} relatórios concluídos (${taxaConversao}%)`,
      icone: Target,
      cor: 'blue',
    },
    pecasEstoqueBaixo > 0 ? {
      title: 'Atenção Necessária',
      descricao: `${pecasEstoqueBaixo} peças com estoque abaixo do mínimo`,
      icone: Activity,
      cor: 'red',
    } : null,
  ].filter(Boolean);

  const metricas = [
    { 
      label: 'Taxa de Conclusão', 
      valor: `${taxaConversao}%`, 
      variacao: variacaoFaturado >= 0 ? `+${Math.abs(variacaoFaturado).toFixed(1)}%` : `-${Math.abs(variacaoFaturado).toFixed(1)}%`, 
      icon: Target, 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      label: 'Crescimento Mensal', 
      valor: `${crescimentoMensal >= 0 ? '+' : ''}${crescimentoMensal}%`, 
      variacao: variacaoFaturado >= 0 ? 'Positivo' : 'Negativo', 
      icon: TrendingUp, 
      color: 'from-green-500 to-green-600' 
    },
    { 
      label: 'Ticket Médio', 
      valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ticketMedio), 
      variacao: relatoriosConcluidos > 0 ? `${relatoriosConcluidos} OS` : '0 OS', 
      icon: Activity, 
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      label: 'Total Clientes', 
      valor: clientes.length.toString(), 
      variacao: `${servicos.length} serviços`, 
      icon: BarChart3, 
      color: 'from-orange-500 to-orange-600' 
    },
  ];

  // Comparativo de períodos (últimos meses da evolução)
  const evolucaoMensal = financeiro?.evolucaoMensal || [];
  const comparativos = evolucaoMensal.slice(0, 3).map((mes, index) => {
    const mesAnterior = evolucaoMensal[index + 1];
    let variacao = 0;
    if (mesAnterior && mesAnterior.total_faturado > 0) {
      variacao = (((mes.total_faturado - mesAnterior.total_faturado) / mesAnterior.total_faturado) * 100).toFixed(1);
    }
    return {
      periodo: `${mes.mes}/${mes.ano}`,
      faturado: mes.total_faturado || 0,
      relatorios: mes.total_relatorios || 0,
      variacao: index === 0 ? variacao : null,
    };
  });

  return (
    <div className="space-y-6 p-6">
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando análises...</p>
        </div>
      )}

      {!loading && (
        <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            Análises
          </h1>
          <p className="text-gray-600 mt-2">Insights inteligentes e métricas de desempenho</p>
        </div>
        <div className="px-4 py-2 bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold text-sm shadow-lg">
          🎯 BETA
        </div>
      </motion.div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-linear-to-br ${metrica.color} rounded-xl flex items-center justify-center`}>
                <metrica.icon className="w-6 h-6 text-white" />
              </div>
              {metrica.variacao && (
                <div className={`px-3 py-1 ${
                  metrica.variacao.includes('+') || metrica.variacao === 'Positivo' 
                    ? 'bg-green-100 text-green-700' 
                    : metrica.variacao.includes('-') 
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                } rounded-lg text-xs font-bold`}>
                  {metrica.variacao}
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">{metrica.label}</p>
            <p className="text-3xl font-black text-gray-900">{metrica.valor}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Insights Inteligentes
          </h2>

          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`p-4 bg-${insight.cor}-50 border border-${insight.cor}-200 rounded-xl`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 bg-${insight.cor}-100 rounded-lg flex items-center justify-center shrink-0`}>
                    <insight.icone className={`w-5 h-5 text-${insight.cor}-600`} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-${insight.cor}-900 mb-1`}>{insight.title}</h3>
                    <p className={`text-sm text-${insight.cor}-700`}>{insight.descricao}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Gráfico de Pizza Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Distribuição
          </h2>
          <div className="h-64 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-purple-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Gráfico de Pizza</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Comparativo de Períodos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <LineChart className="w-5 h-5 text-purple-600" />
          Comparativo de Períodos
        </h2>

        {comparativos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Período</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Faturado</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Relatórios</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Variação</th>
                </tr>
              </thead>
              <tbody>
                {comparativos.map((comp, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900">{comp.periodo}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(comp.faturado)}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{comp.relatorios}</td>
                    <td className="py-3 px-4">
                      {comp.variacao !== null && (
                        <div className={`flex items-center gap-1 ${
                          comp.variacao >= 0 ? 'text-green-600' : 'text-red-600'
                        } font-semibold`}>
                          <TrendingUp className="w-4 h-4" />
                          {comp.variacao >= 0 ? '+' : ''}{comp.variacao}%
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <LineChart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum dado de comparativo disponível</p>
          </div>
        )}
      </motion.div>
      </>
      )}
    </div>
  );
}
