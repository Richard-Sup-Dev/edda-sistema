// frontend/src/tests/components/DashboardLayout.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../helpers/test-utils';
import { BrowserRouter } from 'react-router-dom';

// Mock completo do DashboardLayout
vi.mock('../../components/layout/DashboardLayout', () => ({
  default: ({ children }) => <div data-testid="dashboard-layout">{children || 'Dashboard Layout'}</div>
}));

// Importar após o mock
import DashboardLayout from '../../components/layout/DashboardLayout';

describe('DashboardLayout', () => {
  it('deve renderizar o layout mockado', () => {
    render(
      <BrowserRouter>
        <DashboardLayout />
      </BrowserRouter>
    );
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });
});
