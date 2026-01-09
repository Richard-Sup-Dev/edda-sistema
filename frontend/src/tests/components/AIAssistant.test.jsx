// src/tests/components/AIAssistant.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import AIAssistant from '@/components/AIAssistant';
import { renderWithRouterOnly } from '../helpers/test-utils';

// Mock do AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, nome: 'Test User', role: 'admin' }
  })
}));

describe('AIAssistant Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o botão do assistente', () => {
    renderWithRouterOnly(<AIAssistant />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
