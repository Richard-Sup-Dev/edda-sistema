// src/pages/Servicos.jsx
import { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit2, Trash2, Search, Wrench, Filter, Download, Clock, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServicoForm from '@/features/users/ServicoForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Servicos() {
  const { servicos, loadServicos, deleteServico, loading, error } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    loadServicos();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filteredServicos = servicos.filter(servico =>
    servico.nome_servico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja deletar este serviço?')) {
      try {
        await deleteServico(id);
        toast.success('Serviço deletado com sucesso');
      } catch (err) {
        toast.error('Erro ao deletar serviço');
      }
    }
  };

  const handleEdit = (servico) => {
    setEditingId(servico.id);
    setEditingData(servico);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setEditingData(null);
  };

  const totalServicos = servicos.length;
  const servicosAtivos = servicos.filter(s => s.ativo !== false).length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-6">
      {/* Header com Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            Serviços
          </h1>
          <p className="text-gray-600 mt-2">Catálogo de serviços oferecidos</p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl px-6 py-3"
          >
            <p className="text-xs text-green-600 font-semibold uppercase">Total</p>
            <p className="text-2xl font-black text-green-900">{totalServicos}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl px-6 py-3"
          >
            <p className="text-xs text-blue-600 font-semibold uppercase">Ativos</p>
            <p className="text-2xl font-black text-blue-900">{servicosAtivos}</p>
          </motion.div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar serviço..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              title="Filtros"
            >
              <Filter className="w-5 h-5 text-gray-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              title="Exportar"
            >
              <Download className="w-5 h-5 text-gray-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingId(null);
                setEditingData(null);
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <Plus className="w-5 h-5" />
              Novo Serviço
            </motion.button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseForm}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl"
            >
              <ServicoForm
                servicoId={editingId}
                servicoData={editingData}
                onClose={handleCloseForm}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredServicos.map((servico, index) => (
            <motion.div
              key={servico.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  servico.ativo !== false 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {servico.ativo !== false ? 'Ativo' : 'Inativo'}
                </div>
              </div>

              {/* Nome */}
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3 line-clamp-2">
                {servico.nome_servico}
              </h3>

              {/* Descrição */}
              {servico.descricao && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {servico.descricao}
                </p>
              )}

              {/* Valor */}
              {servico.valor_unitario && (
                <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-100">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    R$ {parseFloat(servico.valor_unitario).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(servico)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors font-semibold text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(servico.id)}
                  className="flex items-center justify-center bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredServicos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum serviço encontrado</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Tente uma busca diferente' : 'Comece adicionando seu primeiro serviço'}
          </p>
          {!searchTerm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Adicionar Primeiro Serviço
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
