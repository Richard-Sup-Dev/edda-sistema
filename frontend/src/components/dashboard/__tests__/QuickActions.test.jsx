import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Plus, FileText, Users, Package } from 'lucide-react';
import QuickActions from '../QuickActions';

describe('QuickActions', () => {
  const mockActions = [
    { label: 'Nova NF', action: vi.fn(), icon: FileText, color: 'blue' },
    { label: 'Novo Cliente', action: vi.fn(), icon: Users, color: 'green' },
    { label: 'Nova Peça', action: vi.fn(), icon: Package, color: 'orange' },
    { label: 'Adicionar', action: vi.fn(), icon: Plus, color: 'purple' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockActions.forEach(action => action.action.mockClear());
  });

  it('não renderiza quando visible é false', () => {
    const { container } = render(
      <QuickActions actions={mockActions} visible={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renderiza quando visible é true', () => {
    render(
      <QuickActions actions={mockActions} visible={true} />
    );

    expect(screen.getByText('Nova NF')).toBeInTheDocument();
    expect(screen.getByText('Novo Cliente')).toBeInTheDocument();
    expect(screen.getByText('Nova Peça')).toBeInTheDocument();
    expect(screen.getByText('Adicionar')).toBeInTheDocument();
  });

  it('renderiza todos os botões de ação', () => {
    render(
      <QuickActions actions={mockActions} visible={true} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('executa a ação correta ao clicar em um botão', async () => {
    render(
      <QuickActions actions={mockActions} visible={true} />
    );

    const novaNFButton = screen.getByText('Nova NF');
    fireEvent.click(novaNFButton);

    await waitFor(() => {
      expect(mockActions[0].action).toHaveBeenCalledTimes(1);
    });
  });

  it('executa apenas a ação do botão clicado', async () => {
    render(
      <QuickActions actions={mockActions} visible={true} />
    );

    const novoClienteButton = screen.getByText('Novo Cliente');
    fireEvent.click(novoClienteButton);

    await waitFor(() => {
      expect(mockActions[1].action).toHaveBeenCalledTimes(1);
      expect(mockActions[0].action).not.toHaveBeenCalled();
      expect(mockActions[2].action).not.toHaveBeenCalled();
      expect(mockActions[3].action).not.toHaveBeenCalled();
    });
  });

  it('exibe ícones para cada ação', () => {
    const { container } = render(
      <QuickActions actions={mockActions} visible={true} />
    );

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(4);
  });

  it('aplica classes de cor específicas para cada botão', () => {
    render(
      <QuickActions actions={mockActions} visible={true} />
    );

    const novaNFButton = screen.getByText('Nova NF').closest('button');
    expect(novaNFButton?.className).toContain('blue');

    const novoClienteButton = screen.getByText('Novo Cliente').closest('button');
    expect(novoClienteButton?.className).toContain('green');
  });

  it('exibe title attribute para acessibilidade', () => {
    render(
      <QuickActions actions={mockActions} visible={true} />
    );

    const novaNFButton = screen.getByTitle('Nova NF');
    expect(novaNFButton).toBeInTheDocument();

    const novoClienteButton = screen.getByTitle('Novo Cliente');
    expect(novoClienteButton).toBeInTheDocument();
  });

  it('está posicionado fixo no canto inferior direito', () => {
    const { container } = render(
      <QuickActions actions={mockActions} visible={true} />
    );

    const actionsContainer = container.querySelector('.fixed.bottom-6.right-6');
    expect(actionsContainer).toBeInTheDocument();
  });

  it('renderiza em layout de coluna (flex-col)', () => {
    const { container } = render(
      <QuickActions actions={mockActions} visible={true} />
    );

    const actionsContainer = container.querySelector('.flex.flex-col');
    expect(actionsContainer).toBeInTheDocument();
  });

  it('renderiza sem erros com lista vazia', () => {
    render(
      <QuickActions actions={[]} visible={true} />
    );

    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('renderiza corretamente com uma única ação', () => {
    const singleAction = [mockActions[0]];

    render(
      <QuickActions actions={singleAction} visible={true} />
    );

    expect(screen.getByText('Nova NF')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
  });

  it('mantém z-index correto para sobreposição', () => {
    const { container } = render(
      <QuickActions actions={mockActions} visible={true} />
    );

    const actionsContainer = container.querySelector('.z-40');
    expect(actionsContainer).toBeInTheDocument();
  });
});
