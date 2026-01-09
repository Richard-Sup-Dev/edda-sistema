// src/hooks/__tests__/useKeyboardShortcuts.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';
import { useNavigate } from 'react-router-dom';

// Mock do react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('useKeyboardShortcuts', () => {
  let navigate;
  let callbacks;

  beforeEach(() => {
    navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    callbacks = {
      onToggleSidebar: vi.fn(),
      onToggleDarkMode: vi.fn(),
      onToggleFocusMode: vi.fn(),
      onOpenCommandPalette: vi.fn(),
      onOpenSearch: vi.fn(),
      onShowShortcuts: vi.fn(),
      onLogout: vi.fn(),
    };

    delete window.dashboardShortcutBuffer;
  });

  afterEach(() => {
    delete window.dashboardShortcutBuffer;
  });

  it('deve retornar lista de atalhos', () => {
    const { result } = renderHook(() => useKeyboardShortcuts(callbacks));

    expect(result.current.shortcuts).toBeDefined();
    expect(Array.isArray(result.current.shortcuts)).toBe(true);
    expect(result.current.shortcuts.length).toBeGreaterThan(0);
  });

  it('deve ter atalhos categorizados', () => {
    const { result } = renderHook(() => useKeyboardShortcuts(callbacks));

    const categories = [...new Set(result.current.shortcuts.map(s => s.category))];
    expect(categories).toContain('Navegação');
    expect(categories).toContain('Visualização');
    expect(categories).toContain('Sistema');
  });

  it('deve ter atalhos com keys e description', () => {
    const { result } = renderHook(() => useKeyboardShortcuts(callbacks));

    result.current.shortcuts.forEach(shortcut => {
      expect(shortcut.keys).toBeDefined();
      expect(Array.isArray(shortcut.keys)).toBe(true);
      expect(shortcut.description).toBeDefined();
      expect(shortcut.category).toBeDefined();
    });
  });

  it('Ctrl+K deve abrir command palette', () => {
    renderHook(() => useKeyboardShortcuts(callbacks));

    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    
    window.dispatchEvent(event);

    expect(callbacks.onOpenCommandPalette).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('Ctrl+/ deve abrir busca', () => {
    renderHook(() => useKeyboardShortcuts(callbacks));

    const event = new KeyboardEvent('keydown', { key: '/', ctrlKey: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    
    window.dispatchEvent(event);

    expect(callbacks.onOpenSearch).toHaveBeenCalled();
  });

  it('Ctrl+B deve alternar sidebar', () => {
    renderHook(() => useKeyboardShortcuts(callbacks));

    const event = new KeyboardEvent('keydown', { key: 'b', ctrlKey: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    
    window.dispatchEvent(event);

    expect(callbacks.onToggleSidebar).toHaveBeenCalled();
  });

  it('? deve mostrar atalhos', () => {
    renderHook(() => useKeyboardShortcuts(callbacks));

    const event = new KeyboardEvent('keydown', { key: '?' });
    Object.defineProperty(event, 'target', { value: { tagName: 'DIV' } });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    
    window.dispatchEvent(event);

    expect(callbacks.onShowShortcuts).toHaveBeenCalled();
  });

  it('não deve interceptar ? em inputs', () => {
    renderHook(() => useKeyboardShortcuts(callbacks));

    const event = new KeyboardEvent('keydown', { key: '?' });
    Object.defineProperty(event, 'target', { value: { tagName: 'INPUT' } });
    
    window.dispatchEvent(event);

    expect(callbacks.onShowShortcuts).not.toHaveBeenCalled();
  });

  it('F deve alternar focus mode', () => {
    renderHook(() => useKeyboardShortcuts(callbacks));

    const event = new KeyboardEvent('keydown', { key: 'f' });
    Object.defineProperty(event, 'target', { value: { tagName: 'DIV' } });
    
    window.dispatchEvent(event);

    expect(callbacks.onToggleFocusMode).toHaveBeenCalled();
  });

  it('G+R deve navegar para relatórios', () => {
    renderHook(() => useKeyboardShortcuts(callbacks));

    const gEvent = new KeyboardEvent('keydown', { key: 'g' });
    Object.defineProperty(gEvent, 'target', { value: { tagName: 'DIV' } });
    window.dispatchEvent(gEvent);

    const rEvent = new KeyboardEvent('keydown', { key: 'r' });
    Object.defineProperty(rEvent, 'target', { value: { tagName: 'DIV' } });
    window.dispatchEvent(rEvent);

    expect(navigate).toHaveBeenCalledWith('/dashboard/relatorios');
  });

  it('G+C deve navegar para clientes', () => {
    renderHook(() => useKeyboardShortcuts(callbacks));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));

    expect(navigate).toHaveBeenCalledWith('/dashboard/clientes');
  });

  it('T+D deve alternar dark mode', () => {
    renderHook(() => useKeyboardShortcuts(callbacks));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 't' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));

    expect(callbacks.onToggleDarkMode).toHaveBeenCalled();
  });

  it('L+O deve fazer logout', () => {
    renderHook(() => useKeyboardShortcuts(callbacks));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'o' }));

    expect(callbacks.onLogout).toHaveBeenCalled();
  });

  it('deve limpar buffer após timeout', async () => {
    vi.useFakeTimers();
    renderHook(() => useKeyboardShortcuts(callbacks));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }));
    expect(window.dashboardShortcutBuffer).toBe('g');

    vi.advanceTimersByTime(1001);
    expect(window.dashboardShortcutBuffer).toBeUndefined();

    vi.useRealTimers();
  });
});
