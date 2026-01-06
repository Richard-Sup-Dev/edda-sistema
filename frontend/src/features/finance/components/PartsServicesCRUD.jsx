import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from "@/config/api";
import "@/styles/App.css";

const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const initialPecaData = { id: null, nome_peca: '', codigo_fabrica: '', valor_custo: '', valor_venda: '' };
const initialServicoData = { id: null, nome_servico: '', descricao: '', valor_unitario: '' };

const formatValue = (value) => {
    const cleaned = String(value).replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0.00 : parsed;
};

const formatToBRLString = (value) => {

    const numericValue = formatValue(value);
    if (isNaN(numericValue) || numericValue === 0) return '';
    return numericValue.toFixed(2).replace('.', ',');
};

const parseBRL = (value) => {
    if (!value) return 0;
    const cleaned = value.toString().replace(/\./g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
};

// ← SUBSTITUA A FUNÇÃO ANTIGA POR ESTA (é a versão definitiva)
const formatarValorInput = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (!apenasNumeros) return '';

    let numero = apenasNumeros;

    // Garante pelo menos 2 casas decimais
    while (numero.length < 3) {
        numero = '0' + numero;
    }

    const centavos = numero.slice(-2);
    let reais = numero.slice(0, -2);

    // Formata milhares
    reais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Remove zeros à esquerda, mas mantém pelo menos "0"
    reais = reais.replace(/^0+/, '') || '0';

    return `${reais},${centavos}`;
};

