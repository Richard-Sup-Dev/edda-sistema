// src/__tests__/utils/index.test.js

import { describe, it, expect } from '@jest/globals';
import { formatDate, textToHtmlList } from '../../utils/index.js';

describe('Utils - formatDate', () => {
  it('deve formatar data válida para dd/MM/yyyy', () => {
    const result = formatDate('2024-01-15');
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('deve formatar data ISO 8601 completa', () => {
    const result = formatDate('2024-01-15T10:30:00Z');
    expect(result).toMatch(/^\d{2}\/\d{2}\/2024$/);
  });

  it('deve retornar "Não informado" para data inválida', () => {
    expect(formatDate('data-invalida')).toBe('Não informado');
  });

  it('deve retornar "Não informado" para null', () => {
    expect(formatDate(null)).toBe('Não informado');
  });

  it('deve retornar "Não informado" para undefined', () => {
    expect(formatDate(undefined)).toBe('Não informado');
  });

  it('deve retornar "Não informado" para string vazia', () => {
    expect(formatDate('')).toBe('Não informado');
  });

  it('deve formatar corretamente data no início do mês', () => {
    const result = formatDate('2024-01-01');
    expect(result).toContain('/01/2024');
  });

  it('deve formatar corretamente data no final do mês', () => {
    const result = formatDate('2024-12-31');
    expect(result).toContain('/12/2024');
  });

  it('deve adicionar zero à esquerda em dias menores que 10', () => {
    const result = formatDate('2024-01-05');
    expect(result).toMatch(/^0\d\//);
  });

  it('deve adicionar zero à esquerda em meses menores que 10', () => {
    const result = formatDate('2024-03-15');
    expect(result).toMatch(/\/03\//);
  });
});

describe('Utils - textToHtmlList', () => {
  it('deve converter array de strings em lista HTML', () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    const result = textToHtmlList(items);
    
    expect(result).toContain('<ul>');
    expect(result).toContain('</ul>');
    expect(result).toContain('<li>Item 1</li>');
    expect(result).toContain('<li>Item 2</li>');
    expect(result).toContain('<li>Item 3</li>');
  });

  it('deve retornar lista com mensagem para array vazio', () => {
    const result = textToHtmlList([]);
    
    expect(result).toContain('<ul>');
    expect(result).toContain('Nenhum item listado');
  });

  it('deve retornar lista com mensagem para null', () => {
    const result = textToHtmlList(null);
    
    expect(result).toContain('<ul>');
    expect(result).toContain('Nenhum item listado');
  });

  it('deve retornar lista com mensagem para undefined', () => {
    const result = textToHtmlList(undefined);
    
    expect(result).toContain('<ul>');
    expect(result).toContain('Nenhum item listado');
  });

  it('deve manter <li> se já fornecidos', () => {
    const items = ['<li>Item 1</li>', '<li>Item 2</li>'];
    const result = textToHtmlList(items);
    
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>Item 1</li>');
    expect(result).toContain('<li>Item 2</li>');
  });

  it('deve escapar conteúdo HTML não intencional', () => {
    const items = ['Item com <script>alert("xss")</script>'];
    const result = textToHtmlList(items);
    
    expect(result).toContain('<ul>');
    // O conteúdo deve estar envolvido em <li>
    expect(result).toContain('<li>');
  });

  it('deve lidar com array com um único item', () => {
    const items = ['Único item'];
    const result = textToHtmlList(items);
    
    expect(result).toBe('<ul><li>Único item</li></ul>');
  });

  it('deve lidar com strings vazias no array', () => {
    const items = ['Item 1', '', 'Item 3'];
    const result = textToHtmlList(items);
    
    expect(result).toContain('<li>Item 1</li>');
    expect(result).toContain('<li></li>');
    expect(result).toContain('<li>Item 3</li>');
  });

  it('deve lidar com caracteres especiais', () => {
    const items = ['Item & Cia', 'Item "quoted"', "Item 'apostrophe'"];
    const result = textToHtmlList(items);
    
    expect(result).toContain('<ul>');
    expect(result).toContain('</ul>');
    expect(result.match(/<li>/g).length).toBe(3);
  });

  it('deve manter estrutura HTML válida', () => {
    const items = ['A', 'B', 'C'];
    const result = textToHtmlList(items);
    
    const openUl = (result.match(/<ul>/g) || []).length;
    const closeUl = (result.match(/<\/ul>/g) || []).length;
    const openLi = (result.match(/<li>/g) || []).length;
    const closeLi = (result.match(/<\/li>/g) || []).length;
    
    expect(openUl).toBe(1);
    expect(closeUl).toBe(1);
    expect(openLi).toBe(3);
    expect(closeLi).toBe(3);
  });
});
