// src/pages/administrator/ConfigPanel.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
    UserPlus, Trash2, Edit2, Circle, Shield, LogOut,
    Lock, Unlock, Download, RefreshCw
} from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Debounce
const useDebounce = (value, delay) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
};

const ConfigPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('empresa');
    const [config, setConfig] = useState({});
    const [usuarios, setUsuarios] = useState([]);
    const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '', confirmarSenha: '', role: 'user' });
    const [editando, setEditando] = useState(null);
    const [salvo, setSalvo] = useState(false);
    const [erro, setErro] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [loading, setLoading] = useState(false);
    const [userFormErrors, setUserFormErrors] = useState({});

    const [segurancaConfig, setSegurancaConfig] = useState({
        twoFactorAuth: false,
        ipBlocking: false,
        accessLogs: [],
        loginAttempts: 5,
        logRetentionDays: 30,
        activeSessions: []
    });

    // Carrega tudo do localStorage
    useEffect(() => {
        const configSalva = localStorage.getItem('configEmpresa');
        const usersSalvos = localStorage.getItem('usuariosSistema');
        const segurancaSalva = localStorage.getItem('segurancaSistema');

        if (configSalva) setConfig(JSON.parse(configSalva));
        else setConfig({
            nomeEmpresa: 'EDDA Soluções em GTD',
            cnpj: '12.345.678/0001-99',
            endereco: 'Rua das Acácias, 123 – São Paulo',
            telefone: '',
            proximaNF: '000001',
            cep: ''
        });

        if (usersSalvos) setUsuarios(JSON.parse(usersSalvos));
        else setUsuarios([
            { id: 1, nome: 'Administrador EDDA', email: 'admin@edda.com.br', role: 'admin', online: true, ultimoAcesso: new Date().toISOString(), bloqueado: false },
            { id: 2, nome: 'Richard Lima', email: 'natsunokill88@gmail.com', role: 'user', online: false, ultimoAcesso: new Date(Date.now() - 3600000).toISOString(), bloqueado: false }
        ]);

        if (segurancaSalva) {
            const saved = JSON.parse(segurancaSalva);
            setSegurancaConfig(prev => ({ ...prev, ...saved }));
        }
        addAccessLog('Painel administrativo aberto');
    }, []);

    // === FUNÇÕES COMPLETAS (TODAS AS QUE VOCÊ TINHA) ===
    const salvarConfig = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        localStorage.setItem('configEmpresa', JSON.stringify(config));
        localStorage.setItem('usuariosSistema', JSON.stringify(usuarios));
        const { activeSessions, ...toSave } = segurancaConfig;
        localStorage.setItem('segurancaSistema', JSON.stringify(toSave));
        setSalvo(true);
        setLoading(false);
        setTimeout(() => setSalvo(false), 3000);
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const adicionarUsuario = () => {
        setErro(''); setUserFormErrors({});
        const errors = {};
        if (!novoUsuario.nome) errors.nome = true;
        if (!novoUsuario.email || !isValidEmail(novoUsuario.email)) errors.email = true;
        if (!novoUsuario.senha) errors.senha = true;
        if (novoUsuario.senha !== novoUsuario.confirmarSenha) errors.confirmarSenha = true;

        if (Object.keys(errors).length > 0) {
            setUserFormErrors(errors);
            setErro('Preencha todos os campos corretamente.');
            return;
        }

        const novo = {
            id: Date.now(),
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            role: novoUsuario.role,
            online: false,
            ultimoAcesso: new Date().toISOString(),
            bloqueado: false
        };
        setUsuarios(prev => [...prev, novo]);
        setNovoUsuario({ nome: '', email: '', senha: '', confirmarSenha: '', role: 'user' });
        addAccessLog(`Novo usuário criado: ${novo.nome}`);
        setSalvo(true); setTimeout(() => setSalvo(false), 3000);
    };

    const iniciarEdicao = (u) => setEditando({ ...u, novaRole: u.role });
    const salvarEdicao = () => {
        setUsuarios(prev => prev.map(u => u.id === editando.id ? { ...u, nome: editando.nome, email: editando.email, role: editando.novaRole } : u));
        addAccessLog(`Usuário editado: ${editando.nome}`);
        setEditando(null);
        setSalvo(true); setTimeout(() => setSalvo(false), 3000);
    };

    const excluirUsuario = (id) => {
        if (!window.confirm('Excluir permanentemente este usuário?')) return;
        const nome = usuarios.find(u => u.id === id).nome;
        setUsuarios(prev => prev.filter(u => u.id !== id));
        addAccessLog(`Usuário excluído: ${nome}`);
        setSalvo(true); setTimeout(() => setSalvo(false), 3000);
    };

    const toggleBloqueio = (id) => {
        setUsuarios(prev => prev.map(u => {
            if (u.id === id) {
                addAccessLog(`Usuário ${u.bloqueado ? 'desbloqueado' : 'bloqueado'}: ${u.nome}`);
                return { ...u, bloqueado: !u.bloqueado };
            }
            return u;
        }));
    };

    const forceLogoutAll = () => {
        if (!window.confirm('Forçar logout de TODAS as sessões ativas?')) return;
        setSegurancaConfig(prev => ({ ...prev, activeSessions: [] }));
        addAccessLog('Logout global forçado');
        setSalvo(true); setTimeout(() => setSalvo(false), 3000);
    };

    const downloadLogs = () => {
        if (segurancaConfig.accessLogs.length === 0) { notifyWarning('Sem logs para baixar'); return; }
        const csv = "data:text/csv;charset=utf-8," +
            "Horário,Usuário,Ação\n" +
            segurancaConfig.accessLogs.map(l => `${l.timestamp},${l.user},"${l.action}"`).join("\n");
        const link = document.createElement('a');
        link.href = encodeURI(csv);
        link.download = `logs_edda_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        addAccessLog('Logs baixados em CSV');
        notifySuccess('Logs baixados com sucesso!');
    };

    const purgeOldLogs = () => {
        const days = segurancaConfig.logRetentionDays;
        if (!window.confirm(`Limpar logs com mais de ${days} dias?`)) return;
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        const kept = segurancaConfig.accessLogs.filter(l => l.id > cutoff);
        const removed = segurancaConfig.accessLogs.length - kept.length;
        setSegurancaConfig(prev => ({ ...prev, accessLogs: kept }));
        addAccessLog(`Logs antigos limpos (${removed} removidos)`);
    };

    const addAccessLog = (action) => {
        const log = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            user: user?.nome?.split(' ')[0] || 'Admin',
            action
        };
        setSegurancaConfig(prev => ({
            ...prev,
            accessLogs: [log, ...prev.accessLogs].slice(0, 100)
        }));
    };

    // Máscaras
    const handleCnpjChange = (e) => {
        let v = e.target.value.replace(/\D/g, '');
        v = v.replace(/^(\d{2})(\d)/, '$1.$2');
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
        v = v.replace(/(\d{4})(\d)/, '$1-$2');
        setConfig(prev => ({ ...prev, cnpj: v.slice(0, 18) }));
    };

    const handleCepChange = (e) => {
        let v = e.target.value.replace(/\D/g, '');
        v = v.replace(/^(\d{5})(\d)/, '$1-$2');
        setConfig(prev => ({ ...prev, cep: v.slice(0, 9) }));
    };

    const handleTelefoneChange = (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length <= 11) {
            v = v.replace(/^(\d{2})(\d)/, '($1) $2');
            v = v.replace(/(\d{5})(\d)/, '$1-$2');
        }
        setConfig(prev => ({ ...prev, telefone: v.slice(0, 15) }));
    };

    const formatLastAccess = (iso) => !iso ? 'Nunca' : new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

    const filteredUsers = useMemo(() => {
        if (!debouncedSearchTerm) return usuarios;
        const term = debouncedSearchTerm.toLowerCase();
        return usuarios.filter(u =>
            u.nome.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.role.toLowerCase().includes(term)
        );
    }, [usuarios, debouncedSearchTerm]);

    const getFieldStyle = (field) => userFormErrors[field]
        ? { ...inputStyleSmall, border: '2px solid #e74c3c' }
        : inputStyleSmall;

    const inputStyle = { width: '100%', padding: '16px', marginBottom: '16px', background: '#111', border: '1px solid #444', borderRadius: '12px', color: '#fff', fontSize: '1.1rem' };
    const inputStyleSmall = { ...inputStyle, padding: '12px', fontSize: '1rem' };
    const btnStyle = { padding: '12px 20px', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)', color: '#fff', fontFamily: '"Inter", sans-serif' }}>
            <div style={{ padding: '3rem', maxWidth: '1400px', margin: '0 auto' }}>


                {/* ==== BOTÃO VOLTAR – COLE AQUI ==== */}
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/dashboard')}   // mude '/dashboard' se o seu caminho for outro
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 28px',
                            background: 'transparent',
                            border: '2px solid #7B2E24',
                            borderRadius: '16px',
                            color: '#e67e22',
                            fontWeight: 'bold',
                            fontSize: '1.3rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={e => e.target.style.background = '#7B2E24'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}
                    >
                        <ArrowLeft size={28} />
                        VOLTAR AO DASHBOARD
                    </button>
                </div>
                {/* ==== FIM DO BOTÃO ==== */}

                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '4px solid #7B2E24' }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: '900', color: '#e67e22', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Shield size={70} /> PAINEL ADMINISTRATIVO
                    </h1>
                    <div style={{ fontSize: '1.8rem', color: '#f39c12' }}>
                        Olá, <strong>{user?.nome?.split(' ')[0] || 'Administrador'}</strong>!
                    </div>
                </div>

                {/* TABS */}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
                    {['empresa', 'usuarios', 'seguranca'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            style={{ padding: '18px 40px', background: activeTab === tab ? '#7B2E24' : 'transparent', border: '2px solid #7B2E24', borderRadius: '16px', color: '#fff', fontSize: '1.4rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>
                            {tab === 'empresa' ? 'Empresa' : tab === 'usuarios' ? `Usuários (${usuarios.length})` : 'Segurança'}
                        </button>
                    ))}
                </div>

                {/* ABA EMPRESA */}
                {activeTab === 'empresa' && (
                    <div>
                        <h2 style={{ fontSize: '2.5rem', color: '#e67e22', marginBottom: '2rem' }}>Configurações da Empresa</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                            <input placeholder="Nome da Empresa" value={config.nomeEmpresa || ''} onChange={e => setConfig({ ...config, nomeEmpresa: e.target.value })} style={inputStyle} />
                            <input placeholder="CNPJ" value={config.cnpj || ''} onChange={handleCnpjChange} maxLength={18} style={inputStyle} />
                            <input placeholder="CEP" value={config.cep || ''} onChange={handleCepChange} maxLength={9} style={inputStyle} />
                            <input placeholder="Endereço" value={config.endereco || ''} onChange={e => setConfig({ ...config, endereco: e.target.value })} style={inputStyle} />
                            <input placeholder="Telefone" value={config.telefone || ''} onChange={handleTelefoneChange} maxLength={15} style={inputStyle} />
                            <input placeholder="Próxima NF" value={config.proximaNF || ''} onChange={e => setConfig({ ...config, proximaNF: e.target.value })} style={inputStyle} />
                        </div>
                    </div>
                )}

                {/* ABA USUÁRIOS */}
                {activeTab === 'usuarios' && (
                    <div>
                        <h2 style={{ fontSize: '2.5rem', color: '#e67e22', marginBottom: '2rem' }}>Gestão de Usuários</h2>

                        <div style={{ background: '#111', padding: '2rem', borderRadius: '16px', marginBottom: '3rem' }}>
                            <h3 style={{ color: '#f39c12', marginBottom: '1rem' }}>Adicionar Novo Usuário</h3>
                            {erro && <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>{erro}</p>}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input placeholder="Nome completo" value={novoUsuario.nome} onChange={e => setNovoUsuario({ ...novoUsuario, nome: e.target.value })} style={getFieldStyle('nome')} />
                                <input placeholder="E-mail" value={novoUsuario.email} onChange={e => setNovoUsuario({ ...novoUsuario, email: e.target.value })} style={getFieldStyle('email')} />
                                <input type="password" placeholder="Senha" value={novoUsuario.senha} onChange={e => setNovoUsuario({ ...novoUsuario, senha: e.target.value })} style={getFieldStyle('senha')} />
                                <input type="password" placeholder="Confirmar Senha" value={novoUsuario.confirmarSenha} onChange={e => setNovoUsuario({ ...novoUsuario, confirmarSenha: e.target.value })} style={getFieldStyle('confirmarSenha')} />
                                <select value={novoUsuario.role} onChange={e => setNovoUsuario({ ...novoUsuario, role: e.target.value })} style={inputStyleSmall}>
                                    <option value="user">Técnico</option>
                                    <option value="admin">Administrador</option>
                                </select>
                                <button onClick={adicionarUsuario} style={{ ...btnStyle, background: '#27ae60', gridColumn: '1 / -1' }}>
                                    <UserPlus size={20} /> Adicionar Usuário
                                </button>
                            </div>
                        </div>

                        {editando && (
                            <div style={{ background: '#222', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '2px solid #e67e22' }}>
                                <h3 style={{ color: '#f39c12' }}>Editando: {editando.nome}</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                    <input value={editando.nome} onChange={e => setEditando({ ...editando, nome: e.target.value })} style={inputStyleSmall} />
                                    <input value={editando.email} onChange={e => setEditando({ ...editando, email: e.target.value })} style={inputStyleSmall} />
                                    <select value={editando.novaRole} onChange={e => setEditando({ ...editando, novaRole: e.target.value })} style={inputStyleSmall}>
                                        <option value="user">Técnico</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button onClick={salvarEdicao} style={{ ...btnStyle, background: '#27ae60' }}>Salvar</button>
                                        <button onClick={() => setEditando(null)} style={{ ...btnStyle, background: '#7f8c8d' }}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <input placeholder="Pesquisar usuários..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inputStyle, marginBottom: '2rem' }} />

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {filteredUsers.map(u => (
                                <div key={u.id} style={{ background: u.bloqueado ? '#300000' : '#111', padding: '2rem', borderRadius: '16px', border: u.bloqueado ? '2px solid #e74c3c' : '1px solid #333', opacity: u.bloqueado ? 0.7 : 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{u.nome}</div>
                                            <div style={{ color: '#aaa' }}>{u.email} • {u.role === 'admin' ? 'Administrador' : 'Técnico'}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                                <Circle size={14} fill={u.online ? '#2ecc71' : '#777'} stroke="none" />
                                                <span style={{ color: u.online ? '#2ecc71' : '#777' }}>{u.online ? 'Online' : 'Offline'}</span>
                                                {u.bloqueado && <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>(BLOQUEADO)</span>}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Último acesso: {formatLastAccess(u.ultimoAcesso)}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button onClick={() => iniciarEdicao(u)} style={{ ...btnStyle, background: '#f39c12', padding: '12px' }}><Edit2 size={20} /></button>
                                            <button onClick={() => toggleBloqueio(u.id)} style={{ ...btnStyle, background: u.bloqueado ? '#2ecc71' : '#e74c3c', padding: '12px' }}>
                                                {u.bloqueado ? <Unlock size={20} /> : <Lock size={20} />}
                                            </button>
                                            <button onClick={() => excluirUsuario(u.id)} style={{ ...btnStyle, background: '#e74c3c', padding: '12px' }}><Trash2 size={20} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ABA SEGURANÇA — COMPLETA COM TUDO */}
                {activeTab === 'seguranca' && (
                    <div>
                        <h2 style={{ fontSize: '2.5rem', color: '#e74c3c', marginBottom: '2rem' }}>Segurança Avançada</h2>

                        <div style={{ background: '#111', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ color: '#f39c12', fontSize: '1.3rem' }}>2FA (Autenticação em Dois Fatores)</strong>
                                    <p style={{ color: '#aaa', margin: '8px 0 0' }}>Adiciona camada extra de segurança</p>
                                </div>
                                <label style={{ position: 'relative', display: 'inline-block', width: '70px', height: '38px' }}>
                                    <input
                                        type="checkbox"
                                        checked={segurancaConfig.twoFactorAuth}
                                        onChange={() => setSegurancaConfig(prev => ({
                                            ...prev,
                                            twoFactorAuth: !prev.twoFactorAuth
                                        }))}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />

                                    {/* Trilho (fundo) */}
                                    <span style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        backgroundColor: segurancaConfig.twoFactorAuth ? '#27ae60' : '#333',
                                        borderRadius: '34px',
                                        transition: 'all 0.4s ease',
                                        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)',
                                        border: '2px solid #444'
                                    }} />

                                    {/* Bolinha deslizante */}
                                    <span style={{
                                        position: 'absolute',
                                        height: '30px',
                                        width: '30px',
                                        left: '4px',
                                        bottom: '4px',
                                        backgroundColor: '#fff',
                                        borderRadius: '50%',
                                        transition: 'all 0.4s ease',
                                        transform: segurancaConfig.twoFactorAuth ? 'translateX(32px)' : 'translateX(0)',
                                        boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
                                        border: '1px solid #111'
                                    }} />
                                </label>
                            </div>
                        </div>

                        <div style={{ background: '#111', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                            <h3 style={{ color: '#f39c12', marginBottom: '1rem' }}>Sessões Ativas ({segurancaConfig.activeSessions.length})</h3>
                            <button onClick={forceLogoutAll} style={{ ...btnStyle, background: '#e74c3c', marginBottom: '1rem' }}>
                                <LogOut size={20} /> Forçar Logout Global
                            </button>
                            <div style={{ background: '#000', padding: '1rem', borderRadius: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                                {segurancaConfig.activeSessions.length === 0 ? (
                                    <p style={{ color: '#2ecc71' }}>Nenhuma sessão ativa</p>
                                ) : (
                                    segurancaConfig.activeSessions.map(s => (
                                        <p key={s.id} style={{ color: '#ccc', fontSize: '0.95rem' }}>• {s.device} - {s.ip}</p>
                                    ))
                                )}
                            </div>
                        </div>

                        <div style={{ background: '#111', padding: '2rem', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ color: '#f39c12' }}>Logs de Acesso</h3>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={downloadLogs} style={{ ...btnStyle, background: '#3498db' }}><Download size={20} /> Baixar</button>
                                    <button onClick={purgeOldLogs} style={{ ...btnStyle, background: '#e67e22' }}><RefreshCw size={20} /> Limpar</button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{ color: '#aaa' }}>Reter logs por:</span>
                                <input type="number" min="7" max="365" value={segurancaConfig.logRetentionDays} onChange={e => setSegurancaConfig(prev => ({ ...prev, logRetentionDays: parseInt(e.target.value) || 30 }))} style={{ width: '80px', padding: '8px', background: '#222', border: '1px solid #444', borderRadius: '8px', color: '#fff' }} />
                                <span style={{ color: '#aaa' }}>dias</span>
                            </div>
                            <div style={{ background: '#000', padding: '1rem', borderRadius: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                                {segurancaConfig.accessLogs.length === 0 ? (
                                    <p style={{ color: '#aaa' }}>Nenhum log registrado</p>
                                ) : (
                                    segurancaConfig.accessLogs.map(log => (
                                        <p key={log.id} style={{ color: '#ccc', fontSize: '0.9rem' }}>
                                            [{log.timestamp}] <strong>{log.user}</strong>: {log.action}
                                        </p>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* BOTÃO SALVAR */}
                <button onClick={salvarConfig} disabled={loading}
                    style={{
                        width: '100%',
                        padding: '28px',
                        background: salvo ? '#27ae60' : 'linear-gradient(135deg, #7B2E24, #e67e22)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '24px',
                        fontSize: '2.2rem',
                        fontWeight: 'bold',
                        marginTop: '5rem',
                        cursor: 'pointer',
                        boxShadow: '0 15px 40px rgba(123, 46, 36, 0.7)',
                        transition: 'all 0.4s'
                    }}>
                    {loading ? 'SALVANDO...' : salvo ? 'TUDO SALVO COM SUCESSO!' : 'SALVAR TODAS AS ALTERAÇÕES'}
                </button>
            </div>
        </div>
    );
};

export default ConfigPanel;