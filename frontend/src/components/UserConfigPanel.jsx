import React, { useState, useEffect } from 'react';
import { X, User, Lock, Shield } from 'lucide-react';

// Estilos reutilizáveis (mantidos consistentes com o Painel Admin)
const inputStyle = (readOnly = false) => ({
    width: '100%',
    padding: '14px',
    marginBottom: '16px',
    background: readOnly ? '#333' : '#111',
    border: readOnly ? '1px solid #555' : '1px solid #444',
    borderRadius: '12px',
    color: readOnly ? '#ccc' : '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box'
});

const btnStyle = {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
};

const UserConfigPanel = ({ isOpen, onClose, user }) => {
    // Simula o usuário logado (Richard Lima, Técnico)
    const [userData, setUserData] = useState({
        nome: user?.nome || 'Richard Lima',
        email: user?.email || 'richard.lima@edda.com',
        role: user?.role || 'Técnico', // Não pode ser alterado pelo usuário
        twoFactor: user?.twoFactor || false,
    });

    const [activeTab, setActiveTab] = useState('perfil'); // 'perfil' | 'seguranca'
    const [passwordFields, setPasswordFields] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [salvo, setSalvo] = useState(false);
    const [message, setMessage] = useState('');

    const handlePasswordChange = () => {
        setMessage('');
        
        // Simulação de validação
        if (!passwordFields.currentPassword || !passwordFields.newPassword || !passwordFields.confirmPassword) {
            setMessage('Preencha todos os campos de senha.');
            return;
        }
        if (passwordFields.newPassword !== passwordFields.confirmPassword) {
            setMessage('A nova senha e a confirmação não coincidem.');
            return;
        }
        if (passwordFields.newPassword.length < 6) {
            setMessage('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        // Simulação de sucesso
        setMessage('Senha alterada com sucesso!');
        setPasswordFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSalvo(true);
        setTimeout(() => setSalvo(false), 2500);
    };

    const handleProfileUpdate = () => {
        // Lógica real chamaria a API para atualizar nome/email
        setMessage('Perfil atualizado com sucesso!');
        setSalvo(true);
        setTimeout(() => setSalvo(false), 2500);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, right: 0, width: '400px', height: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            borderLeft: '2px solid #e74c3c',
            boxShadow: '-20px 0 50px rgba(123, 46, 36, 0.6)',
            zIndex: 9999,
            color: '#fff',
            overflowY: 'auto',
            fontFamily: '"Inter", sans-serif'
        }}>
            <div style={{ padding: '2rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
                    <h2 style={{ color: '#e67e22', fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <User size={28} />
                        Minhas Configurações
                    </h2>
                    {/* Botão X corrigido */}
                    <button onClick={onClose} style={{ 
                        background: 'transparent', border: 'none', color: '#e74c3c', padding: '6px', cursor: 'pointer',
                        borderRadius: '50%', transition: 'background-color 0.2s ease', display: 'flex', alignItems: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(231, 76, 60, 0.2)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #444', paddingBottom: '1rem' }}>
                    <button onClick={() => setActiveTab('perfil')} style={{ ...btnStyle, background: activeTab === 'perfil' ? '#e67e22' : 'transparent' }}>
                        <User size={16} /> Perfil
                    </button>
                    <button onClick={() => setActiveTab('seguranca')} style={{ ...btnStyle, background: activeTab === 'seguranca' ? '#e74c3c' : 'transparent' }}>
                        <Lock size={16} /> Segurança
                    </button>
                </div>

                {message && (
                    <div style={{ background: message.includes('sucesso') ? '#27ae60' : '#e74c3c', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontWeight: 'bold' }}>
                        {message}
                    </div>
                )}

                {/* ==================== ABA PERFIL ==================== */}
                {activeTab === 'perfil' && (
                    <div>
                        <h3 style={{ color: '#e67e22', marginBottom: '1.5rem' }}>Informações Pessoais</h3>
                        
                        <input 
                            placeholder="Nome Completo" 
                            value={userData.nome} 
                            onChange={e => setUserData({...userData, nome: e.target.value})}
                            style={inputStyle(false)}
                        />
                        <input 
                            placeholder="E-mail" 
                            value={userData.email} 
                            onChange={e => setUserData({...userData, email: e.target.value})}
                            style={inputStyle(false)}
                        />
                        
                        {/* Função (Read-Only) */}
                        <input 
                            placeholder="Função (Não editável)" 
                            value={userData.role} 
                            style={inputStyle(true)} // Estilo de Read-Only
                            readOnly
                        />
                        
                        <button onClick={handleProfileUpdate} style={{ ...btnStyle, background: '#27ae60', width: '100%', marginTop: '1rem', padding: '12px' }}>
                            Atualizar Perfil
                        </button>
                    </div>
                )}

                {/* ==================== ABA SEGURANÇA ==================== */}
                {activeTab === 'seguranca' && (
                    <div>
                        <h3 style={{ color: '#e74c3c', marginBottom: '1.5rem' }}>Alterar Senha</h3>
                        <input 
                            type="password"
                            placeholder="Senha Atual" 
                            value={passwordFields.currentPassword} 
                            onChange={e => setPasswordFields({...passwordFields, currentPassword: e.target.value})}
                            style={inputStyle(false)}
                        />
                        <input 
                            type="password"
                            placeholder="Nova Senha" 
                            value={passwordFields.newPassword} 
                            onChange={e => setPasswordFields({...passwordFields, newPassword: e.target.value})}
                            style={inputStyle(false)}
                        />
                        <input 
                            type="password"
                            placeholder="Confirmar Nova Senha" 
                            value={passwordFields.confirmPassword} 
                            onChange={e => setPasswordFields({...passwordFields, confirmPassword: e.target.value})}
                            style={inputStyle(false)}
                        />
                        
                        <button onClick={handlePasswordChange} style={{ ...btnStyle, background: '#e67e22', width: '100%', marginTop: '1rem', padding: '12px' }}>
                            Salvar Nova Senha
                        </button>

                        <div style={{ borderTop: '1px solid #444', marginTop: '2rem', paddingTop: '2rem' }}>
                             <h3 style={{ color: '#f39c12', marginBottom: '1.5rem' }}>Autenticação de Dois Fatores (2FA)</h3>
                             
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '14px', borderRadius: '12px' }}>
                                <div>
                                    <strong style={{ color: '#f39c12' }}>2FA Pessoal</strong>
                                    <p style={{ fontSize: '0.9rem', color: '#aaa', margin: '4px 0 0 0' }}>Proteja sua conta individualmente.</p>
                                </div>
                                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={userData.twoFactor} 
                                        onChange={() => setUserData(prev => ({...prev, twoFactor: !prev.twoFactor}))} 
                                        style={{ opacity: 0, width: 0, height: 0 }} 
                                    />
                                    <span style={{ 
                                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                        backgroundColor: userData.twoFactor ? '#27ae60' : '#7f8c8d', 
                                        transition: '.4s', borderRadius: '34px' 
                                    }}></span>
                                    <span style={{ 
                                        position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px', 
                                        backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                        transform: userData.twoFactor ? 'translateX(26px)' : 'translateX(0)'
                                    }}></span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserConfigPanel;