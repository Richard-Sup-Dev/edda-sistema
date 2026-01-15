// src/pages/NovaNotaFiscal.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import CreateOrcamento from '@/features/nf/components/CreateOrcamento';

export default function NovaNotaFiscal() {
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

        {/* Badge de Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl"
        >
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">Sistema Ativo</span>
        </motion.div>
      </motion.div>

      {/* Cards de Informação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wide bg-blue-100 px-3 py-1 rounded-full">Passo 1</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Selecione o Cliente</h3>
          <p className="text-sm text-gray-600">Busque por nome, CNPJ ou número da O.S.</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wide bg-orange-100 px-3 py-1 rounded-full">Passo 2</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Adicione os Itens</h3>
          <p className="text-sm text-gray-600">Inclua peças e serviços no orçamento</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-bold text-green-600 uppercase tracking-wide bg-green-100 px-3 py-1 rounded-full">Passo 3</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Gere o Orçamento</h3>
          <p className="text-sm text-gray-600">Confirme e gere o orçamento</p>
        </div>
      </div>

      {/* Alert de Informação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-5 flex items-start gap-3"
      >
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Informação Importante</h4>
          <p className="text-sm text-blue-700">
            Certifique-se de que todos os dados do cliente estão corretos antes de gerar o orçamento. 
            O documento será gerado em PDF e estará disponível para download.
          </p>
        </div>
      </motion.div>

      {/* Formulário Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <CreateOrcamento />
      </motion.div>
    </div>
  );
}
