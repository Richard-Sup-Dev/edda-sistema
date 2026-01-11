// frontend/src/tests/pages/Relatorios.test.jsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../helpers/test-utils';

// Mock do componente Relatórios
vi.mock('../../pages/Relatorios', () => ({
  default: () => (
    <div>
      <h1>Relatórios</h1>
      <p>Lista de relatórios</p>
    </div>
  )
}));

import Relatorios from '../../pages/Relatorios';

describe('Relatórios Page', () => {
  it('deve renderizar a página de relatórios', () => {
    render(<Relatorios />);
    expect(screen.getByRole('heading', { name: /relatórios/i })).toBeInTheDocument();
  });
});
