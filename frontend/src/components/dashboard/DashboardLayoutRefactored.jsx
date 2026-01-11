import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import notificacoesService from '@/services/notificacoesService';
import atividadesService from '@/services/atividadesService';
import toast from 'react-hot-toast';

// Componentes refatorados
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationPanel from './NotificationPanel';
import AIAssistant from '@/components/AIAssistant';

export default function DashboardLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Estados principais
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Notificações da API
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Atividades da API
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // ============================================
  // EFFECTS
  // ============================================

  // Salvar estados no localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Carregar notificações
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000); // A cada minuto
    return () => clearInterval(interval);
  }, []);

  // Carregar atividades
  useEffect(() => {
    loadActivities();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K = Busca
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      // Ctrl/Cmd + B = Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
      // ESC = Fechar menus
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setUserMenuOpen(false);
        setNotificationsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ============================================
  // HANDLERS
  // ============================================

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await notificacoesService.listar();
      // Garante que response é array, se não, retorna array vazio
      const notificationsArr = Array.isArray(response) ? response : [];
      setNotifications(notificationsArr);
      const unread = notificationsArr.filter((n) => !n.lida).length;
      setUnreadCount(unread);
    } catch (error) {
      setNotifications([]);
      setUnreadCount(0);
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const loadActivities = async () => {
    try {
      setLoadingActivities(true);
      const response = await atividadesService.recentes();
      setRecentActivities(Array.isArray(response) ? response : []);
    } catch (error) {
      setRecentActivities([]);
      console.error('Erro ao carregar atividades:', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificacoesService.marcarComoLida(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success('Notificação marcada como lida');
    } catch (error) {
      toast.error('Erro ao marcar notificação');
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificacoesService.marcarTodasComoLidas();
      setNotifications((prev) => prev.map((n) => ({ ...n, lida: true })));
      setUnreadCount(0);
      toast.success('Todas notificações marcadas como lidas');
    } catch (error) {
      toast.error('Erro ao marcar notificações');
      console.error(error);
    }
  };

  const handleToggleFavorite = useCallback((path) => {
    setFavorites((prev) => {
      if (prev.includes(path)) {
        return prev.filter((p) => p !== path);
      }
      return [...prev, path];
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logout realizado com sucesso!');
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isAdmin={isAdmin}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          searchOpen={searchOpen}
          onToggleSearch={() => setSearchOpen(!searchOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notificationsOpen={notificationsOpen}
          onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
          unreadCount={unreadCount}
          userMenuOpen={userMenuOpen}
          onToggleUserMenu={() => setUserMenuOpen(!userMenuOpen)}
          user={user}
          onLogout={handleLogout}
          onNavigate={navigate}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        loading={loadingNotifications}
      />

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}
