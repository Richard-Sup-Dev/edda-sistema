// src/hooks/useDashboardState.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para gerenciar o estado global do dashboard
 * 
 * Gerencia preferências persistentes do usuário (localStorage) e estados temporários da UI.
 * Inclui sidebar, tema, favoritos, idioma, modais, e modo de apresentação.
 * 
 * @hook
 * @returns {Object} Estado e funções de controle do dashboard
 * @returns {boolean} returns.sidebarOpen - Estado da sidebar (aberta/fechada)
 * @returns {Function} returns.toggleSidebar - Toggle da sidebar
 * @returns {boolean} returns.darkMode - Modo escuro ativo
 * @returns {Function} returns.toggleDarkMode - Toggle do modo escuro
 * @returns {Array<string>} returns.favorites - Lista de itens favoritos
 * @returns {Function} returns.addFavorite - Adiciona item aos favoritos
 * @returns {Function} returns.removeFavorite - Remove item dos favoritos
 * @returns {Function} returns.toggleFavorite - Toggle item favorito
 * @returns {string} returns.language - Idioma atual ('pt', 'en', 'es')
 * @returns {Function} returns.setLanguage - Define o idioma
 * @returns {Date} returns.currentTime - Hora atual (atualizada a cada minuto)
 * @returns {boolean} returns.userMenuOpen - Estado do menu de usuário
 * @returns {Function} returns.setUserMenuOpen - Define estado do menu de usuário
 * @returns {boolean} returns.notificationsOpen - Estado do painel de notificações
 * @returns {Function} returns.setNotificationsOpen - Define estado do painel de notificações
 * @returns {boolean} returns.searchOpen - Estado da busca
 * @returns {Function} returns.setSearchOpen - Define estado da busca
 * @returns {string} returns.searchQuery - Texto da busca
 * @returns {Function} returns.setSearchQuery - Define texto da busca
 * @returns {boolean} returns.commandPaletteOpen - Estado da paleta de comandos
 * @returns {Function} returns.setCommandPaletteOpen - Define estado da paleta de comandos
 * @returns {boolean} returns.focusMode - Modo foco ativo
 * @returns {Function} returns.toggleFocusMode - Toggle do modo foco
 * @returns {boolean} returns.showKeyboardShortcuts - Modal de atalhos visível
 * @returns {Function} returns.setShowKeyboardShortcuts - Define visibilidade do modal de atalhos
 * @returns {boolean} returns.presentationMode - Modo apresentação ativo
 * @returns {Function} returns.togglePresentationMode - Toggle do modo apresentação
 * 
 * @example
 * ```jsx
 * function Dashboard() {
 *   const { sidebarOpen, toggleSidebar, darkMode, toggleDarkMode } = useDashboardState();
 *   
 *   return (
 *     <div className={darkMode ? 'dark' : ''}>
 *       <button onClick={toggleSidebar}>
 *         {sidebarOpen ? 'Fechar' : 'Abrir'} Sidebar
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDashboardState() {
  // Estados com persistência em localStorage
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved && saved !== 'undefined' ? JSON.parse(saved) : true;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved && saved !== 'undefined' ? JSON.parse(saved) : false;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
  });

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved && saved !== 'undefined' ? saved : 'pt';
  });

  // Estados de UI não persistentes
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);

  // Persiste mudanças no localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Funções helper (memoizadas para evitar re-criação)
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);
  const toggleFocusMode = useCallback(() => setFocusMode(prev => !prev), []);
  const togglePresentationMode = useCallback(() => setPresentationMode(prev => !prev), []);

  const addFavorite = useCallback((path) => {
    setFavorites(prev => {
      if (prev.includes(path)) {
        return prev;
      }
      return [...prev, path];
    });
  }, []);

  const removeFavorite = useCallback((path) => {
    setFavorites(prev => prev.filter(fav => fav !== path));
  }, []);

  const toggleFavorite = useCallback((path) => {
    setFavorites(prev => {
      if (prev.includes(path)) {
        return prev.filter(fav => fav !== path);
      }
      return [...prev, path];
    });
  }, []);

  return {
    // Estados
    sidebarOpen,
    darkMode,
    currentTime,
    userMenuOpen,
    notificationsOpen,
    searchOpen,
    searchQuery,
    favorites,
    commandPaletteOpen,
    focusMode,
    showKeyboardShortcuts,
    language,
    presentationMode,
    
    // Setters
    setSidebarOpen,
    setDarkMode,
    setUserMenuOpen,
    setNotificationsOpen,
    setSearchOpen,
    setSearchQuery,
    setFavorites,
    setCommandPaletteOpen,
    setFocusMode,
    setShowKeyboardShortcuts,
    setLanguage,
    setPresentationMode,
    
    // Helper functions
    toggleSidebar,
    toggleDarkMode,
    toggleFocusMode,
    togglePresentationMode,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
