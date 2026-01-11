// backend/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from 'sequelize';
import User from '../models/User.js';
import { sendResetPasswordEmail } from '../utils/email.js';

class AuthController {
    // ==================== RENOVAR ACCESS TOKEN COM REFRESH TOKEN ====================
    async refreshToken(req, res) {
      try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({ erro: 'Refresh token ausente.' });
        }

        // Busca usuário com esse refresh token válido
        const user = await User.findOne({
          where: {
            refreshToken,
            refreshTokenExpires: { [Op.gt]: new Date() }
          }
        });

        if (!user) {
          return res.status(401).json({ erro: 'Refresh token inválido ou expirado.' });
        }

        // Gera novo access token
        const accessToken = jwt.sign(
          { id: user.id, nome: user.nome, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '15m' }
        );

        // Atualiza cookie do access token
        // Não seta mais cookie de accessToken

        // Log de auditoria
        import('../config/logger.js').then(({ default: logger }) => {
          logger.info('Token renovado', { userId: user.id, email: user.email, ip: req.ip });
        });

        return res.json({ mensagem: 'Token renovado com sucesso.' });
      } catch (error) {
        console.error('Erro ao renovar token:', error);
        return res.status(500).json({ erro: 'Erro ao renovar token.' });
      }
    }
  // ==================== LOGIN (COM PROTEÇÃO BRUTE FORCE) ====================
  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    try {
      const user = await User.findOne({ where: { email: email.toLowerCase() } });

      // Verifica se conta está bloqueada temporariamente
      if (user && user.lockUntil && user.lockUntil > Date.now()) {
        const minutosRestantes = Math.ceil((user.lockUntil - Date.now()) / 60000);
        return res.status(423).json({
          erro: `Conta bloqueada temporariamente. Tente novamente em ${minutosRestantes} minuto(s).`
        });
      }

      if (!user) {
        // Mesmo se usuário não existir, simula delay para evitar timing attacks (opcional)
        await bcrypt.compare(senha, '$2a$12$invalidhashparaevitartimingattack');
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      const senhaValida = await bcrypt.compare(senha, user.senha);

      if (!senhaValida) {
        // Incrementa tentativas falhas
        const attempts = (user.loginAttempts || 0) + 1;
        let updates = { loginAttempts: attempts };

        if (attempts >= 5) {
          updates.lockUntil = Date.now() + 15 * 60 * 1000; // Bloqueia por 15 minutos
        }

        await user.update(updates);

        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      // Login bem-sucedido → reseta contadores
      await user.update({
        loginAttempts: 0,
        lockUntil: null
      });

      // Geração do access token (curta duração)
      const accessToken = jwt.sign(
        { id: user.id, nome: user.nome, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      // Geração do refresh token (longa duração)
      const refreshToken = crypto.randomBytes(64).toString('hex');
      const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

      await user.update({ refreshToken, refreshTokenExpires });

      // Envia access token em cookie HttpOnly e refresh token em cookie seguro
      // Não seta mais cookies de accessToken nem refreshToken

      // Log de auditoria
      import('../config/logger.js').then(({ default: logger }) => {
        logger.info('Login realizado', { userId: user.id, email: user.email, ip: req.ip });
      });

      return res.json({
        mensagem: 'Login realizado com sucesso!',
        token: accessToken,
        user: { id: user.id, nome: user.nome, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // ==================== REGISTRO ====================
  async register(req, res) {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha)
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    if (nome.trim().length < 3)
      return res.status(400).json({ erro: 'Nome deve ter pelo menos 3 caracteres' });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ erro: 'Email inválido' });
    if (senha.length < 6)
      return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres' });

    try {
      const existe = await User.findOne({ where: { email: email.toLowerCase() } });
      if (existe) return res.status(400).json({ erro: 'Este email já está cadastrado' });

      const hash = await bcrypt.hash(senha, 12);

      const novoUsuario = await User.create({
        nome: nome.trim(),
        email: email.toLowerCase(),
        senha: hash,
        role: 'user',
        loginAttempts: 0, // inicializa
        lockUntil: null
      });

      return res.status(201).json({
        mensagem: 'Conta criada com sucesso!',
        usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email, role: 'user' }
      });
    } catch (error) {
      console.error('Erro no register:', error);
      return res.status(500).json({ erro: 'Erro ao criar conta' });
    }
  }

  // ==================== CRIAR PRIMEIRO ADMIN ====================
  async criarAdmin(req, res) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ erro: 'Operação não permitida em ambiente de produção' });
    }

    try {
      const adminExiste = await User.findOne({ where: { role: 'admin' } });
      if (adminExiste) return res.status(400).json({ erro: 'Já existe um administrador' });

      const hash = await bcrypt.hash('Admin@2025EDDA', 12);
      const admin = await User.create({
        nome: 'Administrador EDDA',
        email: 'admin@edda.com',
        senha: hash,
        role: 'admin',
        loginAttempts: 0,
        lockUntil: null
      });

      return res.json({
        mensagem: 'Administrador criado com sucesso!',
        credenciais: { email: 'admin@edda.com', senha: 'Admin@2025EDDA' }
      });
    } catch (error) {
      console.error('Erro ao criar admin:', error);
      return res.status(500).json({ erro: 'Erro ao criar administrador' });
    }
  }

  // ==================== VERIFICAR USUÁRIO LOGADO ====================
  async me(req, res) {
    return res.json({
      user: {
        id: req.user.id,
        nome: req.user.nome,
        email: req.user.email,
        role: req.user.role
      }
    });
  }

  // ==================== ALTERAR SENHA (USUÁRIO LOGADO) ====================
  async changePassword(req, res) {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        erro: 'Senha atual, nova senha e confirmação são obrigatórias' 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ erro: 'As senhas não coincidem' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        erro: 'A nova senha deve ter no mínimo 6 caracteres' 
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ 
        erro: 'A nova senha deve ser diferente da senha atual' 
      });
    }

    try {
      // Busca usuário completo no banco
      const user = await User.findByPk(req.user.id);
      
      if (!user) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      // Verifica se a senha atual está correta
      const senhaValida = await bcrypt.compare(currentPassword, user.senha);
      
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha atual incorreta' });
      }

      // Hash da nova senha
      const hash = await bcrypt.hash(newPassword, 12);

      // Atualiza senha e reseta contadores de segurança
      await user.update({
        senha: hash,
        loginAttempts: 0,
        lockUntil: null
      });

      // Log de auditoria
      import('../config/logger.js').then(({ default: logger }) => {
        logger.info('Senha alterada', { userId: user.id, email: user.email, ip: req.ip });
      });
      return res.json({ 
        sucesso: 'Senha alterada com sucesso!' 
      });

    } catch (error) {
      console.error('Erro no changePassword:', error);
      return res.status(500).json({ erro: 'Erro ao alterar senha' });
    }
  }

  // ==================== ESQUECI A SENHA → ENVIA EMAIL ====================
  async forgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ erro: 'E-mail é obrigatório' });
    }

    try {
      const user = await User.findOne({ where: { email: email.toLowerCase() } });

      if (user) {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 15 * 60 * 1000;

        await user.update({
          resetPasswordToken: token,
          resetPasswordExpires: expires
        });

        if (process.env.NODE_ENV !== 'production') {
          console.log(`Token de recuperação gerado para ${user.email}: ${token}`);
        }

        await sendResetPasswordEmail(user.email, token);
      }

      return res.json({
        sucesso: 'Se o e-mail estiver cadastrado, enviaremos um link de recuperação'
      });
    } catch (error) {
      console.error('Erro no forgotPassword:', error);
      return res.status(500).json({ erro: 'Erro no servidor ao processar solicitação' });
    }
  }

  // ==================== REDEFINIR SENHA COM TOKEN ====================
  async resetPassword(req, res) {
    const { token } = req.params;
    const { senha } = req.body;

    if (!senha || senha.length < 6)
      return res.status(400).json({ erro: 'Senha deve ter no mínimo 6 caracteres' });

    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: Date.now() }
        }
      });

      if (!user) return res.status(400).json({ erro: 'Link inválido ou expirado' });

      const hash = await bcrypt.hash(senha, 12);

      await user.update({
        senha: hash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        loginAttempts: 0,     // Reseta tentativas após trocar senha
        lockUntil: null
      });

      return res.json({ sucesso: 'Senha alterada com sucesso! Faça login com a nova senha.' });
    } catch (error) {
      console.error('Erro resetPassword:', error);
      return res.status(500).json({ erro: 'Erro no servidor' });
    }
  }
}

export default new AuthController();