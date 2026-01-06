// src/pages/Clientes.jsx
import { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import ClienteForm from '@/features/users/ClienteForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Clientes() {
  const { clientes, loadClientes, deleteCliente, loading, error } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cnpj.includes(searchTerm)
  );

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await deleteCliente(id);
        toast.success('Cliente deletado com sucesso');
      } catch (err) {
        toast.error('Erro ao deletar cliente');
      }
    }
  };

  const handleEdit = (cliente) => {
    setEditingId(cliente.id);
    setEditingData(cliente);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setEditingData(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">Gerenciar clientes do sistema</p>
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
          Novo Cliente
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <ClienteForm
          clienteId={editingId}
          clienteData={editingData}
          onClose={handleCloseForm}
        />
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por nome ou CNPJ..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome Fantasia</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">CNPJ</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cidade</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contato</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3 text-sm text-gray-900">{cliente.nome_fantasia}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{cliente.cnpj}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{cliente.cidade || '-'}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{cliente.responsavel_contato || '-'}</td>
                <td className="px-6 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cliente)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClientes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
