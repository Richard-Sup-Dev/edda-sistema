import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * ErrorBoundary - Componente de tratamento de erros React
 * 
 * Captura erros em componentes filhos e exibe uma UI de fallback
 * amigável ao usuário ao invés de crashar toda a aplicação.
 * 
 * @class ErrorBoundary
 * @extends {Component}
 * 
 * @example
 * ```jsx
 * <ErrorBoundary>
 *   <MinhaAplicacao />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para que a próxima renderização mostre a UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para o console em desenvolvimento
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Aqui você pode enviar o erro para um serviço de logging
    // Ex: Sentry, LogRocket, etc.
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorCount } = this.state;
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-linear-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-red-600 to-orange-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Ops! Algo deu errado</h1>
                  <p className="text-white/90 text-sm mt-1">
                    Não se preocupe, estamos trabalhando nisso
                  </p>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* Mensagem amigável */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700">
                  Detectamos um problema técnico inesperado. Você pode tentar:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Tentar novamente</li>
                  <li>• Recarregar a página</li>
                  <li>• Voltar para o início</li>
                </ul>
              </div>

              {/* Detalhes do erro (apenas em desenvolvimento) */}
              {isDevelopment && error && (
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold text-gray-700 cursor-pointer hover:text-gray-900">
                    🐛 Detalhes técnicos (Dev Mode)
                  </summary>
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Erro:</p>
                      <pre className="text-xs bg-red-50 text-red-800 p-2 rounded overflow-x-auto">
                        {error.toString()}
                      </pre>
                    </div>
                    {errorInfo && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Stack Trace:</p>
                        <pre className="text-xs bg-gray-100 text-gray-700 p-2 rounded overflow-x-auto max-h-40 overflow-y-auto">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                    {errorCount > 1 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <p className="text-xs text-yellow-800">
                          ⚠️ Este erro ocorreu <strong>{errorCount} vezes</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  Tentar Novamente
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <Home className="w-5 h-5" />
                  Voltar ao Início
                </button>
              </div>

              <button
                onClick={this.handleReload}
                className="w-full text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Ou recarregar a página completamente
              </button>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Se o problema persistir, entre em contato com o suporte técnico.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
