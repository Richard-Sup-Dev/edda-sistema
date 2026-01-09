import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KeyboardShortcutsModal from '../KeyboardShortcutsModal';

describe('KeyboardShortcutsModal', () => {
  const mockShortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Abrir paleta de comandos', category: 'Geral' },
    { keys: ['Ctrl', '/'], description: 'Buscar', category: 'Geral' },
    { keys: ['G', 'R'], description: 'Ir para Relatórios', category: 'Navegação' },
    { keys: ['G', 'C'], description: 'Ir para Clientes', category: 'Navegação' },
    { keys: ['T', 'D'], description: 'Toggle dark mode', category: 'Tema' },
    { keys: ['?'], description: 'Mostrar atalhos', category: 'Ajuda' },
  ];

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('não renderiza quando isOpen é false', () => {
    const { container } = render(
      <KeyboardShortcutsModal isOpen={false} onClose={mockOnClose} shortcuts={mockShortcuts} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renderiza quando isOpen é true', () => {
    render(
      <KeyboardShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />
    );

    expect(screen.getByText('Atalhos de Teclado')).toBeInTheDocument();
  });

  it('exibe todos os atalhos', () => {
    render(
      <KeyboardShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />
    );

    // Verifica as descrições dos atalhos
    expect(screen.getByText('Abrir paleta de comandos')).toBeInTheDocument();
    expect(screen.getByText('Ir para Relatórios')).toBeInTheDocument();
    
    // Verifica que existem badges com as teclas (getAllByText pois aparecem múltiplas vezes)
    expect(screen.getAllByText('Ctrl').length).toBeGreaterThan(0);
    expect(screen.getAllByText('G').length).toBeGreaterThan(0);
  });

  it('agrupa atalhos por categoria', () => {
    render(
      <KeyboardShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />
    );

    expect(screen.getByText('Geral')).toBeInTheDocument();
    expect(screen.getByText('Navegação')).toBeInTheDocument();
    expect(screen.getByText('Tema')).toBeInTheDocument();
    expect(screen.getByText('Ajuda')).toBeInTheDocument();
  });

  it('fecha ao clicar no botão X', () => {
    render(
      <KeyboardShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />
    );

    // O botão X não tem label de texto, então pegamos pelo elemento button
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(btn => btn.querySelector('svg.lucide-x'));
    
    expect(closeButton).toBeDefined();
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('fecha ao clicar no backdrop', () => {
    const { container } = render(
      <KeyboardShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />
    );

    const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/50');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('exibe ícone de teclado no header', () => {
    const { container } = render(
      <KeyboardShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />
    );

    const keyboardIcon = container.querySelector('svg');
    expect(keyboardIcon).toBeInTheDocument();
  });

  it('renderiza teclas como badges', () => {
    const { container } = render(
      <KeyboardShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />
    );

    // Usa getAllByText pois 'Ctrl' aparece múltiplas vezes
    const ctrlBadges = screen.getAllByText('Ctrl');
    expect(ctrlBadges.length).toBeGreaterThan(0);
    expect(ctrlBadges[0]).toHaveClass('px-2', 'py-1');
  });

  it('agrupa corretamente quando categoria não é fornecida', () => {
    const shortcutsWithoutCategory = [
      { keys: ['F1'], description: 'Ajuda' },
      { keys: ['F2'], description: 'Renomear' },
    ];

    render(
      <KeyboardShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={shortcutsWithoutCategory} />
    );

    // Deve agrupar em "Geral" por padrão
    expect(screen.getByText('Geral')).toBeInTheDocument();
    expect(screen.getByText('F1')).toBeInTheDocument();
    expect(screen.getByText('F2')).toBeInTheDocument();
  });

  it('exibe múltiplos atalhos na mesma categoria', () => {
    render(
      <KeyboardShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />
    );

    // Categoria "Geral" tem 2 atalhos
    expect(screen.getByText('Abrir paleta de comandos')).toBeInTheDocument();
    expect(screen.getByText('Buscar')).toBeInTheDocument();
  });

  it('renderiza em layout de grid', () => {
    const { container } = render(
      <KeyboardShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />
    );

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
  });
});
