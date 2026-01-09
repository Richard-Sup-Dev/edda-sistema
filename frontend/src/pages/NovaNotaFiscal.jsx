// src/pages/NovaNotaFiscal.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Receipt } from 'lucide-react';
import CreateNF from '@/features/nf/components/CreateNF';

export default function NovaNotaFiscal() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Receipt className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">Nova Nota Fiscal</h1>
              <p className="text-gray-400 mt-1">Emita uma nota fiscal para o cliente</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </motion.button>
        </div>
      </motion.div>

      {/* Componente de Criação de NF */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CreateNF />
      </motion.div>
    </div>
  );
}
