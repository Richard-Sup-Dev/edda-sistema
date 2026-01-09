import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  Package,
  Wrench,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  Star,
  Shield,
  UserCog,
  Database,
} from 'lucide-react';

const Sidebar = memo(function Sidebar({ isOpen, isAdmin, favorites, onToggleFavorite }) {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', color: 'text-blue-500' },
    { path: '/dashboard/clientes', icon: Users, label: 'Clientes', color: 'text-green-500' },
    { path: '/dashboard/pecas', icon: Package, label: 'Peças', color: 'text-purple-500' },
    { path: '/dashboard/servicos', icon: Wrench, label: 'Serviços', color: 'text-orange-500' },
    { path: '/dashboard/relatorios', icon: FileText, label: 'Relatórios', color: 'text-pink-500' },
    { path: '/dashboard/nf/nova', icon: FileText, label: 'Nova NF', color: 'text-indigo-500' },
    { path: '/dashboard/financeiro', icon: DollarSign, label: 'Financeiro', color: 'text-emerald-500' },
    { path: '/dashboard/analises', icon: BarChart3, label: 'Análises', color: 'text-cyan-500' },
  ];

  const adminMenuItems = [
    { path: '/dashboard/admin/usuarios', icon: UserCog, label: 'Usuários', color: 'text-red-500' },
    { path: '/dashboard/admin/configuracoes', icon: Settings, label: 'Configurações', color: 'text-gray-500' },
    { path: '/dashboard/admin/logs', icon: Database, label: 'Logs', color: 'text-yellow-500' },
    { path: '/dashboard/admin/seguranca', icon: Shield, label: 'Segurança', color: 'text-red-600' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const isFavorite = (path) => favorites.includes(path);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      className="bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 text-white h-screen sticky top-0 overflow-hidden shadow-2xl border-r border-gray-700"
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-gray-700">
        <motion.div
          animate={{ scale: isOpen ? 1 : 0.8 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-black text-white">E</span>
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-2xl font-black bg-linear-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
              >
                EDDA
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Menu Principal */}
      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-10rem)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const favorite = isFavorite(item.path);

          return (
            <div key={item.path} className="relative group">
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  active
                    ? 'bg-linear-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50 scale-105'
                    : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-linear-to-r from-orange-500 to-red-600 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${!active && item.color}`} />
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-semibold relative z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && isOpen && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 bg-white rounded-full relative z-10"
                  />
                )}
              </Link>
              
              {/* Favorito */}
              {isOpen && (
                <button
                  onClick={() => onToggleFavorite(item.path)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  <Star
                    className={`w-4 h-4 ${favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                  />
                </button>
              )}
            </div>
          );
        })}

        {/* Menu Admin */}
        {isAdmin && (
          <>
            <div className="pt-6 pb-2">
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Administração
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/50'
                      : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${!active && item.color}`} />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm font-semibold"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </>
        )}
      </nav>
    </motion.aside>
  );
});

export default Sidebar;
