// src/hooks/useKeyboardShortcuts.js
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook personalizado para gerenciar atalhos de teclado globais do dashboard
 * 
 * Implementa 14+ atalhos de teclado com suporte a:
 * - Modificadores (Ctrl/Cmd)
 * - Sequências de teclas (ex: G depois R)
 * - Detecção de contexto (ignora inputs)
 * - Buffer temporário para sequências
 * 
 * @hook
 * @param {Object} handlers - Objeto com callbacks para cada ação
 * @param {Function} handlers.onToggleSidebar - Callback para toggle da sidebar (Ctrl+B)
 * @param {Function} handlers.onToggleDarkMode - Callback para toggle dark mode (T+D)
 * @param {Function} handlers.onToggleFocusMode - Callback para modo foco (F)
 * @param {Function} handlers.onOpenCommandPalette - Callback para paleta de comandos (Ctrl+K)
 * @param {Function} handlers.onOpenSearch - Callback para busca (Ctrl+/)
 * @param {Function} handlers.onShowShortcuts - Callback para modal de atalhos (?)
 * @param {Function} handlers.onLogout - Callback para logout (L+O)
 * 
 * @example
 * ```jsx
 * function Dashboard() {
 *   const [sidebarOpen, setSidebarOpen] = useState(true);
 *   const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
 *   
 *   useKeyboardShortcuts({
 *     onToggleSidebar: () => setSidebarOpen(prev => !prev),
 *     onOpenCommandPalette: () => setCommandPaletteOpen(true),
 *     onToggleDarkMode: () => document.body.classList.toggle('dark'),
 *   });
 *   
 *   return <div>...</div>;
 * }
 * ```
 * 
 * @atalhos
 * - Ctrl+K: Abrir paleta de comandos
 * - Ctrl+/: Abrir busca
 * - Ctrl+B: Toggle sidebar
 * - ?: Mostrar todos os atalhos
 * - G+R: Ir para Relatórios
 * - G+C: Ir para Clientes
 * - G+P: Ir para Peças
 * - G+S: Ir para Serviços
 * - G+F: Ir para Financeiro
 * - T+D: Toggle dark mode
 * - F: Modo foco
 * - L+O: Logout
 */
export function useKeyboardShortcuts({
  onToggleSidebar,
  onToggleDarkMode,
  onToggleFocusMode,
  onOpenCommandPalette,
  onOpenSearch,
  onShowShortcuts,
  onLogout,
}) {
  const navigate = useNavigate();

  const handleKeyPress = useCallback((e) => {
    // Ctrl/Cmd + K - Command Palette
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      onOpenCommandPalette?.();
      return;
    }

    // Ctrl/Cmd + / - Busca
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      onOpenSearch?.();
      return;
    }

    // Ctrl/Cmd + B - Toggle Sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      onToggleSidebar?.();
      return;
    }

    // ? - Mostrar atalhos
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const target = e.target;
      // Não ativar se estiver em input/textarea
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        onShowShortcuts?.();
        return;
      }
    }

    // Esc - Fechar modais
    if (e.key === 'Escape') {
      // Implementar lógica de fechar modais se necessário
      return;
    }

    // Sequências de teclas (sem modificadores)
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return; // Não interceptar quando estiver em campos de texto
      }

      // G + R - Ir para Relatórios
      if (e.key === 'g') {
        window.dashboardShortcutBuffer = 'g';
        setTimeout(() => {
          delete window.dashboardShortcutBuffer;
        }, 1000);
        return;
      }

      if (window.dashboardShortcutBuffer === 'g') {
        switch (e.key) {
          case 'r':
            navigate('/dashboard/relatorios');
            break;
          case 'c':
            navigate('/dashboard/clientes');
            break;
          case 'p':
            navigate('/dashboard/pecas');
            break;
          case 's':
            navigate('/dashboard/servicos');
            break;
          case 'f':
            navigate('/dashboard/financeiro');
            break;
          case 'a':
            navigate('/dashboard/analises');
            break;
          case 'h':
            navigate('/dashboard');
            break;
        }
        delete window.dashboardShortcutBuffer;
        return;
      }

      // L + O - Logout
      if (e.key === 'l') {
        window.dashboardShortcutBuffer = 'l';
        setTimeout(() => {
          delete window.dashboardShortcutBuffer;
        }, 1000);
        return;
      }

      if (window.dashboardShortcutBuffer === 'l' && e.key === 'o') {
        onLogout?.();
        delete window.dashboardShortcutBuffer;
        return;
      }

      // T + D - Toggle Dark Mode
      if (e.key === 't') {
        window.dashboardShortcutBuffer = 't';
        setTimeout(() => {
          delete window.dashboardShortcutBuffer;
        }, 1000);
        return;
      }

      if (window.dashboardShortcutBuffer === 't' && e.key === 'd') {
        onToggleDarkMode?.();
        delete window.dashboardShortcutBuffer;
        return;
      }

      // F - Modo Foco
      if (e.key === 'f') {
        if (!window.dashboardShortcutBuffer) {
          onToggleFocusMode?.();
        }
        return;
      }
    }
  }, [navigate, onToggleSidebar, onToggleDarkMode, onToggleFocusMode, onOpenCommandPalette, onOpenSearch, onShowShortcuts, onLogout]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      delete window.dashboardShortcutBuffer;
    };
  }, [handleKeyPress]);

  // Lista de atalhos disponíveis
  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Abrir Command Palette', category: 'Navegação' },
    { keys: ['Ctrl', '/'], description: 'Buscar', category: 'Navegação' },
    { keys: ['Ctrl', 'B'], description: 'Alternar Sidebar', category: 'Visualização' },
    { keys: ['?'], description: 'Mostrar Atalhos', category: 'Ajuda' },
    { keys: ['G', 'R'], description: 'Ir para Relatórios', category: 'Navegação' },
    { keys: ['G', 'C'], description: 'Ir para Clientes', category: 'Navegação' },
    { keys: ['G', 'P'], description: 'Ir para Peças', category: 'Navegação' },
    { keys: ['G', 'S'], description: 'Ir para Serviços', category: 'Navegação' },
    { keys: ['G', 'F'], description: 'Ir para Financeiro', category: 'Navegação' },
    { keys: ['G', 'A'], description: 'Ir para Análises', category: 'Navegação' },
    { keys: ['G', 'H'], description: 'Ir para Dashboard', category: 'Navegação' },
    { keys: ['T', 'D'], description: 'Alternar Tema Escuro', category: 'Visualização' },
    { keys: ['F'], description: 'Modo Foco', category: 'Visualização' },
    { keys: ['L', 'O'], description: 'Fazer Logout', category: 'Sistema' },
  ];

  return { shortcuts };
}
