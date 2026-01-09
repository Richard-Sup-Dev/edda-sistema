# TESTES FRONTEND - Prioridades Críticas

## Pendências identificadas na análise

### 1. Testes Clientes (CRÍTICO)
**Arquivo**: `frontend/src/__tests__/pages/Clientes.test.jsx` (criar)

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Clientes from '../../pages/Clientes';
import { AuthProvider } from '../../contexts/AuthContext';
import * as api from '../../services/api';

vi.mock('../../services/api');

const wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe('Clientes Page', () => {
  const mockClientes = [
    { id: 1, nome_fantasia: 'Empresa A', cnpj: '12345678000190' },
    { id: 2, nome_fantasia: 'Empresa B', cnpj: '98765432000100' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar lista de clientes', async () => {
    vi.spyOn(api, 'getClientes').mockResolvedValue({ data: mockClientes });

    render(<Clientes />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Empresa A')).toBeInTheDocument();
      expect(screen.getByText('Empresa B')).toBeInTheDocument();
    });
  });

  it('deve abrir modal de criação', async () => {
    vi.spyOn(api, 'getClientes').mockResolvedValue({ data: [] });

    render(<Clientes />, { wrapper });

    const btnNovo = screen.getByText('Novo Cliente');
    fireEvent.click(btnNovo);

    await waitFor(() => {
      expect(screen.getByText('Cadastrar Cliente')).toBeInTheDocument();
    });
  });

  it('deve criar novo cliente', async () => {
    vi.spyOn(api, 'getClientes').mockResolvedValue({ data: [] });
    vi.spyOn(api, 'createCliente').mockResolvedValue({ 
      data: { id: 3, nome_fantasia: 'Nova Empresa' } 
    });

    render(<Clientes />, { wrapper });

    const btnNovo = screen.getByText('Novo Cliente');
    fireEvent.click(btnNovo);

    // Preencher formulário
    const inputNome = screen.getByLabelText('Nome Fantasia');
    const inputCNPJ = screen.getByLabelText('CNPJ');

    fireEvent.change(inputNome, { target: { value: 'Nova Empresa' } });
    fireEvent.change(inputCNPJ, { target: { value: '11222333000144' } });

    const btnSalvar = screen.getByText('Salvar');
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(api.createCliente).toHaveBeenCalled();
    });
  });

  it('deve buscar clientes', async () => {
    vi.spyOn(api, 'getClientes').mockResolvedValue({ data: mockClientes });

    render(<Clientes />, { wrapper });

    const searchInput = screen.getByPlaceholderText('Buscar clientes...');
    fireEvent.change(searchInput, { target: { value: 'Empresa A' } });

    await waitFor(() => {
      expect(screen.getByText('Empresa A')).toBeInTheDocument();
      expect(screen.queryByText('Empresa B')).not.toBeInTheDocument();
    });
  });

  it('deve editar cliente', async () => {
    vi.spyOn(api, 'getClientes').mockResolvedValue({ data: mockClientes });
    vi.spyOn(api, 'updateCliente').mockResolvedValue({ 
      data: { id: 1, nome_fantasia: 'Empresa A Editada' } 
    });

    render(<Clientes />, { wrapper });

    await waitFor(() => {
      const btnEditar = screen.getAllByTestId('btn-editar')[0];
      fireEvent.click(btnEditar);
    });

    const inputNome = screen.getByLabelText('Nome Fantasia');
    fireEvent.change(inputNome, { target: { value: 'Empresa A Editada' } });

    const btnSalvar = screen.getByText('Salvar');
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(api.updateCliente).toHaveBeenCalledWith(1, expect.any(Object));
    });
  });

  it('deve deletar cliente', async () => {
    vi.spyOn(api, 'getClientes').mockResolvedValue({ data: mockClientes });
    vi.spyOn(api, 'deleteCliente').mockResolvedValue({ data: { success: true } });
    
    window.confirm = vi.fn(() => true);

    render(<Clientes />, { wrapper });

    await waitFor(() => {
      const btnDeletar = screen.getAllByTestId('btn-deletar')[0];
      fireEvent.click(btnDeletar);
    });

    expect(window.confirm).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(api.deleteCliente).toHaveBeenCalledWith(1);
    });
  });
});
```

### 2. Testes Relatórios (CRÍTICO)
**Arquivo**: `frontend/src/__tests__/pages/Relatorios.test.jsx` (criar)

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Relatorios from '../../pages/Relatorios';
import { AuthProvider } from '../../contexts/AuthContext';
import * as api from '../../services/api';

vi.mock('../../services/api');

const wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe('Relatórios Page', () => {
  const mockRelatorios = [
    { 
      id: 1, 
      os_numero: 'OS-001', 
      cliente: { nome_fantasia: 'Empresa A' },
      status: 'Em andamento',
      created_at: '2024-01-01'
    },
    { 
      id: 2, 
      os_numero: 'OS-002', 
      cliente: { nome_fantasia: 'Empresa B' },
      status: 'Concluído',
      created_at: '2024-01-02'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar lista de relatórios', async () => {
    vi.spyOn(api, 'getRelatorios').mockResolvedValue({ data: mockRelatorios });

    render(<Relatorios />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('OS-001')).toBeInTheDocument();
      expect(screen.getByText('OS-002')).toBeInTheDocument();
    });
  });

  it('deve filtrar por status', async () => {
    vi.spyOn(api, 'getRelatorios').mockResolvedValue({ data: mockRelatorios });

    render(<Relatorios />, { wrapper });

    await waitFor(() => {
      const selectStatus = screen.getByLabelText('Status');
      fireEvent.change(selectStatus, { target: { value: 'Concluído' } });
    });

    expect(screen.getByText('OS-002')).toBeInTheDocument();
    expect(screen.queryByText('OS-001')).not.toBeInTheDocument();
  });

  it('deve exportar para PDF', async () => {
    vi.spyOn(api, 'getRelatorios').mockResolvedValue({ data: mockRelatorios });
    vi.spyOn(api, 'exportPDF').mockResolvedValue({ data: new Blob() });

    render(<Relatorios />, { wrapper });

    await waitFor(() => {
      const btnExportar = screen.getByText('Exportar PDF');
      fireEvent.click(btnExportar);
    });

    expect(api.exportPDF).toHaveBeenCalled();
  });
});
```

