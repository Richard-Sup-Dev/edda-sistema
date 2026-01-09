// src/pages/NovaNotaFiscal.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import CreateNF from '@/features/nf/components/CreateNF';

export default function NovaNotaFiscal() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50">
      {/* Header Profissional */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Título e Breadcrumb */}
            <div className="flex items-center gap-4">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>Dashboard</span>
                  <span>/</span>
                  <span className="text-orange-600 font-semibold">Nova Nota Fiscal</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Emissão de Nota Fiscal
                </h1>
              </div>
            </div>

            {/* Badge de Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg"
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Sistema Ativo</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Cards de Informação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Passo 1</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Selecione o Cliente</h3>
            <p className="text-sm text-gray-600">Busque por nome, CNPJ ou número da O.S.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Passo 2</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Adicione os Itens</h3>
            <p className="text-sm text-gray-600">Inclua peças e serviços na nota fiscal</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Passo 3</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Gere a NF</h3>
            <p className="text-sm text-gray-600">Confirme e gere o documento fiscal</p>
          </div>
        </motion.div>

        {/* Alert de Informação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Informação Importante</h4>
            <p className="text-sm text-blue-700">
              Certifique-se de que todos os dados do cliente estão corretos antes de gerar a nota fiscal. 
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
          <CreateNF />
        </motion.div>

        {/* Footer com Ajuda */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            Precisa de ajuda? Entre em contato com o suporte através do menu{' '}
            <button 
              onClick={() => navigate('/dashboard/help')}
              className="text-orange-600 hover:text-orange-700 font-semibold underline"
            >
              Ajuda
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
