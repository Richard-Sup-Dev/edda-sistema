import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Home, Users, FileText } from 'lucide-react';
import CommandPalette from '../CommandPalette';

describe('CommandPalette', () => {
  const mockCommands = [
    { label: 'Ir para Dashboard', action: vi.fn(), icon: Home },
    { label: 'Ver Clientes', action: vi.fn(), icon: Users },
    { label: 'Criar Relatório', action: vi.fn(), icon: FileText },
    { label: 'Gerenciar Peças', action: vi.fn(), icon: Home },
  ];

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockCommands.forEach(cmd => cmd.action.mockClear());
  });

  it('não renderiza quando isOpen é false', () => {
    const { container } = render(
      <CommandPalette isOpen={false} onClose={mockOnClose} commands={mockCommands} />
    );

    expect(screen.queryByPlaceholderText(/digite um comando/i)).not.toBeInTheDocument();
  });

  it('renderiza quando isOpen é true', () => {
    render(
      <CommandPalette isOpen={true} onClose={mockOnClose} commands={mockCommands} />
    );

    expect(screen.getByPlaceholderText(/digite para buscar comandos/i)).toBeInTheDocument();
  });

  it('exibe todos os comandos inicialmente', () => {
    render(
      <CommandPalette isOpen={true} onClose={mockOnClose} commands={mockCommands} />
    );

    expect(screen.getByText('Ir para Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ver Clientes')).toBeInTheDocument();
    expect(screen.getByText('Criar Relatório')).toBeInTheDocument();
    expect(screen.getByText('Gerenciar Peças')).toBeInTheDocument();
  });

  it('filtra comandos baseado na busca', async () => {
    render(
      <CommandPalette isOpen={true} onClose={mockOnClose} commands={mockCommands} />
    );

    const input = screen.getByPlaceholderText(/digite para buscar comandos/i);
    fireEvent.change(input, { target: { value: 'cliente' } });

    await waitFor(() => {
      expect(screen.getByText('Ver Clientes')).toBeInTheDocument();
      expect(screen.queryByText('Ir para Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Criar Relatório')).not.toBeInTheDocument();
    });
  });

  it('fecha a paleta ao clicar no backdrop', () => {
    const { container } = render(
      <CommandPalette isOpen={true} onClose={mockOnClose} commands={mockCommands} />
    );

    const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/50');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('executa comando ao clicar', async () => {
    render(
      <CommandPalette isOpen={true} onClose={mockOnClose} commands={mockCommands} />
    );

    const command = screen.getByText('Ver Clientes');
    fireEvent.click(command);

    await waitFor(() => {
      expect(mockCommands[1].action).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('navega para baixo com seta para baixo', async () => {
    render(
      <CommandPalette isOpen={true} onClose={mockOnClose} commands={mockCommands} />
    );

    const input = screen.getByPlaceholderText(/digite para buscar comandos/i);
    
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    await waitFor(() => {
      // O segundo item deve estar com destaque (índice 1)
      const commands = screen.getAllByRole('button');
      expect(commands[1]).toHaveClass('bg-orange-50');
    });
  });

  it('navega para cima com seta para cima', async () => {
    render(
      <CommandPalette isOpen={true} onClose={mockOnClose} commands={mockCommands} />
    );

    const input = screen.getByPlaceholderText(/digite para buscar comandos/i);
    
    // Vai para o segundo item
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // Volta para o primeiro
    fireEvent.keyDown(input, { key: 'ArrowUp' });

    await waitFor(() => {
      const commands = screen.getAllByRole('button');
      expect(commands[0]).toHaveClass('bg-orange-50');
    });
  });

  it('executa comando selecionado ao pressionar Enter', async () => {
    render(
      <CommandPalette isOpen={true} onClose={mockOnClose} commands={mockCommands} />
    );

    const input = screen.getByPlaceholderText(/digite para buscar comandos/i);
    
    // Seleciona o primeiro comando e executa
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(mockCommands[0].action).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('exibe mensagem quando não há resultados', async () => {
    render(
      <CommandPalette isOpen={true} onClose={mockOnClose} commands={mockCommands} />
    );

    const input = screen.getByPlaceholderText(/digite para buscar comandos/i);
    fireEvent.change(input, { target: { value: 'comando inexistente xyz' } });

    await waitFor(() => {
      expect(screen.getByText(/nenhum comando encontrado/i)).toBeInTheDocument();
    });
  });
});
