import React from 'react';
import { HelpCircle, BookOpen, MessageCircle, Video, Mail, FileText, ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Help() {
  const navigate = useNavigate();
  
  const helpSections = [
    {
      icon: BookOpen,
      title: 'Documentação',
      description: 'Guias completos sobre como usar o sistema',
      color: 'blue',
      items: [
        { title: 'Primeiros Passos', link: '#' },
        { title: 'Criar Relatórios', link: '#' },
        { title: 'Gestão de Clientes', link: '#' },
        { title: 'Catálogo de Peças', link: '#' }
      ]
    },
    {
      icon: Video,
      title: 'Vídeos Tutoriais',
      description: 'Aprenda visualmente com nossos tutoriais',
      color: 'red',
      items: [
        { title: 'Como criar um relatório', link: '#' },
        { title: 'Adicionar fotos ao relatório', link: '#' },
        { title: 'Gerar orçamentos', link: '#' },
        { title: 'Exportar PDF', link: '#' }
      ]
    },
    {
      icon: MessageCircle,
      title: 'Perguntas Frequentes',
      description: 'Respostas para dúvidas comuns',
      color: 'green',
      items: [
        { title: 'Como redefinir minha senha?', link: '#' },
        { title: 'Como cadastrar um cliente?', link: '#' },
        { title: 'Posso editar relatórios?', link: '#' },
        { title: 'Como adicionar peças?', link: '#' }
      ]
    }
  ];

  const faq = [
    {
      question: 'Como criar um novo relatório?',
      answer: 'Vá em "Criar Relatório" no menu, preencha os dados da O.S., selecione o cliente, escolha o tipo (Motor ou Bomba), adicione as fotos obrigatórias e clique em "Gerar Relatório PDF".'
    },
    {
      question: 'Posso editar um relatório após criar?',
      answer: 'Atualmente a edição de relatórios está em desenvolvimento. Por enquanto, você pode visualizar e baixar os relatórios criados.'
    },
    {
      question: 'Como adicionar orçamento ao relatório?',
      answer: 'Durante a criação do relatório, na Etapa 2, você encontrará a seção "Orçamento" onde pode adicionar peças cotadas e serviços cotados do catálogo.'
    },
    {
      question: 'Quantas fotos posso adicionar?',
      answer: 'Existem seções obrigatórias que requerem fotos específicas. Você pode ver o contador de fotos na parte superior do formulário indicando quantas fotos foram adicionadas.'
    },
    {
      question: 'Como cadastrar um novo cliente?',
      answer: 'Vá em "Clientes" no menu e clique no botão "Novo Cliente". Preencha os dados (CNPJ é obrigatório) e salve.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar ao Dashboard</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <HelpCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Central de Ajuda</h1>
              <p className="text-gray-600 mt-1">Encontre respostas e aprenda a usar o sistema</p>
            </div>
          </div>
        </div>

        {/* Help Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {helpSections.map((section, index) => {
            const Icon = section.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
              red: 'bg-red-100 text-red-600 hover:bg-red-200',
              green: 'bg-green-100 text-green-600 hover:bg-green-200'
            };

            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className={`w-12 h-12 ${colorClasses[section.color]} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item.link}
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                      >
                        {item.title}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faq.map((item, index) => (
              <details key={index} className="group">
                <summary className="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 rounded-lg font-medium text-gray-900 flex items-center gap-2 transition-colors">
                  <HelpCircle className="w-5 h-5 text-green-600 shrink-0" />
                  {item.question}
                </summary>
                <div className="p-4 border-l-4 border-green-500 bg-green-50 mt-2 rounded-lg">
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-linear-to-r from-orange-600 to-orange-700 rounded-lg p-8 text-white">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Ainda precisa de ajuda?</h3>
              <p className="text-orange-100 mb-4">
                Nossa equipe de suporte está pronta para ajudar você com qualquer dúvida ou problema.
              </p>
              <div className="flex gap-4">
                <a
                  href="mailto:natsunokill188@gmail.com"
                  className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Enviar Email
                </a>
                <a
                  href="https://github.com/Richard-Sup-Dev/edda-sistema/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-orange-800 hover:bg-orange-900 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Reportar Problema
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
