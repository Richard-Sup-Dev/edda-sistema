import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserMenu from '../UserMenu';

describe('UserMenu', () => {
  const mockUser = {
    nome: 'João Silva',
    email: 'joao@example.com',
  };

  const mockOnClose = vi.fn();
  const mockOnNavigate = vi.fn();
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('não renderiza quando isOpen é false', () => {
    const { container } = render(
      <UserMenu
        isOpen={false}
        onClose={mockOnClose}
        user={mockUser}
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renderiza quando isOpen é true', () => {
    render(
      <UserMenu
        isOpen={true}
        onClose={mockOnClose}
        user={mockUser}
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />
    );

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
  });

  it('exibe todos os itens do menu', () => {
    render(
      <UserMenu
        isOpen={true}
        onClose={mockOnClose}
        user={mockUser}
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />
    );

    expect(screen.getByText('Meu Perfil')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
    expect(screen.getByText('Ajuda')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('fecha o menu ao clicar no backdrop', () => {
    const { container } = render(
      <UserMenu
        isOpen={true}
        onClose={mockOnClose}
        user={mockUser}
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />
    );

    const backdrop = container.querySelector('.fixed.inset-0');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('navega para perfil ao clicar em "Meu Perfil"', async () => {
    render(
      <UserMenu
        isOpen={true}
        onClose={mockOnClose}
        user={mockUser}
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />
    );

    const perfilButton = screen.getByText('Meu Perfil');
    fireEvent.click(perfilButton);

    await waitFor(() => {
      expect(mockOnNavigate).toHaveBeenCalledWith('/profile');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('navega para configurações ao clicar em "Configurações"', async () => {
    render(
      <UserMenu
        isOpen={true}
        onClose={mockOnClose}
        user={mockUser}
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />
    );

    const configButton = screen.getByText('Configurações');
    fireEvent.click(configButton);

    await waitFor(() => {
      expect(mockOnNavigate).toHaveBeenCalledWith('/configuracoes');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('navega para ajuda ao clicar em "Ajuda"', async () => {
    render(
      <UserMenu
        isOpen={true}
        onClose={mockOnClose}
        user={mockUser}
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />
    );

    const helpButton = screen.getByText('Ajuda');
    fireEvent.click(helpButton);

    await waitFor(() => {
      expect(mockOnNavigate).toHaveBeenCalledWith('/help');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('executa logout ao clicar em "Sair"', async () => {
    render(
      <UserMenu
        isOpen={true}
        onClose={mockOnClose}
        user={mockUser}
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />
    );

    const logoutButton = screen.getByText('Sair');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockOnLogout).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('exibe classes de perigo no botão de logout', () => {
    render(
      <UserMenu
        isOpen={true}
        onClose={mockOnClose}
        user={mockUser}
        onNavigate={mockOnNavigate}
        onLogout={mockOnLogout}
      />
    );

    const logoutButton = screen.getByText('Sair').closest('button');
    expect(logoutButton).toHaveClass('text-red-600');
  });
});
