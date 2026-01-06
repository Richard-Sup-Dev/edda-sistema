// src/pages/Pecas.jsx
import { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Peças</h1>
          <p className="text-gray-600 mt-1">Catálogo de peças utilizadas</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setEditingData(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nova Peça
        </button>
      </div>

      {showForm && (
        <PecaForm
          pecaId={editingId}
          pecaData={editingData}
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
            setEditingData(null);
          }}
        />
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar peça..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Código Fábrica</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Custo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Venda</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPecas.map((peca) => (
              <tr key={peca.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3 text-sm text-gray-900">{peca.nome_peca}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{peca.codigo_fabrica || '-'}</td>
                <td className="px-6 py-3 text-sm text-gray-600">R$ {parseFloat(peca.valor_custo || 0).toFixed(2)}</td>
                <td className="px-6 py-3 text-sm text-gray-600">R$ {parseFloat(peca.valor_venda || 0).toFixed(2)}</td>
                <td className="px-6 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(peca)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(peca.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPecas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma peça encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
