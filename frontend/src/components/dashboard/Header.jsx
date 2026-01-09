import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  User,
  Moon,
  Sun,
  LogOut,
  Settings,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

export default function Header({
  sidebarOpen,
  onToggleSidebar,
  darkMode,
  onToggleDarkMode,
  searchOpen,
  onToggleSearch,
  searchQuery,
  onSearchChange,
  notificationsOpen,
  onToggleNotifications,
  unreadCount,
  userMenuOpen,
  onToggleUserMenu,
  user,
  onLogout,
  onNavigate,
}) {
  return (
    <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Search */}
        <div className="relative">
          <button
            onClick={onToggleSearch}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-12 left-0 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-4"
              >
                <input
                  type="text"
                  placeholder="Buscar em todo o sistema..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  autoFocus
                />
                <div className="mt-3 text-xs text-gray-500">
                  <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl</kbd> +{' '}
                  <kbd className="px-2 py-1 bg-gray-100 rounded">K</kbd> para busca rápida
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={onToggleNotifications}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel - será implementado separadamente */}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={onToggleUserMenu}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {user?.nome?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-gray-800">{user?.nome || 'Usuário'}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role || 'Técnico'}</div>
            </div>
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-14 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="font-semibold text-gray-800">{user?.nome || 'Usuário'}</div>
                  <div className="text-sm text-gray-500">{user?.email || ''}</div>
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-semibold capitalize">
                      {user?.role || 'Técnico'}
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      onToggleUserMenu();
                      onNavigate('/dashboard/profile');
                    }}
                    className="w-full px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Meu Perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      onToggleUserMenu();
                      onNavigate('/dashboard/settings');
                    }}
                    className="w-full px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Configurações</span>
                  </button>

                  <button
                    onClick={() => {
                      onToggleUserMenu();
                      onNavigate('/dashboard/help');
                    }}
                    className="w-full px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Ajuda</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 pt-2">
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sair</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
