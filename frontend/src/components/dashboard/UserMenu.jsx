// src/components/dashboard/UserMenu.jsx
import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, HelpCircle } from 'lucide-react';

/**
 * UserMenu - Menu dropdown do usuário no header
 * 
 * Exibe informações do usuário logado e opções de navegação como perfil,
 * configurações, ajuda e logout. Inclui animações e backdrop para fechar.
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Se o menu está aberto
 * @param {Function} props.onClose - Callback para fechar o menu
 * @param {Object} props.user - Objeto do usuário logado
 * @param {string} props.user.nome - Nome do usuário
 * @param {string} props.user.email - Email do usuário
 * @param {Function} props.onNavigate - Callback de navegação
 * @param {Function} props.onLogout - Callback de logout
 * 
 * @example
 * ```jsx
 * const { user, logout } = useAuth();
 * const navigate = useNavigate();
 * const [menuOpen, setMenuOpen] = useState(false);
 * 
 * <UserMenu
 *   isOpen={menuOpen}
 *   onClose={() => setMenuOpen(false)}
 *   user={user}
 *   onNavigate={navigate}
 *   onLogout={logout}
 * />
 * ```
 */
const UserMenu = memo(function UserMenu({ 
  isOpen, 
  onClose, 
  user, 
  onNavigate, 
  onLogout 
}) {
  if (!isOpen) return null;

  const handleNavigate = useCallback((path) => {
    onNavigate(path);
    onClose();
  }, [onNavigate, onClose]);

  const handleLogout = useCallback(() => {
    onLogout();
    onClose();
  }, [onLogout, onClose]);

  const menuItems = [
    { icon: User, label: 'Meu Perfil', action: () => handleNavigate('/profile') },
    { icon: Settings, label: 'Configurações', action: () => handleNavigate('/configuracoes') },
    { icon: HelpCircle, label: 'Ajuda', action: () => handleNavigate('/help') },
    { icon: LogOut, label: 'Sair', action: handleLogout, danger: true },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Menu */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
        >
          {/* User Info */}
          <div className="p-4 border-b border-gray-100 bg-linear-to-r from-orange-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user?.nome?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">
                  {user?.nome || 'Usuário'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
});

export default UserMenu;
