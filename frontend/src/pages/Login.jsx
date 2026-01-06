import useForm from '@/hooks/useForm';
import useToggle from '@/hooks/useToggle';
import usePasswordStrength from '@/hooks/usePasswordStrength';
import useRipple from '@/hooks/useRipple';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";


export default function Login() {
  const [mode, setMode] = useState('login');
  const [mensagem, setMensagem] = useState('');

  const { login, register, loading } = useAuth(); 
  const [erro, setErro] = useState(''); 
  const navigate = useNavigate();

  // Hooks de Formulário e UI
  const form = useForm({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const [mostrarSenha, toggleMostrarSenha] = useToggle(false);
  const { strength: forcaSenha, color: corForca, label: textoForca } = usePasswordStrength(form.values.senha);
  const handleRipple = useRipple();


  const endpoints = {
    login: '/api/auth/login',
    register: '/api/auth/register',
    forgot: '/api/auth/forgot-password'
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(''); // Limpa erros do useAuth
    setMensagem('');

    // Validações de interface (UI)
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

    // Chamada da lógica que está no Contexto
    const sucesso = mode === 'login'
      ? await login(form.values.email, form.values.senha)
      : await register(form.values);

    if (sucesso) {
      if (mode === 'login') {
        setMensagem('Login realizado! Redirecionando...');
        setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
      } else {
        setMensagem('Conta criada com sucesso! Agora faça login.');
        setMode('login');
        form.reset();
      }
    }
  };


  return (
    <>
      <Particles />

      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>

        {/* Logo grande no fundo */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '420px',
          fontWeight: 900,
          color: 'rgba(139,33,22,0.07)',
          pointerEvents: 'none',
          animation: 'slowRotate 80s linear infinite',
          letterSpacing: '20px'
        }}>EDDA</div>

        <div style={{
          background: 'rgba(20,20,20,0.92)',
          backdropFilter: 'blur(20px)',
          padding: '4rem 2.5rem',
          borderRadius: '32px',
          boxShadow: '0 30px 100px rgba(0,0,0,0.95), 0 0 0 1px rgba(123,46,36,0.4)',
          maxWidth: '460px',
          width: '100%',
          border: '1px solid rgba(123,46,36,0.3)',
          position: 'relative',
          zIndex: 10
        }}>

          {/* Logo + Título */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: '96px',
              height: '96px',
              background: 'linear-gradient(135deg, #7B2E24, #e67e22)',
              borderRadius: '24px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.5rem',
              fontWeight: 'bold',
              color: '#fff',
              boxShadow: '0 16px 50px rgba(123,46,36,0.6)',
              marginBottom: '1rem'
            }}>E</div>

            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: 900,
              background: 'linear-gradient(90deg, #e67e22, #f39c12)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0.5rem 0'
            }}>EDDA</h1>

            <p style={{ color: '#aaa', fontSize: '1.1rem', marginTop: '0.5rem' }}>
              {mode === 'login' ? 'Acesse sua conta' : mode === 'register' ? 'Crie sua conta' : 'Recupere seu acesso'}
            </p>
          </div>

          {/* Mensagens */}
          {mensagem && (
            <div style={{
              background: 'rgba(52,199,89,0.2)',
              border: '1px solid #34c759',
              color: '#34c759',
              padding: '14px',
              borderRadius: '14px',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: 600
            }}>{mensagem}</div>
          )}

          {erro && (
            <div style={{
              background: 'rgba(255,59,48,0.2)',
              border: '1px solid #ff3b30',
              color: '#ff3b30',
              padding: '14px',
              borderRadius: '14px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.95rem'
            }}>
              <AlertCircle size={20} /> {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && (
              <input
                name="nome"
                type="text"
                value={form.values.nome}
                onChange={form.handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(123,46,36,0.5)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Nome completo"
                required
                style={inputStyle}
              />
            )}

            <input
              name="email"
              type="email"
              value={form.values.email}
              onChange={form.handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#e67e22';
                e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(123,46,36,0.5)';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Email corporativo"
              required
              style={inputStyle}
            />

            {mode !== 'forgot' && (
              <>
                <input
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={form.values.senha}
                  onChange={form.handleChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#e67e22';
                    e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(123,46,36,0.5)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Senha segura"
                  required
                  style={inputStyle}
                />

                {mode === 'register' && (
                  <>
                    <input
                      name="confirmarSenha"
                      type={mostrarSenha ? 'text' : 'password'}
                      value={form.values.confirmarSenha}
                      onChange={form.handleChange}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#e67e22';
                        e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.3)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(123,46,36,0.5)';
                        e.target.style.boxShadow = 'none';
                      }}
                      placeholder="Confirmar senha"
                      required
                      style={inputStyle}
                    />

                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', color: '#aaa' }}>
                        <span>Força da senha</span>
                        <span style={{ color: corForca, fontWeight: 700 }}>{textoForca || '—'}</span>
                      </div>
                      <div style={{ height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${forcaSenha}%`,
                          background: corForca,
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }}></div>
                      </div>
                    </div>
                  </>
                )}

                {(mode === 'login' || mode === 'register') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '0.95rem', marginTop: '8px' }}>
                    <input
                      type="checkbox"
                      checked={mostrarSenha}
                      onChange={toggleMostrarSenha}
                      id="show-pass"
                      style={{ width: '16px', height: '16px', accentColor: '#e67e22', cursor: 'pointer' }}
                    />
                    <label htmlFor="show-pass" style={{ cursor: 'pointer', userSelect: 'none' }}>
                      Mostrar senha
                    </label>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              onMouseDown={handleRipple}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(230, 126, 34, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(230, 126, 34, 0.3)';
              }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                maxWidth: '420px',  // limita largura no desktop
                margin: '0 auto',   // centraliza e dá respiro nas laterais
                padding: '18px 24px',
                background: 'linear-gradient(135deg, #e67e22, #c0392b)',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(230, 126, 34, 0.3)',
                transform: 'translateY(0)',
                display: 'block'  // necessário pro margin auto funcionar
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <div className="spinner"></div> Processando...
                </span>
              ) : mode === 'login' ? 'Entrar no Sistema' :
                mode === 'register' ? 'Criar Minha Conta' : 'Enviar Link de Recuperação'}
            </button>
          </form>

          {/* Links */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            {mode === 'login' && (
              <>
                <button
                  onClick={() => setMode('register')}
                  style={linkStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHover)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, { color: '#e67e22', textShadow: 'none', transform: 'none' })}
                >
                  <UserPlus size={18} /> Criar nova conta
                </button>

                <button
                  onClick={() => setMode('forgot')}
                  style={linkStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHover)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, { color: '#e67e22', textShadow: 'none', transform: 'none' })}
                >
                  Esqueceu a senha?
                </button>
              </>
            )}

            {(mode === 'register' || mode === 'forgot') && (
              <button
                onClick={() => setMode('login')}
                style={linkStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, { color: '#e67e22', textShadow: 'none', transform: 'none' })}
              >
                <ArrowLeft size={18} /> Voltar ao login
              </button>
            )}
          </div>

          <p style={{ textAlign: 'center', marginTop: '3rem', color: '#666', fontSize: '0.8rem' }}>
            Sistema Relatórios Técnicos © 2025 • EDDA Energia
          </p>
        </div>
      </div>

      <style>{`
  @keyframes ripple {to { transform: scale(4); opacity: 0; }}
  @keyframes spin {to { transform: rotate(360deg); }}
  @keyframes slowRotate {from { transform: translate(-50%, -50%) rotate(0deg); }to { transform: translate(-50%, -50%) rotate(360deg); }}
  .ripple {position: absolute;border-radius: 50%;background: rgba(255,255,255,0.5);transform: scale(0);animation: ripple 0.8s ease-out;pointer-events: none;}
  .spinner {width: 22px;height: 22px;border: 3px solid #fff;border-top-color: transparent;border-radius: 50%;animation: spin 1s linear infinite;}

  /* === CORREÇÃO AUTOFILL === */
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-text-fill-color: #fff !important;
    -webkit-box-shadow: 0 0 0 1000px rgba(35,35,35,0.95) inset !important;
    box-shadow: 0 0 0 1000px rgba(35,35,35,0.95) inset !important;
    border: 1px solid rgba(123,46,36,0.5) !important;
    border-radius: 16px !important;
    transition: background-color 5000s ease-in-out 0s !important;
  }
  input:-webkit-autofill:focus {
    border-color: #e67e22 !important;
    box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.3), 0 0 0 1000px rgba(35,35,35,0.95) inset !important;
  }
`}</style>
    </>
  );
}


const inputStyle = {
  width: '100%',
  padding: '18px 20px',
  backgroundColor: 'rgba(35,35,35,0.95)',
  border: '1px solid rgba(123,46,36,0.5)',
  borderRadius: '16px',
  color: '#fff',
  fontSize: '1.05rem',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box',
  outline: 'none'
};

const linkStyle = {
  background: 'none',
  border: 'none',
  color: '#e67e22',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  padding: '14px 20px',
  borderRadius: '12px',
  transition: 'all 0.4s ease',
  width: 'fit-content',
  margin: '10px auto'  // centraliza e separa verticalmente
};

const linkHover = {
  color: '#ff9500',  // laranja mais brilhante
  textShadow: '0 0 12px rgba(255, 149, 0, 0.8)',  // glow laranja suave
  transform: 'translateY(-1px)'
};

// Partículas (inalteradas)
function Particles() {
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

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 50,
      size: Math.random() * 5 + 2,
      speedY: -(Math.random() * 2 + 0.8),
      color: Math.random() > 0.5 ? '#ff4000' : '#ff8c00',
      opacity: Math.random() * 0.6 + 0.3
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 25;
        ctx.shadowColor = p.color;
        ctx.fill();

        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.6;
        if (p.y < -50) {
          p.y = canvas.height + 50;
          p.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      canvas.remove();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return null;
}