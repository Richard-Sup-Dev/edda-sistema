// Script para limpar localStorage e forçar novo login
console.log('🧹 Limpando dados antigos do localStorage...');

localStorage.removeItem('token');
localStorage.removeItem('user');
localStorage.removeItem('sidebarOpen');
localStorage.removeItem('darkMode');
localStorage.removeItem('favorites');

console.log('✅ LocalStorage limpo! Recarregue a página e faça login novamente.');
console.log('📧 Email: admin@edda.com');
console.log('🔑 Senha: Admin@2025EDDA');
