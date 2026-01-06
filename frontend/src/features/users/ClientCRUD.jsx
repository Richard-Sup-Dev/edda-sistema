// frontend/src/components/ClientCRUD.jsx — VERSÃO PREMIUM EDDA (2025)
import React, { useState, useEffect } from 'react';
import axios from "@/services/axiosConfig";
import { API_ENDPOINTS } from "@/config/api";
import "@/styles/App.css";

const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const initialClientData = {
    cnpj: '',
    nome_fantasia: '',
    razao_social: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    responsavel_contato: ''
};

function ClientCRUD() {
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState(initialClientData);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const loadClients = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage({ text: 'Erro: Faça login novamente.', type: 'error' });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS.CLIENTES, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setClients(response.data);
            setMessage({ text: '', type: '' });
        } catch (error) {
            const status = error.response?.status;
            let msg = 'Erro ao carregar clientes.';
            if (status === 401) msg = 'Sessão expirada. Faça login novamente.';
            if (status === 403) msg = 'Acesso negado.';
            setMessage({ text: msg, type: 'error' });
            setClients([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'cnpj') {
            const apenasNumeros = value.replace(/\D/g, '').slice(0, 14);
            setFormData(prev => ({ ...prev, cnpj: apenasNumeros }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleEdit = (client) => {
        setFormData(client);
        setIsEditing(true);
        setIsFormVisible(true);
        setMessage({ text: '', type: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage({ text: 'Sessão expirada.', type: 'error' });
            setIsLoading(false);
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            if (isEditing) {
                await axios.put(`${BASE_API_URL}/clientes/${formData.id}`, formData, config);
            } else {
                await axios.post(`${BASE_API_URL}/clientes`, formData, config);
            }
            setMessage({ text: 'Cliente salvo com sucesso!', type: 'success' });
            await loadClients();
            setFormData(initialClientData);
            setIsEditing(false);
            setIsFormVisible(false);
        } catch (error) {
            const erro = error.response?.data?.error || 'Erro ao salvar cliente.';
            setMessage({ text: erro, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialClientData);
        setIsEditing(false);
        setIsFormVisible(false);
        setMessage({ text: '', type: '' });
    };

    return (
        <div className="container" style={{ paddingBottom: '160px', position: 'relative' }}>
            {/* TÍTULO ÉPICO */}
            <h1 style={{
                color: '#7B2E24',
                fontSize: '3em',
                margin: '0 0 50px 0',
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: '0 0 20px rgba(230, 126, 34, 0.5)',
                letterSpacing: '1px'
            }}>
                Gestão de Clientes
            </h1>

            {/* MENSAGEM PREMIUM */}
            {message.text && (
                <div style={{
                    padding: '20px',
                    margin: '0 auto 40px',
                    maxWidth: '800px',
                    borderRadius: '16px',
                    fontSize: '1.3em',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    background: message.type === 'success'
                        ? 'linear-gradient(135deg, #27ae60, #2ecc71)'
                        : 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    {message.text}
                </div>
            )}

            {/* BOTÃO NOVO CLIENTE */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    style={{
                        padding: '20px 90px',
                        fontSize: '1.9em',
                        fontWeight: 'bold',
                        background: isFormVisible ? '#e74c3c' : '#e67e22',
                        color: 'white',
                        border: 'none',
                        borderRadius: '70px',
                        cursor: 'pointer',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                        transition: 'all 0.4s'
                    }}
                >
                    {isFormVisible ? 'Fechar Formulário' : '+ NOVO CLIENTE'}
                </button>
            </div>

            {/* FORMULÁRIO PREMIUM */}
            {isFormVisible && (
                <div style={{
                    background: 'linear-gradient(135deg, #1a2530, #2c3e50)',
                    padding: '40px',
                    borderRadius: '24px',
                    maxWidth: '1100px',
                    margin: '0 auto 60px',
                    border: '2px solid #34495e',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.7)'
                }}>
                    <h2 style={{ color: '#e67e22', textAlign: 'center', fontSize: '2.2em', marginBottom: '30px' }}>
                        {isEditing ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '25px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '25px' }}>
                            <input type="text" id="nome_fantasia" value={formData.nome_fantasia} onChange={handleChange} placeholder="Nome Fantasia *" required style={{ padding: '18px', borderRadius: '16px', border: '2px solid #555', background: '#1e293b', color: '#e2e8f0', fontSize: '1.2em' }} />
                            <input type="text" id="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ (apenas números)" maxLength="14" required disabled={isEditing} style={{ padding: '18px', borderRadius: '16px', border: '2px solid #555', background: '#1e293b', color: '#e2e8f0', fontSize: '1.2em' }} />
                            <input type="text" id="razao_social" value={formData.razao_social} onChange={handleChange} placeholder="Razão Social" style={{ padding: '18px', borderRadius: '16px', border: '2px solid #555', background: '#1e293b', color: '#e2e8f0', fontSize: '1.2em' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '25px' }}>
                            <input type="text" id="endereco" value={formData.endereco} onChange={handleChange} placeholder="Endereço completo" style={{ padding: '18px', borderRadius: '16px', border: '2px solid #555', background: '#1e293b', color: '#e2e8f0', fontSize: '1.2em' }} />
                            <input type="text" id="bairro" value={formData.bairro} onChange={handleChange} placeholder="Bairro" style={{ padding: '18px', borderRadius: '16px', border: '2px solid #555', background: '#1e293b', color: '#e2e8f0', fontSize: '1.2em' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.5fr 1fr', gap: '25px' }}>
                            <input type="text" id="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade" style={{ padding: '18px', borderRadius: '16px', border: '2px solid #555', background: '#1e293b', color: '#e2e8f0', fontSize: '1.2em' }} />
                            <input type="text" id="estado" value={formData.estado} onChange={handleChange} placeholder="UF" maxLength="2" style={{ padding: '18px', borderRadius: '16px', border: '2px solid #555', background: '#1e293b', color: '#e2e8f0', fontSize: '1.2em', textTransform: 'uppercase' }} />
                            <input type="text" id="cep" value={formData.cep} onChange={handleChange} placeholder="CEP" maxLength="8" style={{ padding: '18px', borderRadius: '16px', border: '2px solid #555', background: '#1e293b', color: '#e2e8f0', fontSize: '1.2em' }} />
                        </div>

                        <input type="text" id="responsavel_contato" value={formData.responsavel_contato} onChange={handleChange} placeholder="Responsável / Contato" style={{ padding: '18px', borderRadius: '16px', border: '2px solid #555', background: '#1e293b', color: '#e2e8f0', fontSize: '1.2em' }} />

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
                            <button type="submit" disabled={isLoading} style={{ padding: '18px 70px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.4em', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 30px rgba(39,174,96,0.6)' }}>
                                {isLoading ? 'SALVANDO...' : isEditing ? 'ATUALIZAR' : 'CADASTRAR'}
                            </button>
                            <button type="button" onClick={handleCancel} disabled={isLoading} style={{ padding: '18px 50px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.2em', cursor: 'pointer' }}>
                                CANCELAR
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* TABELA PREMIUM */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ color: '#e67e22', textAlign: 'center', marginBottom: '30px', fontSize: '2em' }}>
                    Clientes Cadastrados ({clients.length})
                </h2>

                {isLoading && clients.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.4em' }}>Carregando clientes...</p>
                ) : clients.length > 0 ? (
                    <div style={{ background: '#1e1e1e', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#2c3e50' }}>
                                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em' }}>ID</th>
                                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em' }}>CNPJ</th>
                                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em' }}>Nome Fantasia</th>
                                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em' }}>Cidade/UF</th>
                                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em' }}>Contato</th>
                                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'center' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map(client => (
                                    <tr key={client.id} style={{ borderBottom: '1px solid #333' }}>
                                        <td style={{ padding: '18px', color: '#94a3b8' }}>{client.id}</td>
                                        <td style={{ padding: '18px', color: '#e2e8f0', fontWeight: '600' }}>
                                            {client.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}
                                        </td>
                                        <td style={{ padding: '18px', color: '#e2e8f0', fontWeight: '600' }}>{client.nome_fantasia}</td>
                                        <td style={{ padding: '18px', color: '#94a3b8' }}>{client.cidade || '-'} / {client.estado || '-'}</td>
                                        <td style={{ padding: '18px', color: '#94a3b8' }}>{client.responsavel_contato || '-'}</td>
                                        <td style={{ padding: '18px', textAlign: 'center' }}>
                                            <button onClick={() => handleEdit(client)} style={{ background: '#f39c12', color: 'white', padding: '12px 28px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                EDITAR
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#888', fontSize: '1.5em', marginTop: '50px' }}>
                        Nenhum cliente cadastrado ainda.
                    </p>
                )}
            </div>
        </div>
    );
}

export default ClientCRUD;