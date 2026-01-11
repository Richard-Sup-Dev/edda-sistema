import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useToggle from '@/hooks/useToggle';

describe('useToggle Hook', () => {
  it('deve inicializar com valor false por padrão', () => {
    const { result } = renderHook(() => useToggle());
    
    expect(result.current[0]).toBe(false);
  });

  it('deve inicializar com valor inicial fornecido', () => {
    const { result } = renderHook(() => useToggle(true));
    
    expect(result.current[0]).toBe(true);
  });

  it('deve alternar valor ao chamar toggle', () => {
    const { result } = renderHook(() => useToggle(false));
    expect(result.current[0]).toBe(false);
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);
  });

  it('deve definir valor específico', () => {
    const { result } = renderHook(() => useToggle(false));
    
    act(() => {
      result.current[2](true);
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[2](false);
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('deve alternar múltiplas vezes', () => {
    const { result } = renderHook(() => useToggle());
    
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current[1]();
      });
    }
    
    expect(result.current[0]).toBe(false); // 10 toggles = volta ao estado inicial
  });
});
