import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useForm from '@/hooks/useForm';

describe('useForm Hook', () => {
  const initialValues = {
    name: '',
    email: '',
    age: 0,
  };

  let result;

  beforeEach(() => {
    const { result: hookResult } = renderHook(() => useForm(initialValues));
    result = hookResult;
  });

  it('deve inicializar com valores padrão', () => {
    expect(result.current.values).toEqual(initialValues);
  });

  it('deve atualizar valores ao chamar handleChange', () => {
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' }
      });
    });

    expect(result.current.values.name).toBe('John Doe');
  });

  it('deve resetar valores ao chamar reset', () => {
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' }
      });
    });

    expect(result.current.values.email).toBe('test@example.com');

    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
  });

  it('deve definir valores customizados com setValues', () => {
    const newValues = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      age: 25,
    };

    act(() => {
      result.current.setValues(newValues);
    });

    expect(result.current.values).toEqual(newValues);
  });

  it('deve lidar com múltiplos campos', () => {
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John' }
      });
      result.current.handleChange({
        target: { name: 'email', value: 'john@test.com' }
      });
      result.current.handleChange({
        target: { name: 'age', value: '30' }
      });
    });

    expect(result.current.values).toEqual({
      name: 'John',
      email: 'john@test.com',
      age: '30',
    });
  });
});
