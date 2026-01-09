// src/tests/pages/Dashboard.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock do DataContext com dados mockados
vi.mock('@/contexts/DataContext', () => ({
  DataProvider: ({ children }) => children,
  useData: () => ({
    clientes: [],
    relatorios: [],
    pecas: [],
    servicos: [],
    loadClientes: vi.fn(),
    loadRelatorios: vi.fn(),
    loading: false,
    error: null
  })
}));

// Mock do tokenVersion para evitar erro de navegação
vi.mock('@/utils/tokenVersion', () => ({
  verificarVersaoToken: vi.fn()
}));

describe('Dashboard Page', () => {
  it('deve renderizar o dashboard', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeInTheDocument();
  });
});
