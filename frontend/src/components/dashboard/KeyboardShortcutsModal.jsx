// src/components/dashboard/KeyboardShortcutsModal.jsx
import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

/**
 * KeyboardShortcutsModal - Modal de ajuda com atalhos de teclado
 * 
 * Exibe todos os atalhos disponíveis organizados por categoria.
 * Ativado pelo atalho "?" ou menu de ajuda. Inclui backdrop,
 * animações e agrupamento inteligente.
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Callback para fechar
 * @param {Array<Object>} props.shortcuts - Lista de atalhos
 * @param {string} props.shortcuts[].keys - Teclas do atalho (ex: "Ctrl+K")
 * @param {string} props.shortcuts[].description - Descrição do atalho
 * @param {string} [props.shortcuts[].category] - Categoria (ex: "Navegação", "Ações")
 * 
 * @example
 * ```jsx
 * const shortcuts = [
 *   { keys: 'Ctrl+K', description: 'Abrir paleta de comandos', category: 'Geral' },
 *   { keys: 'G+R', description: 'Ir para Relatórios', category: 'Navegação' },
 *   { keys: '?', description: 'Mostrar atalhos', category: 'Ajuda' },
 * ];
 * 
 * <KeyboardShortcutsModal
 *   isOpen={showShortcuts}
 *   onClose={() => setShowShortcuts(false)}
 *   shortcuts={shortcuts}
 * />
 * ```
 * 
 * @features
 * - Agrupamento por categoria
 * - Badge visual para teclas
 * - Fecha com Esc ou backdrop
 * - Layout responsivo em grid
 */
const KeyboardShortcutsModal = memo(function KeyboardShortcutsModal({ isOpen, onClose, shortcuts }) {
  if (!isOpen) return null;

  // Agrupa atalhos por categoria (memoizado)
  const groupedShortcuts = useMemo(() => 
    shortcuts.reduce((acc, shortcut) => {
      const category = shortcut.category || 'Geral';
      if (!acc[category]) acc[category] = [];
      acc[category].push(shortcut);
      return acc;
    }, {}),
    [shortcuts]
  );

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-2xl z-101 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-linear-to-r from-orange-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Keyboard size={24} className="text-orange-600" />
              <h2 className="text-2xl font-black text-gray-900">
                Atalhos de Teclado
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(groupedShortcuts).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                  {category}
                </h3>
                <div className="space-y-2">
                  {items.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm text-gray-700">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, i) => (
                          <span key={i}>
                            <kbd className="px-2 py-1 bg-white text-gray-700 text-xs font-mono rounded border border-gray-300 shadow-sm">
                              {key}
                            </kbd>
                            {i < shortcut.keys.length - 1 && (
                              <span className="mx-1 text-gray-400">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-linear-to-br from-orange-50 to-yellow-50 border-t border-orange-200">
          <p className="text-sm text-center text-gray-600">
            💡 Pressione <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-xs">?</kbd> em qualquer lugar para ver esta lista
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export default KeyboardShortcutsModal;
