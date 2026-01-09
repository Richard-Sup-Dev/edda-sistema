// src/tests/utils/renderWithProviders.jsx
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';

/**
 * Wrapper para renderizar componentes com todos os providers necessários
 */
export function renderWithProviders(ui, options = {}) {
  const { route = '/', ...renderOptions } = options;

  // Navegar para a rota especificada
  window.history.pushState({}, 'Test page', route);

  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Wrapper simples sem providers (para componentes puros)
 */
export function renderWithRouter(ui, options = {}) {
  const { route = '/', ...renderOptions } = options;

  window.history.pushState({}, 'Test page', route);

  function Wrapper({ children }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
