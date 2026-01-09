// src/components/dashboard/CommandPalette.jsx
import { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Search } from 'lucide-react';

/**
 * CommandPalette - Paleta de comandos estilo VSCode/Spotlight
 * 
 * Interface de busca rápida para executar ações no sistema. Suporta navegação
 * por teclado (setas + Enter), busca filtrada, e atalhos visuais.
 * Ativado via Ctrl+K.
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Se a paleta está aberta
 * @param {Function} props.onClose - Callback para fechar
 * @param {Array<Object>} props.commands - Lista de comandos disponíveis
 * @param {string} props.commands[].label - Nome do comando
 * @param {Function} props.commands[].action - Função a executar
 * @param {React.Component} props.commands[].icon - Ícone do comando
 * @param {string} [props.commands[].shortcut] - Atalho de teclado (opcional)
 * 
 * @example
 * ```jsx
 * const commands = [
 *   { label: 'Ir para Dashboard', action: () => navigate('/dashboard'), icon: Home },
 *   { label: 'Criar Cliente', action: () => navigate('/clientes/novo'), icon: UserPlus, shortcut: 'Ctrl+N' },
 *   { label: 'Buscar', action: () => setSearchOpen(true), icon: Search, shortcut: 'Ctrl+/' },
 * ];
 * 
 * <CommandPalette
 *   isOpen={commandPaletteOpen}
 *   onClose={() => setCommandPaletteOpen(false)}
 *   commands={commands}
 * />
 * ```
 * 
 * @features
 * - Busca instantânea com filtro
 * - Navegação por setas ↑/↓
 * - Execução com Enter
 * - Fecha com Esc ou backdrop
 * - Destaque do item selecionado
 */
const CommandPalette = memo(function CommandPalette({ isOpen, onClose, commands }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Filtra comandos baseado na query (memoizado)
  const filteredCommands = useMemo(() => 
    commands.filter(cmd =>
      cmd.label.toLowerCase().includes(query.toLowerCase())
    ),
    [commands, query]
  );

  // Executa comando selecionado (memoizado)
  const executeCommand = useCallback((cmd) => {
    if (cmd.action) cmd.action();
    onClose();
    setQuery('');
    setSelectedIndex(0);
  }, [onClose]);

  // Reseta seleção quando query muda
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Foca input quando abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Navegação por teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100"
        onClick={() => {
          onClose();
          setQuery('');
        }}
      />

      {/* Command Palette */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-101 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-linear-to-r from-orange-50 to-white">
          <div className="flex items-center gap-3">
            <Command size={20} className="text-orange-600" />
            <h3 className="font-bold text-gray-900">Command Palette</h3>
            <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
              <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">↑↓</kbd>
              <span>navegar</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">Enter</kbd>
              <span>selecionar</span>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite para buscar comandos..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Nenhum comando encontrado</p>
              <p className="text-sm mt-1">Tente outro termo de busca</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredCommands.map((cmd, index) => (
                <button
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${index === selectedIndex 
                      ? 'bg-orange-50 border-2 border-orange-200' 
                      : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <cmd.icon size={18} className={index === selectedIndex ? 'text-orange-600' : 'text-gray-600'} />
                  <span className={`flex-1 text-left font-medium ${index === selectedIndex ? 'text-gray-900' : 'text-gray-700'}`}>
                    {cmd.label}
                  </span>
                  {cmd.shortcut && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                      {cmd.shortcut}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export default CommandPalette;
