import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

const formatValue = (value) => {
    const cleaned = String(value).replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0.00 : parsed;
}

/**
 * Componente interativo para o Chefe de Setor adicionar/editar o orçamento final.
 * Nota: Ele não gerencia o estado global, mas sim o seu estado interno de cotação.
 */
function BudgetSection({ onPecasCotadasChange, onServicosCotadosChange, initialPecas = [], initialServicos = [] }) {
    
    const [pecasCatalog, setPecasCatalog] = useState([]);
    const [servicosCatalog, setServicosCatalog] = useState([]);
    const [selectedPeca, setSelectedPeca] = useState('');
    const [selectedServico, setSelectedServico] = useState('');
    
    // Inicializa as cotadas com os dados existentes do relatório (se houver)
    const initialCotadas = [
        ...initialPecas.map(p => ({
            id: Date.now() + Math.random(), 
            nome: p.nome || p.peca_id, // Usamos o nome salvo, ou fallback
            quantidade: p.quantidade,
            valor_cobrado: formatValue(p.valor_cobrado),
            dbId: p.peca_id, 
            tipo: 'peca'
        })),
        ...initialServicos.map(s => ({
            id: Date.now() + Math.random(), 
            nome: s.nome || s.servico_id, // Usamos o nome salvo, ou fallback
            quantidade: s.quantidade,
            valor_cobrado: formatValue(s.valor_cobrado),
            dbId: s.servico_id, 
            tipo: 'servico'
        }))
    ];

    const [cotadas, setCotadas] = useState(initialCotadas);
    const [loadingCatalog, setLoadingCatalog] = useState(true);
    const [errorCatalog, setErrorCatalog] = useState(null);

    // Carrega o catálogo de Peças e Serviços na montagem
    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const [pecasRes, servicosRes] = await Promise.all([
                    axios.get(API_ENDPOINTS.PECAS),
                    axios.get(API_ENDPOINTS.SERVICOS)
                ]);
                
                setPecasCatalog(pecasRes.data.map(p => ({ ...p, valor_venda: formatValue(p.valor_venda) })));
                setServicosCatalog(servicosRes.data.map(s => ({ ...s, valor_unitario: formatValue(s.valor_unitario) })));
                setLoadingCatalog(false);
            } catch (error) {
                logger.error("Error loading catalogs:", error);
                setErrorCatalog('Falha ao carregar catálogos de Peças/Serviços. Verifique o backend.');
                setLoadingCatalog(false);
            }
        };
        fetchCatalog();
    }, []);

    // 🚨 Sincroniza o estado interno (cotadas) com o componente pai (ReportDetails)
    useEffect(() => {
        const pecas = cotadas
            .filter(item => item.tipo === 'peca')
            .map(item => ({ 
                peca_id: item.dbId, 
                quantidade: item.quantidade, 
                valor_cobrado: item.valor_cobrado,
                nome: item.nome
            }));
            
        const servicos = cotadas
            .filter(item => item.tipo === 'servico')
            .map(item => ({ 
                servico_id: item.dbId, 
                quantidade: item.quantidade, 
                valor_cobrado: item.valor_cobrado,
                nome: item.nome
            }));

        onPecasCotadasChange(pecas);
        onServicosCotadosChange(servicos); 
    }, [cotadas, onPecasCotadasChange, onServicosCotadosChange]);

    const handleAddItem = (type) => {
        let selectedItem;

        if (type === 'peca') {
            if (!selectedPeca) return;
            selectedItem = pecasCatalog.find(p => p.id === parseInt(selectedPeca));
            if (!selectedItem) return;
            
            const newItem = {
                id: Date.now(), 
                nome: selectedItem.nome_peca,
                quantidade: 1,
                valor_cobrado: formatValue(selectedItem.valor_venda),
                dbId: selectedItem.id, 
                tipo: 'peca'
            };
            setCotadas(prev => [...prev, newItem]);
            setSelectedPeca('');

        } else if (type === 'servico') {
            if (!selectedServico) return;
            selectedItem = servicosCatalog.find(s => s.id === parseInt(selectedServico));
            if (!selectedItem) return;

            const newItem = {
                id: Date.now(), 
                nome: selectedItem.nome_servico,
                quantidade: 1,
                valor_cobrado: formatValue(selectedItem.valor_unitario),
                dbId: selectedItem.id, 
                tipo: 'servico'
            };
            setCotadas(prev => [...prev, newItem]);
            setSelectedServico('');
        }
    };
    
    const handleRemoveItem = (id) => {
        setCotadas(cotadas.filter(item => item.id !== id));
    };

    const handleUpdateItem = (id, field, value) => {
        const numericValue = ['quantidade', 'valor_cobrado'].includes(field) ? formatValue(value) : value;
        
        if (['quantidade', 'valor_cobrado'].includes(field) && isNaN(numericValue)) {
            return; 
        }

        setCotadas(cotadas.map(item => 
            item.id === id ? { ...item, [field]: numericValue } : item
        ));
    };

    return (
        <div className="section" style={{ marginTop: '30px' }}>
            <h2 style={{ color: '#f39c12' }}>1. Orçamento Final de Serviços e Peças</h2>
            <p style={{ color: '#ccc' }}>Adicione, remova ou edite os valores para o faturamento final.</p>

            {loadingCatalog ? (
                <p className="loading-message">Carregando catálogo de preços...</p>
            ) : errorCatalog ? (
                <p className="error-message">{errorCatalog}</p>
            ) : (
                <div className="form-row" style={{ marginTop: '20px', gap: '20px' }}>
                    {/* Adicionar Peça */}
                    <div className="form-group" style={{ flex: 1, borderRight: '1px solid #444', paddingRight: '20px' }}>
                        <label htmlFor="peca_select">Adicionar Peça:</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select 
                                id="peca_select" 
                                value={selectedPeca} 
                                onChange={(e) => setSelectedPeca(e.target.value)}
                                style={{ flexGrow: 1 }}
                            >
                                <option value="">-- Selecione uma Peça --</option>
                                {pecasCatalog.map(peca => (
                                    <option key={peca.id} value={peca.id}>
                                        {peca.nome_peca} (R$ {parseFloat(peca.valor_venda).toFixed(2)})
                                    </option>
                                ))}
                            </select>
                            <button type="button" onClick={() => handleAddItem('peca')} disabled={!selectedPeca} className="add-btn" style={{ width: '120px' }}>Adicionar</button>
                        </div>
                    </div>

                    {/* Adicionar Serviço */}
                    <div className="form-group" style={{ flex: 1 }}>
                        <label htmlFor="servico_select">Adicionar Serviço:</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select 
                                id="servico_select" 
                                value={selectedServico} 
                                onChange={(e) => setSelectedServico(e.target.value)}
                                style={{ flexGrow: 1 }}
                            >
                                <option value="">-- Selecione um Serviço --</option>
                                {servicosCatalog.map(servico => (
                                    <option key={servico.id} value={servico.id}>
                                        {servico.nome_servico} (R$ {parseFloat(servico.valor_unitario).toFixed(2)})
                                    </option>
                                ))}
                            </select>
                            <button type="button" onClick={() => handleAddItem('servico')} disabled={!selectedServico} className="add-btn" style={{ width: '120px', backgroundColor: '#3498db' }}>Adicionar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabela de Itens Cotados */}
            <h3 style={{ color: '#ccc', marginTop: '40px' }}>Itens do Orçamento ({cotadas.length})</h3>
            
            {cotadas.length > 0 ? (
                <table className="report-table" style={{ width: '100%', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>Descrição</th>
                            <th style={{ width: '15%', textAlign: 'center' }}>Qtd</th>
                            <th style={{ width: '20%', textAlign: 'right' }}>Valor Unitário</th>
                            <th style={{ width: '15%', textAlign: 'right' }}>Total</th>
                            <th style={{ width: '10%', textAlign: 'center' }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cotadas.map(item => (
                            <tr key={item.id}>
                                <td style={{ color: item.tipo === 'peca' ? '#e74c3c' : '#3498db' }}>
                                    {item.nome} ({item.tipo === 'peca' ? 'Peça' : 'Serviço'})
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <input 
                                        type="number" 
                                        min="0.1"
                                        step="0.1"
                                        value={item.quantidade} 
                                        onChange={(e) => handleUpdateItem(item.id, 'quantidade', e.target.value)}
                                        style={{ width: '60px', padding: '5px', textAlign: 'center', backgroundColor: '#2c2c2c', border: '1px solid #444', color: '#fff' }}
                                    />
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    R$ <input 
                                        type="text" 
                                        value={String(item.valor_cobrado).replace('.', ',')} 
                                        onChange={(e) => handleUpdateItem(item.id, 'valor_cobrado', e.target.value)}
                                        style={{ width: '80px', padding: '5px', textAlign: 'right', backgroundColor: '#2c2c2c', border: '1px solid #444', color: '#fff' }}
                                    />
                                </td>
                                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    R$ {(item.quantidade * item.valor_cobrado).toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button onClick={() => handleRemoveItem(item.id)} className="remove-btn" style={{ width: 'auto', padding: '5px 10px', fontSize: '10px' }}>Remover</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ color: '#888' }}>Nenhum item adicionado ao orçamento.</p>
            )}

        </div>
    );
}

export default BudgetSection;