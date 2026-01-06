// src/pages/Servicos.jsx
import { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600 mt-1">Serviços disponíveis no sistema</p>
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
          Novo Serviço
        </button>
      </div>

      {showForm && (
        <ServicoForm
          servicoId={editingId}
          servicoData={editingData}
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
          placeholder="Buscar serviço..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome do Serviço</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Valor Unitário</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredServicos.map((servico) => (
              <tr key={servico.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3 text-sm text-gray-900">{servico.nome_servico}</td>
                <td className="px-6 py-3 text-sm text-gray-600 max-w-xs truncate">{servico.descricao || '-'}</td>
                <td className="px-6 py-3 text-sm text-gray-600">R$ {parseFloat(servico.valor_unitario || 0).toFixed(2)}</td>
                <td className="px-6 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(servico)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(servico.id)}
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
        {filteredServicos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum serviço encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
