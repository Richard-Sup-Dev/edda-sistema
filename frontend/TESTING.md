# 🧪 GUIA DE TESTES - Frontend

## 📋 Visão Geral

O frontend utiliza **Vitest** + **React Testing Library** para testes automatizados. Esta configuração oferece:

- ⚡ Testes ultra-rápidos (Vitest é baseado em Vite)
- 🎯 Testes focados no comportamento do usuário (Testing Library)
- 📊 Cobertura de código detalhada
- 🔄 Watch mode para desenvolvimento
- 🎨 UI interativa para visualização de testes

---

## 🚀 Primeiros Passos

### 1. Instalar Dependências

```bash
cd frontend
npm install
```

As seguintes dependências de teste já estão configuradas no `package.json`:

```json
{
  "@testing-library/jest-dom": "^6.6.4",
  "@testing-library/react": "^16.1.0",
  "@testing-library/user-event": "^14.5.2",
  "@vitest/ui": "^3.1.4",
  "jsdom": "^26.0.0",
  "vitest": "^3.1.4"
}
```

### 2. Executar Testes

```bash
# Rodar todos os testes
npm test

# Watch mode (re-executa ao salvar arquivos)
npm run test:watch

# UI interativa (abre interface visual)
npm run test:ui

# Gerar relatório de cobertura
npm run test:coverage
```

---

## 📁 Estrutura de Testes

```
frontend/src/tests/
├── setup.js                          # Configuração global dos testes
├── utils/
│   └── renderWithProviders.jsx      # Helper para renderizar com contexts
├── components/
│   └── LoadingSpinner.test.jsx      # Exemplo: teste de componente
├── hooks/
│   ├── useForm.test.js              # Exemplo: teste de hook
│   └── useToggle.test.js            # Exemplo: teste de hook
└── utils/
    └── dateUtils.test.js            # Exemplo: teste de utilitário
```

---

## 📝 Como Escrever Testes

### 1. Teste de Componente Simples

```jsx
// src/tests/components/Button.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from '@/components/ui/Button';

describe('Button Component', () => {
  it('deve renderizar o botão com texto', () => {
    render(<Button>Clique aqui</Button>);
    
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('deve chamar onClick ao clicar', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Clique</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('deve estar desabilitado quando disabled=true', () => {
    render(<Button disabled>Desabilitado</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 2. Teste de Componente com Context

```jsx
// src/tests/pages/Dashboard.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/tests/utils/renderWithProviders';

import Dashboard from '@/pages/Dashboard';

// Mock da API
vi.mock('@/services/apiClient', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
  },
}));

describe('Dashboard Page', () => {
  it('deve renderizar título da página', async () => {
    renderWithProviders(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });

  it('deve exibir loading inicial', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
```

### 3. Teste de Hook Customizado

```jsx
// src/tests/hooks/useCounter.test.js
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import useCounter from '@/hooks/useCounter';

describe('useCounter Hook', () => {
  it('deve inicializar com 0', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });

  it('deve incrementar contador', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('deve decrementar contador', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });
});
```

### 4. Teste de Função Utilitária

```jsx
// src/tests/utils/formatCurrency.test.js
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/utils/formatCurrency';

describe('formatCurrency', () => {
  it('deve formatar número como moeda brasileira', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
  });

  it('deve lidar com valores negativos', () => {
    expect(formatCurrency(-500)).toBe('-R$ 500,00');
  });

  it('deve retornar R$ 0,00 para valores inválidos', () => {
    expect(formatCurrency(NaN)).toBe('R$ 0,00');
    expect(formatCurrency(null)).toBe('R$ 0,00');
  });
});
```

---

## 🎯 Melhores Práticas

### 1. **Use queries semânticas (Testing Library)**

✅ **BOM:**
```jsx
screen.getByRole('button', { name: /enviar/i });
screen.getByLabelText('Email');
screen.getByText('Bem-vindo');
```

❌ **EVITE:**
```jsx
container.querySelector('.btn-submit');
container.querySelector('#email-input');
```

### 2. **Teste comportamento, não implementação**

✅ **BOM:**
```jsx
it('deve exibir mensagem de erro ao falhar login', async () => {
  render(<Login />);
  
  await userEvent.type(screen.getByLabelText('Email'), 'invalid@test.com');
  await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
  
  expect(await screen.findByText('Credenciais inválidas')).toBeInTheDocument();
});
```

❌ **EVITE:**
```jsx
it('deve chamar setState com erro', () => {
  // Testando implementação interna
});
```

### 3. **Use `waitFor` para operações assíncronas**

```jsx
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Dados carregados')).toBeInTheDocument();
});
```

### 4. **Mock de APIs externas**

```jsx
import { vi } from 'vitest';
import apiClient from '@/services/apiClient';

vi.mock('@/services/apiClient');

apiClient.get.mockResolvedValue({
  data: [{ id: 1, nome: 'Teste' }]
});
```

### 5. **Organize testes com `describe`**

```jsx
describe('LoginForm', () => {
  describe('Validação', () => {
    it('deve exibir erro se email inválido', () => {});
    it('deve exibir erro se senha vazia', () => {});
  });

  describe('Submissão', () => {
    it('deve chamar API ao submeter', () => {});
    it('deve redirecionar após sucesso', () => {});
  });
});
```

---

## 🔧 Configuração do Vitest

O arquivo `vitest.config.js` já está configurado:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,              // Habilita describe, it, expect globalmente
    environment: 'jsdom',       // Simula ambiente do navegador
    setupFiles: './src/tests/setup.js',
    css: true,                  // Suporte a CSS modules
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
      ],
    },
  },
});
```

---

## 📊 Cobertura de Código

### Visualizar relatório de cobertura:

```bash
npm run test:coverage
```

Isso gera um relatório em `coverage/index.html`. Abra no navegador para visualizar:

```bash
# Windows
start coverage/index.html

# Linux/Mac
open coverage/index.html
```

### Meta de cobertura recomendada:

- **Componentes críticos:** 90%+
- **Hooks:** 85%+
- **Utils:** 95%+
- **Geral:** 80%+

---

## 🐛 Debugging de Testes

### 1. **Usar `screen.debug()`**

```jsx
import { screen } from '@testing-library/react';

it('teste com debug', () => {
  render(<MyComponent />);
  
  screen.debug(); // Imprime o DOM atual
});
```

### 2. **Executar teste específico**

```bash
# Rodar apenas um arquivo
npm test Button.test.jsx

# Rodar testes que contêm "login" no nome
npm test -- --grep login
```

### 3. **VSCode Debugging**

Adicione ao `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Vitest Debug",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

---

## 📚 Recursos Adicionais

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## ✅ Checklist para Novos Componentes

Ao criar um novo componente, garanta:

- [ ] Teste de renderização básica
- [ ] Teste de props obrigatórias
- [ ] Teste de interações (cliques, inputs)
- [ ] Teste de estados condicionais
- [ ] Teste de acessibilidade (roles, labels)
- [ ] Teste de casos de erro
- [ ] Cobertura mínima de 80%

---

## 🎉 Exemplos Prontos

Veja os testes de exemplo em:

- `src/tests/components/LoadingSpinner.test.jsx`
- `src/tests/hooks/useForm.test.js`
- `src/tests/hooks/useToggle.test.js`
- `src/tests/utils/dateUtils.test.js`

Execute para ver funcionando:

```bash
npm test
```

---

**Documentação criada em:** 09/01/2026  
**Vitest:** 3.1.4  
**React Testing Library:** 16.1.0
