// src/utils/tokenVersion.js

const TOKEN_VERSION = '2.0'; // Versão atual do token
const VERSION_KEY = 'token_version';

export function verificarVersaoToken() {
  const versaoAtual = localStorage.getItem(VERSION_KEY);
  
  // Se não tem versão ou é diferente, limpar tudo
  if (versaoAtual !== TOKEN_VERSION) {
    // Detectada mudança no sistema - limpando cache
    
    // Salvar o que precisa ser mantido
    const favorites = localStorage.getItem('favorites');
    const darkMode = localStorage.getItem('darkMode');
    const sidebarOpen = localStorage.getItem('sidebarOpen');
    const language = localStorage.getItem('language');
    
    // Limpar tudo
    localStorage.clear();
    
    // Restaurar preferências
    if (favorites) localStorage.setItem('favorites', favorites);
    if (darkMode) localStorage.setItem('darkMode', darkMode);
    if (sidebarOpen) localStorage.setItem('sidebarOpen', sidebarOpen);
    if (language) localStorage.setItem('language', language);
    
    // Marcar nova versão
    localStorage.setItem(VERSION_KEY, TOKEN_VERSION);
    
    // Redirecionar para login
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    
    return false; // Token inválido
  }
  
  return true; // Token válido
}

export function marcarVersaoToken() {
  localStorage.setItem(VERSION_KEY, TOKEN_VERSION);
}
