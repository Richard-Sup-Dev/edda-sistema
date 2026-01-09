// src/pages/Relatorios.jsx
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter, TrendingUp, Users, Package, Wrench, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';

export default function Relatorios() {
  const navigate = useNavigate();
  const { relatorios, loadRelatorios } = useData();
  const [periodo, setPeriodo] = useState('mes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadRelatorios();
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const tiposRelatorio = [
    {
      title: 'Relatório de Clientes',
      description: 'Lista completa de clientes com dados de contato',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Relatório de Peças',
      description: 'Inventário de peças e estoque atual',
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Relatório de Serviços',
      description: 'Serviços realizados e valores',
      icon: Wrench,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Relatório Financeiro',
      description: 'Análise de receitas e despesas',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Relatórios
          </h1>
          <p className="text-gray-600 mt-2">Gere e exporte relatórios personalizados</p>
        </div>

        {/* Botão Criar Novo Relatório */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/relatorios/novo')}
          className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Novo Relatório
        </motion.button>
      </motion.div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-3 flex-1">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="hoje">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
              <option value="trimestre">Este Trimestre</option>
              <option value="ano">Este Ano</option>
              <option value="customizado">Período Customizado</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <Filter className="w-5 h-5 text-gray-700" />
          </motion.button>
        </div>
      </div>

      {/* Grid de Tipos de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiposRelatorio.map((tipo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all cursor-pointer"
          >
            <div className={`w-14 h-14 ${tipo.bgColor} rounded-xl flex items-center justify-center mb-4`}>
              <tipo.icon className={`w-7 h-7 bg-linear-to-br ${tipo.color} bg-clip-text text-transparent`} style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
            </div>
            
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              {tipo.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              {tipo.description}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full flex items-center justify-center gap-2 bg-linear-to-r ${tipo.color} text-white px-4 py-3 rounded-xl font-semibold`}
            >
              <Download className="w-4 h-4" />
              Gerar PDF
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Relatórios Gerados Recentemente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-600" />
          Relatórios Gerados ({relatorios.length})
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando relatórios...</p>
          </div>
        ) : relatorios.length > 0 ? (
          <div className="space-y-3">
            {relatorios.slice(0, 10).map((relatorio, index) => (
              <motion.div
                key={relatorio.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                onClick={() => navigate(`/dashboard/relatorios/${relatorio.id}`)}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${
                    relatorio.status === 'concluido' ? 'bg-green-100' : 
                    relatorio.status === 'pendente' ? 'bg-yellow-100' : 'bg-blue-100'
                  } rounded-lg flex items-center justify-center`}>
                    <FileText className={`w-5 h-5 ${
                      relatorio.status === 'concluido' ? 'text-green-600' : 
                      relatorio.status === 'pendente' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Relatório #{relatorio.id} - {relatorio.cliente_nome || 'Cliente N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(relatorio.data_entrada).toLocaleDateString('pt-BR')} • Status: {relatorio.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold">
                    {relatorio.valor_total ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(relatorio.valor_total) : 'N/A'}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <Download className="w-5 h-5 text-orange-600" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">Nenhum relatório gerado ainda</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard/relatorios/novo')}
              className="bg-linear-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold"
            >
              Criar Primeiro Relatório
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
