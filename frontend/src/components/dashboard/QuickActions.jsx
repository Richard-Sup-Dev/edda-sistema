// src/components/dashboard/QuickActions.jsx
import { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * QuickActions - Botões de ação rápida flutuantes
 * 
 * Exibe botões de atalho no canto inferior direito para ações frequentes.
 * Cada botão tem ícone, cor temática e animação de entrada escalonada.
 * Pode ser mostrado/oculto condicionalmente (ex: modo foco).
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Array<Object>} props.actions - Lista de ações rápidas
 * @param {Function} props.actions[].action - Callback ao clicar
 * @param {string} props.actions[].label - Texto do botão
 * @param {React.Component} props.actions[].icon - Componente de ícone
 * @param {string} props.actions[].color - Cor do tema (ex: 'blue', 'green', 'orange')
 * @param {boolean} props.visible - Se os botões devem ser exibidos
 * 
 * @example
 * ```jsx
 * import { Plus, FileText, Users } from 'lucide-react';
 * 
 * const quickActions = [
 *   { label: 'Nova NF', action: () => navigate('/nf/nova'), icon: FileText, color: 'blue' },
 *   { label: 'Novo Cliente', action: () => navigate('/clientes/novo'), icon: Users, color: 'green' },
 *   { label: 'Adicionar', action: () => setModalOpen(true), icon: Plus, color: 'orange' },
 * ];
 * 
 * <QuickActions actions={quickActions} visible={!focusMode} />
 * ```
 * 
 * @features
 * - Animação escalonada (stagger)
 * - Hover effects com gradientes
 * - Posição fixa (bottom-right)
 * - Oculta automaticamente se visible=false
 */
const QuickActions = memo(function QuickActions({ actions, visible }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-6 right-6 flex flex-col gap-3 z-40"
    >
      {actions.map((action, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={action.action}
          className={`
            group flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg 
            bg-white hover:shadow-xl transition-all border border-${action.color}-200
            hover:border-${action.color}-300
          `}
          title={action.label}
        >
          <div className={`
            w-10 h-10 rounded-lg bg-linear-to-br from-${action.color}-100 to-${action.color}-50 
            flex items-center justify-center 
            group-hover:from-${action.color}-200 group-hover:to-${action.color}-100 
            transition-colors
          `}>
            <action.icon size={20} className={`text-${action.color}-600`} />
          </div>
          <span className="font-semibold text-gray-700 group-hover:text-gray-900">
            {action.label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
});

export default QuickActions;
