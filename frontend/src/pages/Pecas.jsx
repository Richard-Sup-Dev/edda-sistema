// src/pages/Pecas.jsx
import { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit2, Trash2, Search, Package, Filter, Download, Tag, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PecaForm from '@/features/users/PecaForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Pecas() {
  const { pecas, loadPecas, deletePeca, loading, error } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    loadPecas();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filteredPecas = pecas.filter(peca =>
    peca.nome_peca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (peca.codigo_fabrica?.includes(searchTerm))
  );

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja deletar esta peça?')) {
      try {
        await deletePeca(id);
        toast.success('Peça deletada com sucesso');
      } catch (err) {
        toast.error('Erro ao deletar peça');
      }
    }
  };

  const handleEdit = (peca) => {
    setEditingId(peca.id);
    setEditingData(peca);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setEditingData(null);
  };

  const totalPecas = pecas.length;
  const pecasComEstoque = pecas.filter(p => (p.quantidade_estoque || 0) > 0).length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-6">
      {/* Header com Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            Peças
          </h1>
          <p className="text-gray-600 mt-2">Catálogo de peças e componentes</p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-linear-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl px-6 py-3"
          >
            <p className="text-xs text-purple-600 font-semibold uppercase">Total</p>
            <p className="text-2xl font-black text-purple-900">{totalPecas}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-linear-to-br from-green-50 to-green-100 border border-green-200 rounded-xl px-6 py-3"
          >
            <p className="text-xs text-green-600 font-semibold uppercase">Em Estoque</p>
            <p className="text-2xl font-black text-green-900">{pecasComEstoque}</p>
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
              placeholder="Buscar por nome ou código..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
              className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <Plus className="w-5 h-5" />
              Nova Peça
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
              <PecaForm
                pecaId={editingId}
                pecaData={editingData}
                onClose={handleCloseForm}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de Peças */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredPecas.map((peca, index) => (
            <motion.div
              key={peca.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                {peca.quantidade_estoque !== undefined && (
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    peca.quantidade_estoque > 10 
                      ? 'bg-green-100 text-green-700' 
                      : peca.quantidade_estoque > 0 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {peca.quantidade_estoque > 0 ? `${peca.quantidade_estoque} un.` : 'Sem estoque'}
                  </div>
                )}
              </div>

              {/* Nome */}
              <h3 className="font-bold text-gray-900 text-base leading-tight mb-2 line-clamp-2">
                {peca.nome_peca}
              </h3>

              {/* Código */}
              {peca.codigo_fabrica && (
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 font-mono">{peca.codigo_fabrica}</span>
                </div>
              )}

              {/* Preços */}
              <div className="space-y-1 mb-4 pb-4 border-b border-gray-100">
                {peca.valor_custo && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Custo:</span>
                    <span className="text-sm font-semibold text-gray-700">
                      R$ {parseFloat(peca.valor_custo).toFixed(2)}
                    </span>
                  </div>
                )}
                {peca.valor_venda && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Venda:</span>
                    <span className="text-sm font-bold text-green-600">
                      R$ {parseFloat(peca.valor_venda).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(peca)}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors font-semibold text-xs"
                >
                  <Edit2 className="w-3 h-3" />
                  Editar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(peca.id)}
                  className="flex items-center justify-center bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredPecas.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma peça encontrada</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Tente uma busca diferente' : 'Comece adicionando sua primeira peça'}
          </p>
          {!searchTerm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Adicionar Primeira Peça
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