### 3. Testes DashboardLayout (ALTO)
**Arquivo**: `frontend/src/__tests__/components/DashboardLayout.test.jsx` (criar)

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayoutRefactored';
import { AuthProvider } from '../../contexts/AuthContext';

const wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe('DashboardLayout', () => {
  it('deve renderizar sidebar', () => {
    render(<DashboardLayout />, { wrapper });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
  });

  it('deve alternar sidebar mobile', () => {
    render(<DashboardLayout />, { wrapper });
    
    const btnToggle = screen.getByTestId('sidebar-toggle');
    fireEvent.click(btnToggle);

    expect(screen.getByTestId('sidebar')).toHaveClass('open');
  });

  it('deve exibir notificações', () => {
    render(<DashboardLayout />, { wrapper });
    
    const btnNotif = screen.getByTestId('notifications-bell');
    fireEvent.click(btnNotif);

    expect(screen.getByText('Notificações')).toBeInTheDocument();
  });
});
```

### 4. Testes useWebSocket Hook (ALTO)
**Arquivo**: `frontend/src/__tests__/hooks/useWebSocket.test.js` (criar)

```javascript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useWebSocket from '../../hooks/useWebSocket';
import WS from 'vitest-websocket-mock';

describe('useWebSocket Hook', () => {
  let server;

  beforeEach(() => {
    server = new WS('ws://localhost:5000');
  });

  afterEach(() => {
    WS.clean();
  });

  it('deve conectar ao WebSocket', async () => {
    const { result } = renderHook(() => useWebSocket());

    await server.connected;
    
    expect(result.current.connected).toBe(true);
  });

  it('deve receber mensagens', async () => {
    const onMessage = vi.fn();
    const { result } = renderHook(() => useWebSocket({ onMessage }));

    await server.connected;

    act(() => {
      server.send(JSON.stringify({ type: 'notification', message: 'Test' }));
    });

    expect(onMessage).toHaveBeenCalledWith({ type: 'notification', message: 'Test' });
  });

  it('deve reconectar após desconexão', async () => {
    const { result } = renderHook(() => useWebSocket({ reconnect: true }));

    await server.connected;
    
    act(() => {
      server.close();
    });

    expect(result.current.connected).toBe(false);

    // Aguardar reconexão
    await new Promise(resolve => setTimeout(resolve, 5500));
    
    await server.connected;
    expect(result.current.connected).toBe(true);
  });
});
```

## Como executar

```bash
# Todos os testes
npm test

# Específico
npm test Clientes.test.jsx

# Com coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Configuração necessária

### package.json (adicionar)
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "devDependencies": {
    "vitest-websocket-mock": "^0.3.0"
  }
}
```

### vitest.config.js (verificar)
```javascript
export default {
  test: {
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/__tests__/']
    }
  }
};
```

## Meta de cobertura
- **Atual**: 60-70%
- **Target**: 80%+

## Prioridade de implementação
1. ✅ Clientes (CRÍTICO - CRUD principal)
2. ✅ Relatórios (CRÍTICO - core business)
3. ✅ DashboardLayout (ALTO - componente central)
4. ✅ useWebSocket (ALTO - real-time)
5. ⬜ AuthContext (MÉDIO - segurança)
6. ⬜ DataContext (MÉDIO - state management)