const formatBRL = (value) => {
    if (!value || value === 0) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function PartsServicesCRUD() {
    const [pecas, setPecas] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [formDataPeca, setFormDataPeca] = useState(initialPecaData);
    const [formDataServico, setFormDataServico] = useState(initialServicoData);
    const [isPecaFormVisible, setIsPecaFormVisible] = useState(false);
    const [isServicoFormVisible, setIsServicoFormVisible] = useState(false);
    const [isEditingPeca, setIsEditingPeca] = useState(false);
    const [isEditingServico, setIsEditingServico] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [currentTab, setCurrentTab] = useState('pecas');

    const fetchPecas = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS.PECAS);
            setPecas(response.data);
            setMessage({ text: '', type: '' });
        } catch (error) {
            setMessage({ text: 'Falha ao carregar peças.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchServicos = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS.SERVICOS);
            setServicos(response.data);
            setMessage({ text: '', type: '' });
        } catch (error) {
            setMessage({ text: 'Falha ao carregar serviços.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPecas();
        fetchServicos();
    }, [fetchPecas, fetchServicos]);

    const handlePecaChange = (e) => {
        const { id, value } = e.target;
        if (id === 'valor_custo' || id === 'valor_venda') {
            setFormDataPeca(prev => ({ ...prev, [id]: formatarValorInput(value) }));
        } else {
            setFormDataPeca(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleServicoChange = (e) => {
        const { id, value } = e.target;
        if (id === 'valor_unitario') {
            setFormDataServico(prev => ({ ...prev, [id]: formatarValorInput(value) }));
        } else {
            setFormDataServico(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleCancel = (type) => {
        if (type === 'peca') {
            setFormDataPeca(initialPecaData);
            setIsEditingPeca(false);
            setIsPecaFormVisible(false);
        } else {
            setFormDataServico(initialServicoData);
            setIsEditingServico(false);
            setIsServicoFormVisible(false);
        }
        setMessage({ text: '', type: '' });
    };

    const handlePecaSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        const dataToSend = {
            ...formDataPeca,
            valor_custo: parseBRL(formDataPeca.valor_custo),
            valor_venda: parseBRL(formDataPeca.valor_venda)
        };

        const url = isEditingPeca ? `${BASE_API_URL}/pecas/${formDataPeca.id}` : `${BASE_API_URL}/pecas`;
        const method = isEditingPeca ? 'PUT' : 'POST';

        try {
            await axios({ url, method, data: dataToSend });
            setMessage({ text: `Peça ${isEditingPeca ? 'atualizada' : 'cadastrada'} com sucesso!`, type: 'success' });
            fetchPecas();
            handleCancel('peca');
        } catch (error) {
            const msg = error.response?.data?.error || 'Erro ao processar peça.';
            setMessage({ text: msg, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleServicoSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        const dataToSend = {
            ...formDataServico,
            valor_unitario: parseBRL(formDataServico.valor_unitario)
        };

        const url = isEditingServico ? `${BASE_API_URL}/servicos/${formDataServico.id}` : `${BASE_API_URL}/servicos`;
        const method = isEditingServico ? 'PUT' : 'POST';

        try {
            await axios({ url, method, data: dataToSend });
            setMessage({ text: `Serviço ${isEditingServico ? 'atualizado' : 'cadastrado'} com sucesso!`, type: 'success' });
            fetchServicos();
            handleCancel('servico');
        } catch (error) {
            const msg = error.response?.data?.error || 'Erro ao processar serviço.';
            setMessage({ text: msg, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Tem certeza que deseja deletar este ${type === 'peca' ? 'peça' : 'serviço'}?`)) return;
        setIsLoading(true);
        const url = `${BASE_API_URL}/${type}s/${id}`;

        try {
            const response = await axios.delete(url);
            setMessage({ text: response.data.message || `${type} deletado(a).`, type: 'success' });
            if (type === 'peca') fetchPecas(); else fetchServicos();
        } catch (error) {
            const msg = error.response?.data?.error || 'Erro ao deletar.';
            setMessage({ text: msg, type: 'error' });
        } finally {
            setIsLoading(false);
        }
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
                Gestão de Peças e Serviços
            </h1>

            {/* MENSAGEM DE SUCESSO/ERRO */}
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

            {/* ABAS PREMIUM */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '50px' }}>
                {[
                    { key: 'pecas', label: 'PEÇAS', color: '#e67e22' },
                    { key: 'servicos', label: 'SERVIÇOS', color: '#4a90e2' }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setCurrentTab(tab.key)}
                        style={{
                            padding: '20px 80px',
                            fontSize: '1.6em',
                            fontWeight: 'bold',
                            background: currentTab === tab.key ? tab.color : '#2d3748',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            boxShadow: currentTab === tab.key ? `0 15px 40px ${tab.color}60` : 'none',
                            transition: 'all 0.4s'
                        }}
                    >
                        {tab.label} ({currentTab === tab.key ? (tab.key === 'pecas' ? pecas.length : servicos.length) : 0})
                    </button>
                ))}
            </div>

            {/* BOTÃO ADICIONAR NOVO */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <button
                    onClick={() => {
                        if (currentTab === 'pecas') {
                            setIsPecaFormVisible(!isPecaFormVisible);
                            handleCancel('servico');
                        } else {
                            setIsServicoFormVisible(!isServicoFormVisible);
                            handleCancel('peca');
                        }
                    }}
                    style={{
                        padding: '20px 80px',
                        fontSize: '1.8em',
                        fontWeight: 'bold',
                        background: currentTab === 'pecas' ? '#e67e22' : '#4a90e2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '70px',
                        cursor: 'pointer',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                        transition: 'all 0.4s'
                    }}
                >
                    {currentTab === 'pecas' ? '+ NOVA PEÇA' : '+ NOVO SERVIÇO'}
                </button>
            </div>

            {/* FORMULÁRIO PREMIUM */}
            {(isPecaFormVisible && currentTab === 'pecas') || (isServicoFormVisible && currentTab === 'servicos') ? (
                <div style={{
                    background: 'linear-gradient(135deg, #1a2530, #2c3e50)',
                    padding: '40px',
                    borderRadius: '24px',
                    maxWidth: '900px',
                    margin: '0 auto 60px',
                    border: '2px solid #34495e',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.7)'
                }}>
                    <h2 style={{ color: '#e67e22', textAlign: 'center', fontSize: '2em', marginBottom: '30px' }}>
                        {currentTab === 'pecas'
                            ? (isEditingPeca ? 'Editar Peça' : 'Cadastrar Nova Peça')
                            : (isEditingServico ? 'Editar Serviço' : 'Cadastrar Novo Serviço')
                        }
                    </h2>
                    {currentTab === 'pecas' ? (
                        <PecaForm
                            formData={formDataPeca}
                            handleChange={handlePecaChange}
                            handleSubmit={handlePecaSubmit}
                            handleCancel={() => handleCancel('peca')}
                            isEditing={isEditingPeca}
                            isLoading={isLoading}
                        />
                    ) : (
                        <ServicoForm
                            formData={formDataServico}
                            handleChange={handleServicoChange}
                            handleSubmit={handleServicoSubmit}
                            handleCancel={() => handleCancel('servico')}
                            isEditing={isEditingServico}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            ) : null}

            {/* TABELAS PREMIUM */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {currentTab === 'pecas' ? (
                    <PecasTable pecas={pecas} onEdit={(p) => { setFormDataPeca(p); setIsEditingPeca(true); setIsPecaFormVisible(true); }} onDelete={(id) => handleDelete(id, 'peca')} />
                ) : (
                    <ServicosTable servicos={servicos} onEdit={(s) => { setFormDataServico(s); setIsEditingServico(true); setIsServicoFormVisible(true); }} onDelete={(id) => handleDelete(id, 'servico')} />
                )}
            </div>
        </div>
    );
}

// TABELA DE PEÇAS — ALINHADA E LINDA
const PecasTable = ({ pecas, onEdit, onDelete }) => (
    <div style={{ background: '#1e1e1e', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ background: '#2c3e50' }}>
                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'left' }}>Nome da Peça</th>
                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'left' }}>Código</th>
                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'right' }}>Custo</th>
                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'right' }}>Venda</th>
                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'center' }}>Margem</th>
                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'center' }}>Ações</th>
                </tr>
            </thead>
            <tbody>
                {pecas.map(peca => {
                    const custo = parseFloat(peca.valor_custo || 0);
                    const venda = parseFloat(peca.valor_venda || 0);
                    const margem = custo > 0 ? ((venda - custo) / custo * 100).toFixed(1) : 0;

                    return (
                        <tr key={peca.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '18px', color: '#94a3b8', textAlign: 'left' }}>{peca.id}</td>
                            <td style={{ padding: '18px', color: '#e2e8f0', fontWeight: '600', textAlign: 'left' }}>{peca.nome || 'Sem nome'}</td>
                            <td style={{ padding: '18px', color: '#94a3b8', textAlign: 'left' }}>{peca.codigo || '-'}</td>
                            <td style={{ padding: '18px', color: '#e74c3c', textAlign: 'right' }}>R$ {custo.toFixed(2)}</td>
                            <td style={{ padding: '18px', color: '#27ae60', fontWeight: 'bold', textAlign: 'right' }}>R$ {venda.toFixed(2)}</td>
                            <td style={{ padding: '18px', color: margem > 50 ? '#27ae60' : margem > 20 ? '#f39c12' : '#e74c3c', fontWeight: 'bold', textAlign: 'center' }}>
                                {margem}%
                            </td>
                            <td style={{ padding: '18px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => onEdit(peca)}
                                        style={{
                                            background: '#f39c12',
                                            color: 'white',
                                            padding: '10px 24px',
                                            border: 'none',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '1em'
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDelete(peca.id)}
                                        style={{
                                            background: '#e74c3c',
                                            color: 'white',
                                            padding: '10px 24px',
                                            border: 'none',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '1em'
                                        }}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);

// TABELA DE SERVIÇOS — ALINHADA E COM TOOLTIP
const ServicosTable = ({ servicos, onEdit, onDelete }) => (
    <div style={{ background: '#1e1e1e', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ background: '#2c3e50' }}>
                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'left' }}>Nome do Serviço</th>
                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'left' }}>Descrição</th>
                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'right' }}>Valor</th>
                    <th style={{ padding: '20px', color: '#4a90e2', fontSize: '1.2em', textAlign: 'center' }}>Ações</th>
                </tr>
            </thead>
            <tbody>
                {servicos.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #333' }}>
                        <td style={{ padding: '18px', color: '#94a3b8', textAlign: 'left' }}>{s.id}</td>
                        <td style={{ padding: '18px', color: '#e2e8f0', fontWeight: '600', textAlign: 'left' }}>{s.nome || 'Sem nome'}</td>
                        <td style={{ padding: '18px', color: '#94a3b8', textAlign: 'left' }}>
                            <div
                                style={{
                                    maxWidth: '300px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                                title={s.descricao || ''}
                            >
                                {s.descricao || '-'}
                            </div>
                        </td>
                        <td style={{ padding: '18px', color: '#27ae60', fontWeight: 'bold', textAlign: 'right' }}>
                            R$ {parseFloat(s.valor || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '18px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => onEdit(s)}
                                    style={{
                                        background: '#f39c12',
                                        color: 'white',
                                        padding: '10px 24px',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '1em'
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(s.id)}
                                    style={{
                                        background: '#e74c3c',
                                        color: 'white',
                                        padding: '10px 24px',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '1em'
                                    }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const PecaForm = ({ formData, handleChange, handleSubmit, handleCancel, isEditing, isLoading }) => (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '25px' }}>
        <input type="text" id="nome_peca" value={formData.nome_peca} onChange={handleChange} placeholder="Nome da Peça" required style={{ padding: '18px', borderRadius: '16px', border: '2px solid #555', background: '#1e293b', color: '#e2e8f0', fontSize: '1.2em' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
            <input
                type="text"
                id="valor_custo"
                value={formData.valor_custo || ''}
                onChange={handleChange}
                onFocus={(e) => {
                    if (!e.target.value) e.target.placeholder = 'Ex: 1.250,90';
                }}
                onBlur={(e) => {
                    if (!e.target.value) e.target.placeholder = 'Digite o valor de custo';
                }}
                placeholder="Digite o valor de custo"
                required
                style={{
                    padding: '18px',
                    borderRadius: '16px',
                    border: '2px solid #555',
                    background: '#1e293b',
                    color: '#e2e8f0',
                    fontSize: '1.2em'
                }}
            />

            <input
                type="text"
                id="valor_venda"
                value={formData.valor_venda || ''}
                onChange={handleChange}
                onFocus={(e) => { if (!e.target.value) e.target.placeholder = 'Ex: 2.490,00'; }}
                onBlur={(e) => { if (!e.target.value) e.target.placeholder = 'Digite o valor de venda'; }}
                placeholder="Digite o valor de venda"
                required
                style={{
                    padding: '18px',
                    borderRadius: '16px',
                    border: '2px solid #555',
                    background: '#1e293b',
                    color: '#e2e8f0',
                    fontSize: '1.2em'
                }}
            />
        </div>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button type="submit" disabled={isLoading} style={{ padding: '18px 60px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.4em', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 30px rgba(39,174,96,0.6)' }}>
                {isLoading ? 'SALVANDO...' : isEditing ? 'ATUALIZAR' : 'CADASTRAR'}
            </button>
            <button type="button" onClick={handleCancel} style={{ padding: '18px 40px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.2em', cursor: 'pointer' }}>
                CANCELAR
            </button>
        </div>
    </form>
);

const ServicoForm = ({ formData, handleChange, handleSubmit, handleCancel, isEditing, isLoading }) => (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '25px' }}>
        <input type="text" id="nome_servico" value={formData.nome_servico} onChange={handleChange} placeholder="Nome do Serviço" required style={{ padding: '18px', borderRadius: '16px', border: '2px solid #555', background: '#1e293b', color: '#e2e8f0', fontSize: '1.2em' }} />
        <textarea id="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descrição do serviço" rows="3" style={{ padding: '18px', borderRadius: '16px', border: '2px solid #555', background: '#1e293b', color: '#e2e8f0', fontSize: '1.2em', resize: 'vertical' }} />
        <input
            type="text"
            id="valor_unitario"
            value={formData.valor_unitario || ''}
            onChange={handleChange}
            onFocus={(e) => { if (!e.target.value) e.target.placeholder = 'Ex: 380,00'; }}
            onBlur={(e) => { if (!e.target.value) e.target.placeholder = 'Digite o valor do serviço'; }}
            placeholder="Digite o valor do serviço"
            required
            style={{
                padding: '18px',
                borderRadius: '16px',
                border: '2px solid #555',
                background: '#1e293b',
                color: '#e2e8f0',
                fontSize: '1.2em'
            }}
        />
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button type="submit" disabled={isLoading} style={{ padding: '18px 60px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.4em', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 30px rgba(39,174,96,0.6)' }}>
                {isLoading ? 'SALVANDO...' : isEditing ? 'ATUALIZAR' : 'CADASTRAR'}
            </button>
            <button type="button" onClick={handleCancel} style={{ padding: '18px 40px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.2em', cursor: 'pointer' }}>
                CANCELAR
            </button>
        </div>
    </form>
);

export default PartsServicesCRUD;