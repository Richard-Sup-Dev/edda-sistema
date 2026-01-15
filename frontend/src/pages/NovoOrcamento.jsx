// src/pages/NovoOrcamento.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import CreateOrcamento from '@/features/nf/components/CreateOrcamento';

export default function NovoOrcamento() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Emissão de Orçamento
          </h1>
          <p className="text-gray-600 mt-2">Crie e emita orçamentos de forma rápida</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl"
        >
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">Sistema Ativo</span>
        </motion.div>
      </motion.div>
      {/* ...restante igual ao NovaNotaFiscal.jsx... */}
      <CreateOrcamento />
    </div>
  );
}
