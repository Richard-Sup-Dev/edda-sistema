import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import Login from "@/pages/Login.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Clientes from "@/pages/Clientes.jsx";
import Pecas from "@/pages/Pecas.jsx";
import Servicos from "@/pages/Servicos.jsx";
import DashboardLayout from '@/components/layout/DashboardLayoutNew';
import ConfigPanel from "@/features/admin/ConfigPanel";
import ProfileSettings from "@/pages/Users/ProfileSettings.jsx"; 

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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-8xl font-bold text-orange-600 mb-8 animate-pulse">404</h1>
      <p className="text-4xl mb-6 text-gray-300">Ops! Página não encontrada</p>
      <p className="text-xl text-gray-500 mb-12">A página que você procura não existe ou foi movida.</p>
      
      <div className="flex gap-6">
        <button
          onClick={() => window.history.back()}
          className="px-8 py-4 bg-orange-600 hover:bg-orange-700 rounded-xl text-xl font-semibold transition transform hover:scale-105 shadow-lg"
        >
          ← Voltar
        </button>
        <button
          onClick={() => window.location.href = '/dashboard'}
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
        <Route element={<ProtectedRoute><DataProvider><DashboardLayout /></DataProvider></ProtectedRoute>}>
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

          {/* Caso alguém digite /dashboard/dashboard (evita loop) */}
          <Route path="dashboard" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* ========== CONFIGURAÇÕES DE PERFIL (tela cheia) ========== */}
        <Route
          path="/profile-settings"
          element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>}
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