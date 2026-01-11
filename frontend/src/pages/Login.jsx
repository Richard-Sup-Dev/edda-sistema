import useForm from '@/hooks/useForm';
import useToggle from '@/hooks/useToggle';
import usePasswordStrength from '@/hooks/usePasswordStrength';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, UserPlus, ArrowLeft, Eye, EyeOff, Mail, Lock, User, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from 'framer-motion';


export default function Login() {
  const [mode, setMode] = useState('login');
  const [mensagem, setMensagem] = useState('');

  const { login, register, loading } = useAuth(); 
  const [erro, setErro] = useState(''); 
  const navigate = useNavigate();

  const form = useForm({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const [mostrarSenha, toggleMostrarSenha] = useToggle(false);
  const { strength: forcaSenha, color: corForca, label: textoForca } = usePasswordStrength(form.values.senha);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    if (mode === 'register') {
      if (form.values.senha !== form.values.confirmarSenha) {
        setErro('As senhas não coincidem.');
        return;
      }
      if (forcaSenha < 60) {
        setErro('Use uma senha mais forte.');
        return;
      }
    }

    const sucesso = mode === 'login'
      ? await login(form.values.email, form.values.senha)
      : await register(form.values);

    if (sucesso) {
      if (mode === 'login') {
        setMensagem('Login realizado! Redirecionando...');
        setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
      } else {
        setMensagem('Conta criada com sucesso! Agora faça login.');
        setMode('login');
        form.reset();
      }
    }
  };

  return (
    <>
      <AnimatedBackground />

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8">
        {/* Grid de fundo */}
        <div className="absolute inset-0 bg-linear-to-br from-gray-950 via-orange-950/20 to-gray-950" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 110%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 110%)'
          }}
        />

        {/* Logo EDDA gigante no fundo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[280px] md:text-[420px] font-black text-orange-900/5 pointer-events-none select-none"
          style={{ letterSpacing: '20px' }}
        >
          EDDA
        </motion.div>

        {/* Container Principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Card Glassmorphism */}
          <div className="relative backdrop-blur-xl bg-linear-to-br from-gray-900/95 via-gray-900/90 to-gray-950/95 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-orange-500/20 overflow-hidden will-change-transform">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-transparent to-orange-600/10 opacity-50" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/15 rounded-full blur-2xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-600/10 rounded-full blur-2xl" />

            <div className="relative p-8 md:p-10">
              {/* Logo e Título */}
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-center mb-8"
              >
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="relative inline-block"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl flex items-center justify-center text-5xl font-black text-white shadow-lg shadow-orange-500/40 mb-4 mx-auto relative overflow-hidden will-change-transform">
                    <span className="relative z-10">E</span>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>

                <h1 className="text-5xl md:text-6xl font-black bg-linear-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent mb-2 tracking-tight">
                  EDDA
                </h1>
                <p className="text-gray-400 text-sm md:text-base flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-orange-500" />
                  {mode === 'login' ? 'Bem-vindo de volta' : mode === 'register' ? 'Crie sua conta' : 'Recupere seu acesso'}
                </p>
              </motion.div>

              {/* Mensagens */}
              <AnimatePresence>
                {mensagem && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-green-500/10 backdrop-blur-sm border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-4 text-center font-semibold flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {mensagem}
                  </motion.div>
                )}

                {erro && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 flex items-center gap-3"
                  >
                    <AlertCircle size={20} className="shrink-0" />
                    <span className="text-sm">{erro}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome (apenas no register) */}
                <AnimatePresence>
                  {mode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                        <input
                          name="nome"
                          type="text"
                          value={form.values.nome}
                          onChange={form.handleChange}
                          placeholder="Nome completo"
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-sm"
                          autoComplete="name"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 group-focus-within:text-orange-500 transition-colors drop-shadow" />
                  <input
                    name="email"
                    type="email"
                    value={form.values.email}
                    onChange={form.handleChange}
                    placeholder="Email corporativo"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-sm"
                    autoComplete="email"
                  />
                </div>

                {mode !== 'forgot' && (
                  <>
                    {/* Senha */}
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 group-focus-within:text-orange-500 transition-colors drop-shadow" />
                      <input
                        name="senha"
                        type={mostrarSenha ? 'text' : 'password'}
                        value={form.values.senha}
                        onChange={form.handleChange}
                        placeholder="Senha segura"
                        required
                        className="w-full pl-12 pr-12 py-3.5 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-sm"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={toggleMostrarSenha}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-500 transition-colors drop-shadow"
                        tabIndex={-1}
                        aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {/* Confirmar Senha (apenas no register) */}
                    <AnimatePresence>
                      {mode === 'register' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 group-focus-within:text-orange-500 transition-colors drop-shadow" />
                            <input
                              name="confirmarSenha"
                              type={mostrarSenha ? 'text' : 'password'}
                              value={form.values.confirmarSenha}
                              onChange={form.handleChange}
                              placeholder="Confirmar senha"
                              required
                              className="w-full pl-12 pr-4 py-3.5 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-sm"
                              autoComplete="new-password"
                            />
                          </div>

                          {/* Indicador de força */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Força da senha</span>
                              <span className="font-bold" style={{ color: corForca }}>{textoForca || '—'}</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${forcaSenha}%` }}
                                transition={{ duration: 0.3 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: corForca }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}

                {/* Botão Submit */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-4 mt-6 bg-linear-to-r from-orange-500 via-orange-600 to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        {mode === 'login' ? 'Entrar no Sistema' : mode === 'register' ? 'Criar Conta' : 'Enviar Link'}
                      </>
                    )}
                  </span>
                </motion.button>
              </form>

              {/* Links */}
              <div className="mt-8 space-y-3 text-center">
                <AnimatePresence mode="wait">
                  {mode === 'login' && (
                    <motion.div
                      key="login-links"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      <button
                        onClick={() => setMode('register')}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-xl transition-all font-medium"
                      >
                        <UserPlus size={18} />
                        Criar nova conta
                      </button>
                      <button
                        onClick={() => setMode('forgot')}
                        className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                      >
                        Esqueceu a senha?
                      </button>
                    </motion.div>
                  )}

                  {(mode === 'register' || mode === 'forgot') && (
                    <motion.button
                      key="back-link"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setMode('login')}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-xl transition-all font-medium"
                    >
                      <ArrowLeft size={18} />
                      Voltar ao login
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <p className="text-center mt-8 text-gray-500 text-xs">
                Sistema Relatórios Técnicos © 2025 • EDDA Energia
              </p>
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 -right-8 w-20 h-20 bg-linear-to-br from-orange-500/15 to-orange-600/15 rounded-full blur-xl will-change-transform"
          />
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-8 -left-8 w-24 h-24 bg-linear-to-br from-orange-600/15 to-orange-700/15 rounded-full blur-xl will-change-transform"
          />
        </motion.div>
      </div>
    </>
  );
}

// Background animado
function AnimatedBackground() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.5 ? '#ff6b00' : '#ff9500',
      opacity: Math.random() * 0.4 + 0.2
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        // Conexões
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.strokeStyle = `rgba(255, 107, 0, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        // Partículas
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      });
      
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (canvas) canvas.remove();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return null;
}
