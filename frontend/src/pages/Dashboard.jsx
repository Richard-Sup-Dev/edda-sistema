// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, FileText, Wrench, DollarSign } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Dashboard() {
  const { clientes, pecas, servicos, relatorios, loadClientes, loadPecas, loadServicos, loadRelatorios, loading } = useData();
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalPecas: 0,
    totalServicos: 0,
    totalRelatorios: 0,
    receitaMes: 0
  });

  useEffect(() => {
    Promise.all([
      loadClientes(),
      loadPecas(),
      loadServicos(),
      loadRelatorios()
    ]).then(() => {
      setStats({
        totalClientes: clientes.length,
        totalPecas: pecas.length,
        totalServicos: servicos.length,
        totalRelatorios: relatorios.length,
        receitaMes: Math.random() * 50000 // Placeholder
      });
    });
  }, []);

  const chartData = [
    { mes: 'Jan', relatorios: 12, receita: 15000 },
    { mes: 'Feb', relatorios: 19, receita: 22000 },
    { mes: 'Mar', relatorios: 25, receita: 28000 },
    { mes: 'Apr', relatorios: 22, receita: 24000 },
    { mes: 'May', relatorios: 28, receita: 32000 },
    { mes: 'Jun', relatorios: 31, receita: 35000 }
  ];

  const statusData = [
    { name: 'Concluídos', value: 45, fill: '#10b981' },
    { name: 'Em Andamento', value: 30, fill: '#f59e0b' },
    { name: 'Pendentes', value: 25, fill: '#ef4444' }
  ];

  if (loading) return <LoadingSpinner />;

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon className={`w-12 h-12 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao sistema EDDA</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label="Total de Clientes"
          value={stats.totalClientes}
          color="text-blue-500"
        />
        <StatCard
          icon={Wrench}
          label="Total de Peças"
          value={stats.totalPecas}
          color="text-orange-500"
        />
        <StatCard
          icon={FileText}
          label="Total de Serviços"
          value={stats.totalServicos}
          color="text-green-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Total de Relatórios"
          value={stats.totalRelatorios}
          color="text-purple-500"
        />
        <StatCard
          icon={DollarSign}
          label="Receita (Mês)"
          value={`R$ ${(stats.receitaMes / 1000).toFixed(1)}K`}
          color="text-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Receita */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Receita Mensal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="receita"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Status de Relatórios</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart - Relatórios */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Relatórios e Receita por Mês</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="relatorios" fill="#8b5cf6" name="Relatórios" />
            <Bar yAxisId="right" dataKey="receita" fill="#10b981" name="Receita (R$)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
