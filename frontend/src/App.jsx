import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import Login from "@/pages/Login.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Clientes from "@/pages/Clientes.jsx";
import Pecas from "@/pages/Pecas.jsx";
import Servicos from "@/pages/Servicos.jsx";
import Relatorios from "@/pages/Relatorios.jsx";
import CriarRelatorio from "@/pages/CriarRelatorio.jsx";
import DetalhesRelatorio from "@/pages/DetalhesRelatorio.jsx";
import NovaNotaFiscal from "@/pages/NovaNotaFiscal.jsx";
import Financeiro from "@/pages/Financeiro.jsx";
import Analises from "@/pages/Analises.jsx";
import Usuarios from "@/pages/Admin/Usuarios.jsx";
import Configuracoes from "@/pages/Admin/Configuracoes.jsx";
import Logs from "@/pages/Admin/Logs.jsx";
import Seguranca from "@/pages/Admin/Seguranca.jsx";
import DashboardLayout from '@/components/layout/DashboardLayout';
import ConfigPanel from "@/features/admin/ConfigPanel";
import ProfileSettings from "@/pages/Users/ProfileSettings.jsx";
import Profile from "@/pages/Profile.jsx";
import ChangePassword from "@/pages/ChangePassword.jsx";
import Help from "@/pages/Help.jsx"; 

// ===============================================
// 1. Protege rotas normais (qualquer usuário logado)
// ===============================================
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-orange-600 text-7xl font-bold animate-pulse">
        EDDA
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

// ===============================================
// 2. Bloqueia login se já estiver autenticado
// ===============================================
function LoginRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-orange-600 text-7xl font-bold animate-pulse">
        EDDA
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
}

// ===============================================
// 3. ROTA EXCLUSIVA DO ADMIN (só role: 'admin')
// ===============================================
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-orange-600 text-7xl font-bold animate-pulse">
        EDDA
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// ===============================================
// 4. Wrapper do Painel Admin (com botão fechar funcional)
// ===============================================
function AdminPanelWrapper() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard');
  };

  return <ConfigPanel isOpen={true} onClose={handleClose} />;
}

// ===============================================
// 5. Página 404 Personalizada
// ===============================================
function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-8xl font-bold text-orange-600 mb-8 animate-pulse">404</h1>
      <p className="text-4xl mb-6 text-gray-300">Ops! Página não encontrada</p>
      <p className="text-xl text-gray-500 mb-12">A página que você procura não existe ou foi movida.</p>
      
      <div className="flex gap-6">
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-4 bg-orange-600 hover:bg-orange-700 rounded-xl text-xl font-semibold transition transform hover:scale-105 shadow-lg"
        >
          ← Voltar
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-xl font-semibold transition transform hover:scale-105 shadow-lg"
        >
          Ir para Dashboard
        </button>
      </div>
    </div>
  );
}

// ===============================================
// APP PRINCIPAL
// ===============================================
function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* ========== LOGIN ========== */}
        <Route
          path="/login"
          element={<LoginRoute><Login /></LoginRoute>}
        />

        {/* ========== DASHBOARD COM LAYOUT (rotas aninhadas) ========== */}
        <Route path="/dashboard" element={<ProtectedRoute><DataProvider><DashboardLayout /></DataProvider></ProtectedRoute>}>
          {/* Dashboard principal com gráficos */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* CRUDS - Clientes */}
          <Route
            path="clientes"
            element={<Clientes />}
          />

          {/* CRUDS - Peças */}
          <Route
            path="pecas"
            element={<Pecas />}
          />

          {/* CRUDS - Serviços */}
          <Route
            path="servicos"
            element={<Servicos />}
          />

          {/* Relatórios */}
          <Route
            path="relatorios"
            element={<Relatorios />}
          />

          {/* Criar Novo Relatório */}
          <Route
            path="relatorios/novo"
            element={<CriarRelatorio />}
          />

          {/* Ver Detalhes do Relatório */}
          <Route
            path="relatorios/:id"
            element={<DetalhesRelatorio />}
          />

          {/* Nova Nota Fiscal */}
          <Route
            path="nf/nova"
            element={<NovaNotaFiscal />}
          />

          {/* Financeiro */}
          <Route
            path="financeiro"
            element={<Financeiro />}
          />

          {/* Análises */}
          <Route
            path="analises"
            element={<Analises />}
          />

          {/* Páginas Administrativas (somente admins) */}
          <Route
            path="usuarios"
            element={<AdminRoute><Usuarios /></AdminRoute>}
          />
          <Route
            path="configuracoes"
            element={<AdminRoute><Configuracoes /></AdminRoute>}
          />
          <Route
            path="logs"
            element={<AdminRoute><Logs /></AdminRoute>}
          />
          <Route
            path="seguranca"
            element={<AdminRoute><Seguranca /></AdminRoute>}
          />
        </Route>

        {/* ========== PERFIL DO USUÁRIO ========== */}
        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />

        {/* ========== CONFIGURAÇÕES DE PERFIL (tela cheia) ========== */}
        <Route
          path="/profile-settings"
          element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>}
        />

        {/* ========== TROCAR SENHA ========== */}
        <Route
          path="/change-password"
          element={<ProtectedRoute><ChangePassword /></ProtectedRoute>}
        />

        {/* ========== AJUDA ========== */}
        <Route
          path="/help"
          element={<ProtectedRoute><Help /></ProtectedRoute>}
        />

        {/* ========== PAINEL ADMINISTRATIVO (exclusivo para admins) ========== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanelWrapper />
            </AdminRoute>
          }
        />

        {/* ========== RAIZ - redireciona para dashboard ========== */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ========== 404 - Página não encontrada ========== */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;