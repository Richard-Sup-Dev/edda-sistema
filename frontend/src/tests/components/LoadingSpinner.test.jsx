import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('deve renderizar o spinner', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('deve exibir mensagem customizada quando fornecida', () => {
    const message = 'Carregando dados...';
    render(<LoadingSpinner message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('deve aplicar classe CSS customizada', () => {
    const customClass = 'my-custom-spinner';
    const { container } = render(<LoadingSpinner className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('deve renderizar com tamanho pequeno', () => {
    render(<LoadingSpinner size="small" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('deve renderizar com tamanho grande', () => {
    render(<LoadingSpinner size="large" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });
});
