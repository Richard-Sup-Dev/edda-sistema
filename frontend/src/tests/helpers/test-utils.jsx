// src/tests/helpers/test-utils.jsx
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

/**
 * Wrapper personalizado que inclui Router e AuthContext
 */
export function renderWithRouter(ui, options = {}) {
  const { route = '/', ...renderOptions } = options;

  window.history.pushState({}, 'Test page', route);

  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>,
    renderOptions
  );
}

/**
 * Wrapper apenas com Router
 */
export function renderWithRouterOnly(ui, options = {}) {
  const { route = '/', ...renderOptions } = options;

  window.history.pushState({}, 'Test page', route);

  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>,
    renderOptions
  );
}

// Re-export tudo do @testing-library/react
export * from '@testing-library/react';
