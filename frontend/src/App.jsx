import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import Login from "@/pages/Login.jsx";
import ErrorBoundary from '@/components/ErrorBoundary';

// Layout (crítico, carrega sempre)
import DashboardLayout from '@/components/dashboard/DashboardLayoutRefactored';

// Páginas com lazy loading
const Dashboard = lazy(() => import("@/pages/Dashboard.jsx"));
const Clientes = lazy(() => import("@/pages/Clientes.jsx"));
const Pecas = lazy(() => import("@/pages/Pecas.jsx"));
const Servicos = lazy(() => import("@/pages/Servicos.jsx"));
const Relatorios = lazy(() => import("@/pages/Relatorios.jsx"));
const CriarRelatorio = lazy(() => import("@/pages/CriarRelatorio.jsx"));
const DetalhesRelatorio = lazy(() => import("@/pages/DetalhesRelatorio.jsx"));
const NovaNotaFiscal = lazy(() => import("@/pages/NovaNotaFiscal.jsx"));
const Financeiro = lazy(() => import("@/pages/Financeiro.jsx"));
const Analises = lazy(() => import("@/pages/Analises.jsx"));
const Usuarios = lazy(() => import("@/pages/Admin/Usuarios.jsx"));
const Configuracoes = lazy(() => import("@/pages/Admin/Configuracoes.jsx"));
const Logs = lazy(() => import("@/pages/Admin/Logs.jsx"));
const Seguranca = lazy(() => import("@/pages/Admin/Seguranca.jsx"));
const ConfigPanel = lazy(() => import("@/features/admin/ConfigPanel"));
const Profile = lazy(() => import("@/pages/Profile.jsx"));
const ChangePassword = lazy(() => import("@/pages/ChangePassword.jsx"));
const Help = lazy(() => import("@/pages/Help.jsx"));
const AdminRoute = lazy(() => import("@/components/auth/AdminRoute.jsx")); 

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
// 3. Loading Suspense Component
// ===============================================
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-black text-orange-600 text-7xl font-bold animate-pulse">
      EDDA
    </div>
  );
}

// AdminRoute agora é importado de @/components/auth/AdminRoute.jsx

// ===============================================
// 4. Wrapper do Painel Admin (com botão fechar funcional)
// ===============================================
function AdminPanelWrapper() {
  const { useNavigate } = require('react-router-dom');
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfigPanel isOpen={true} onClose={handleClose} />
    </Suspense>
  );
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
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
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

          {/* ========== REDIRECT: /profile-settings → /profile ========== */}
          <Route
            path="/profile-settings"
            element={<Navigate to="/profile" replace />}
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

          {/* ========== CONFIGURAÇÕES DO SISTEMA (fullscreen - só admin) ========== */}
          <Route
            path="/configuracoes"
            element={<AdminRoute><Configuracoes /></AdminRoute>}
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
      </Suspense>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;