// src/__tests__/validations/userValidation.test.js

import { describe, it, expect } from '@jest/globals';
import { userSchema, userLoginSchema, userUpdateSchema, passwordResetSchema } from '../../validations/userValidation.js';

describe('UserValidation', () => {
  describe('userSchema - criação', () => {
    it('deve validar usuário válido completo', () => {
      const user = {
        nome: 'João Silva',
        email: 'joao@test.com',
        senha: 'senha123',
        role: 'user'
      };

      const { error, value } = userSchema.validate(user);
      expect(error).toBeUndefined();
      expect(value.email).toBe('joao@test.com');
    });

    it('deve converter email para lowercase', () => {
      const user = {
        nome: 'João',
        email: 'JOAO@TEST.COM',
        senha: 'senha123'
      };

      const { error, value } = userSchema.validate(user);
      expect(error).toBeUndefined();
      expect(value.email).toBe('joao@test.com');
    });

    it('deve usar role padrão "user"', () => {
      const user = {
        nome: 'João',
        email: 'joao@test.com',
        senha: 'senha123'
      };

      const { error, value } = userSchema.validate(user);
      expect(error).toBeUndefined();
      expect(value.role).toBe('user');
    });

    it('deve rejeitar sem nome', () => {
      const user = {
        email: 'joao@test.com',
        senha: 'senha123'
      };

      const { error } = userSchema.validate(user);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Nome é obrigatório');
    });

    it('deve rejeitar sem email', () => {
      const user = {
        nome: 'João',
        senha: 'senha123'
      };

      const { error } = userSchema.validate(user);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Email é obrigatório');
    });

    it('deve rejeitar email inválido', () => {
      const user = {
        nome: 'João',
        email: 'email-invalido',
        senha: 'senha123'
      };

      const { error } = userSchema.validate(user);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Email inválido');
    });

    it('deve rejeitar sem senha', () => {
      const user = {
        nome: 'João',
        email: 'joao@test.com'
      };

      const { error } = userSchema.validate(user);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Senha é obrigatória');
    });

    it('deve rejeitar senha muito curta', () => {
      const user = {
        nome: 'João',
        email: 'joao@test.com',
        senha: '12345'
      };

      const { error } = userSchema.validate(user);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('no mínimo 6 caracteres');
    });

    it('deve rejeitar senha muito longa', () => {
      const user = {
        nome: 'João',
        email: 'joao@test.com',
        senha: 'a'.repeat(101)
      };

      const { error } = userSchema.validate(user);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('não pode exceder 100 caracteres');
    });

    it('deve rejeitar role inválido', () => {
      const user = {
        nome: 'João',
        email: 'joao@test.com',
        senha: 'senha123',
        role: 'superuser'
      };

      const { error } = userSchema.validate(user);
      expect(error).toBeDefined();
    });

    it('deve aceitar role admin', () => {
      const user = {
        nome: 'João',
        email: 'joao@test.com',
        senha: 'senha123',
        role: 'admin'
      };

      const { error } = userSchema.validate(user);
      expect(error).toBeUndefined();
    });

    it('deve fazer trim no nome', () => {
      const user = {
        nome: '  João Silva  ',
        email: 'joao@test.com',
        senha: 'senha123'
      };

      const { error, value } = userSchema.validate(user);
      expect(error).toBeUndefined();
      expect(value.nome).toBe('João Silva');
    });

    it('deve rejeitar nome muito longo', () => {
      const user = {
        nome: 'A'.repeat(101),
        email: 'joao@test.com',
        senha: 'senha123'
      };

      const { error } = userSchema.validate(user);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('não pode exceder 100 caracteres');
    });

    it('deve rejeitar campos desconhecidos', () => {
      const user = {
        nome: 'João',
        email: 'joao@test.com',
        senha: 'senha123',
        campo_invalido: 'valor'
      };

      const { error } = userSchema.validate(user);
      expect(error).toBeDefined();
    });
  });

  describe('userLoginSchema', () => {
    it('deve validar login válido', () => {
      const login = {
        email: 'joao@test.com',
        senha: 'senha123'
      };

      const { error } = userLoginSchema.validate(login);
      expect(error).toBeUndefined();
    });

    it('deve converter email para lowercase', () => {
      const login = {
        email: 'JOAO@TEST.COM',
        senha: 'senha123'
      };

      const { error, value } = userLoginSchema.validate(login);
      expect(error).toBeUndefined();
      expect(value.email).toBe('joao@test.com');
    });

    it('deve rejeitar sem email', () => {
      const login = {
        senha: 'senha123'
      };

      const { error } = userLoginSchema.validate(login);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Email é obrigatório');
    });

    it('deve rejeitar sem senha', () => {
      const login = {
        email: 'joao@test.com'
      };

      const { error } = userLoginSchema.validate(login);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Senha é obrigatória');
    });

    it('deve rejeitar email inválido', () => {
      const login = {
        email: 'email-invalido',
        senha: 'senha123'
      };

      const { error } = userLoginSchema.validate(login);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Email inválido');
    });

    it('deve rejeitar campos desconhecidos', () => {
      const login = {
        email: 'joao@test.com',
        senha: 'senha123',
        campo_extra: 'valor'
      };

      const { error } = userLoginSchema.validate(login);
      expect(error).toBeDefined();
    });
  });

  describe('userUpdateSchema', () => {
    it('deve permitir atualização sem senha', () => {
      const update = {
        nome: 'João Atualizado',
        email: 'joao_novo@test.com'
      };

      const { error } = userUpdateSchema.validate(update);
      expect(error).toBeUndefined();
    });

    it('deve permitir atualização parcial', () => {
      const update = {
        nome: 'João Atualizado'
      };

      const { error } = userUpdateSchema.validate(update);
      expect(error).toBeUndefined();
    });

    it('deve validar senha se fornecida', () => {
      const update = {
        senha: '12345'
      };

      const { error } = userUpdateSchema.validate(update);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('no mínimo 6 caracteres');
    });

    it('deve validar email se fornecido', () => {
      const update = {
        email: 'email-invalido'
      };

      const { error } = userUpdateSchema.validate(update);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Email inválido');
    });
  });

  describe('passwordResetSchema', () => {
    it('deve validar reset de senha válido', () => {
      const reset = {
        senhaAtual: 'senha123',
        senhaNova: 'novaSenha123',
        senhaConfirmacao: 'novaSenha123'
      };

      const { error } = passwordResetSchema.validate(reset);
      expect(error).toBeUndefined();
    });

    it('deve rejeitar sem senha atual', () => {
      const reset = {
        senhaNova: 'novaSenha123',
        senhaConfirmacao: 'novaSenha123'
      };

      const { error } = passwordResetSchema.validate(reset);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Senha atual é obrigatória');
    });

    it('deve rejeitar sem nova senha', () => {
      const reset = {
        senhaAtual: 'senha123',
        senhaConfirmacao: 'novaSenha123'
      };

      const { error } = passwordResetSchema.validate(reset);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Nova senha é obrigatória');
    });

    it('deve rejeitar sem confirmação', () => {
      const reset = {
        senhaAtual: 'senha123',
        senhaNova: 'novaSenha123'
      };

      const { error } = passwordResetSchema.validate(reset);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Confirmação de senha é obrigatória');
    });

    it('deve rejeitar se senhas não correspondem', () => {
      const reset = {
        senhaAtual: 'senha123',
        senhaNova: 'novaSenha123',
        senhaConfirmacao: 'senhasDiferentes'
      };

      const { error } = passwordResetSchema.validate(reset);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Senhas não correspondem');
    });

    it('deve rejeitar se nova senha igual a atual', () => {
      const reset = {
        senhaAtual: 'senha123',
        senhaNova: 'senha123',
        senhaConfirmacao: 'senha123'
      };

      const { error } = passwordResetSchema.validate(reset);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Nova senha deve ser diferente da atual');
    });

    it('deve rejeitar nova senha muito curta', () => {
      const reset = {
        senhaAtual: 'senha123',
        senhaNova: '12345',
        senhaConfirmacao: '12345'
      };

      const { error } = passwordResetSchema.validate(reset);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('no mínimo 6 caracteres');
    });
  });
});
