// src/components/layout/DashboardLayoutNew.jsx
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home, Users, Package, Wrench, FileText, DollarSign, LogOut, Menu, X,
  Settings, BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardLayoutNew() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Clientes', path: '/dashboard/clientes', icon: Users },
    { label: 'Peças', path: '/dashboard/pecas', icon: Package },
    { label: 'Serviços', path: '/dashboard/servicos', icon: Wrench },
    { label: 'Relatórios', path: '/dashboard/relatorios', icon: FileText },
    { label: 'Financeiro', path: '/dashboard/financeiro', icon: DollarSign },
    { label: 'Análises', path: '/dashboard/analises', icon: BarChart3 },
  ];

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja fazer logout?')) {
      logout();
      toast.success('Desconectado com sucesso');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50`}
      >
        {/* Logo/Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className={`font-bold text-orange-600 text-2xl ${!sidebarOpen && 'hidden'}`}>
            EDDA
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    active
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  title={item.label}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className={`${!sidebarOpen && 'hidden'}`}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/profile-settings"
            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
            title="Configurações"
          >
            <Settings size={20} />
            <span className={`${!sidebarOpen && 'hidden'}`}>Configurações</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition"
            title="Sair"
          >
            <LogOut size={20} />
            <span className={`${!sidebarOpen && 'hidden'}`}>Sair</span>
          </button>
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-800 bg-gray-800">
            <p className="text-sm text-gray-400">Logado como</p>
            <p className="font-medium text-white truncate">{user?.nome}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow">
          <h1 className="text-2xl font-bold text-gray-900">EDDA - Sistema de Relatórios</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-gray-900">{user?.nome}</p>
              <p className="text-sm text-gray-600">{user?.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
