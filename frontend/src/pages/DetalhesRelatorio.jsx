// src/pages/DetalhesRelatorio.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ReportDetails from '@/features/reports/components/ReportDetails';

export default function DetalhesRelatorio() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Botão Voltar */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/dashboard/relatorios')}
        className="flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para Relatórios
      </motion.button>

      {/* Componente de Detalhes */}
      <ReportDetails 
        reportId={id} 
        onBack={() => navigate('/dashboard/relatorios')} 
      />
    </div>
  );
}
