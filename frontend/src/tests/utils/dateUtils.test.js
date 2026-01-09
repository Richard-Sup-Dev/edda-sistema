// src/tests/utils/dateUtils.test.js
import { describe, it, expect } from 'vitest';
import { formatDistanceToNow, formatDate, isValidDate } from '@/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDistanceToNow', () => {
    it('deve formatar data recente como "Agora mesmo"', () => {
      const now = new Date();
      const result = formatDistanceToNow(now);
      
      expect(result).toBe('Agora mesmo');
    });

    it('deve formatar minutos atrás', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatDistanceToNow(fiveMinutesAgo);
      
      expect(result).toContain('minutos');
    });

    it('deve formatar horas atrás', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = formatDistanceToNow(twoHoursAgo);
      
      expect(result).toContain('horas');
    });

    it('deve retornar string vazia para data inválida', () => {
      const result = formatDistanceToNow('invalid-date');
      
      expect(result).toBe('');
    });
  });

  describe('formatDate', () => {
    it('deve formatar data no formato padrão brasileiro', () => {
      const date = new Date('2026-01-09T15:30:00');
      const result = formatDate(date);
      
      expect(result).toMatch(/09\/01\/2026/);
    });

    it('deve formatar data com formato customizado', () => {
      const date = new Date('2026-01-09T15:30:00');
      const result = formatDate(date, 'yyyy-MM-dd');
      
      expect(result).toBe('2026-01-09');
    });

    it('deve retornar string vazia para data inválida', () => {
      const result = formatDate('invalid');
      
      expect(result).toBe('');
    });
  });

  describe('isValidDate', () => {
    it('deve retornar true para data válida', () => {
      const date = new Date('2026-01-09');
      
      expect(isValidDate(date)).toBe(true);
    });

    it('deve retornar false para data inválida', () => {
      const date = new Date('invalid');
      
      expect(isValidDate(date)).toBe(false);
    });

    it('deve retornar false para null', () => {
      expect(isValidDate(null)).toBe(false);
    });

    it('deve retornar false para undefined', () => {
      expect(isValidDate(undefined)).toBe(false);
    });
  });
});
