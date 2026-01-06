import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, logger } from '@/config/api';
import { notifySuccess, notifyError } from "@/utils/notifications";
import ReportSearcher from './ReportSearcher'; // Componente de busca

const formatValue = (value) => {
    // Substitui vírgula por ponto e tenta parsear para float
    const cleaned = String(value).replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0.00 : parsed;
}

function BudgetAndInvoiceGenerator() {
    // --- ESTADOS PRINCIPAIS ---
    const [selectedReport, setSelectedReport] = useState(null);
    const [pecasCatalog, setPecasCatalog] = useState([]);
    const [servicosCatalog, setServicosCatalog] = useState([]);
    const [selectedPeca, setSelectedPeca] = useState('');
    const [selectedServico, setSelectedServico] = useState('');
    const [cotadas, setCotadas] = useState([]);
    const [loadingCatalog, setLoadingCatalog] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorCatalog, setErrorCatalog] = useState(null);

    // Carrega o catálogo de Peças e Serviços na montagem
    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const [pecasRes, servicosRes] = await Promise.all([
                    axios.get(API_ENDPOINTS.PECAS),
                    axios.get(API_ENDPOINTS.SERVICOS)
                ]);
                
                // Mapeia e garante que os valores sejam números flutuantes
                setPecasCatalog(pecasRes.data.map(p => ({ 
                    ...p, 
                    valor_venda: formatValue(p.valor_venda) 
                })));
                setServicosCatalog(servicosRes.data.map(s => ({ 
                    ...s, 
                    valor_unitario: formatValue(s.valor_unitario) 
                })));
                setLoadingCatalog(false);
            } catch (error) {
                logger.error("Error loading catalogs:", error);
                setErrorCatalog('Falha ao carregar catálogos de Peças/Serviços. Verifique o backend.');
                setLoadingCatalog(false);
            }
        };
        fetchCatalog();
    }, []);

    // Lógica para adicionar Item (adaptada)
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
    
    // Lógica para remover e atualizar
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

    const totalGeral = cotadas.reduce((sum, item) => sum + (item.quantidade * item.valor_cobrado), 0);

    const handleSubmitInvoice = async () => {
        if (!selectedReport) {
            notifyError('Por favor, selecione um relatório antes de gerar a NF.');
            return;
        }
        if (cotadas.length === 0) {
            notifyError('Adicione ao menos um item (peça ou serviço) ao orçamento.');
            return;
        }

        setIsSubmitting(true);
        
        const pecasFinais = cotadas
            .filter(item => item.tipo === 'peca')
            .map(item => ({ 
                peca_id: item.dbId, 
                quantidade: item.quantidade, 
                valor_cobrado: item.valor_cobrado 
            }));
            
        const servicosFinais = cotadas
            .filter(item => item.tipo === 'servico')
            .map(item => ({ 
                servico_id: item.dbId, 
                quantidade: item.quantidade, 
                valor_cobrado: item.valor_cobrado 
            }));

        try {
            // Novo endpoint para salvar o orçamento final e gerar o documento de NF/Orçamento
            const response = await axios.post(`${API_ENDPOINTS.NF}/gerar`, {
                relatorio_id: selectedReport.id,
                pecas: pecasFinais,
                servicos: servicosFinais,
                valor_total: totalGeral,
            });

            const nfUrl = response.data.nfUrl; // Assumindo que o backend retorna a URL da NF
            
            notifySuccess('Orçamento/NF gerado com sucesso! Abrindo documento...');
            window.open(nfUrl, '_blank');

        } catch (error) {
            logger.error("Erro ao gerar NF:", error);
            notifyError(`Falha ao gerar NF. Erro: ${error.message}. Verifique se o backend tem a rota /api/nf/gerar.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Gerador de Orçamento e Nota Fiscal</h1>
                <p>Crie o orçamento final com base no relatório técnico aprovado.</p>
            </div>

            <ReportSearcher onSelectReport={setSelectedReport} />

            {selectedReport && (
                <div className="section report-summary">
                    <h3>Relatório Selecionado</h3>
                    <p><strong>OS:</strong> {selectedReport.os_numero}</p>
                    <p><strong>Cliente:</strong> {selectedReport.cliente_nome}</p>
                    <p><strong>Título:</strong> {selectedReport.titulo_relatorio}</p>
                    <p className="status-message">Adicione abaixo as peças e serviços a serem faturados.</p>
                </div>
            )}

            {/* SEÇÃO DE ADIÇÃO DE ITENS (Orçamento) */}
            <div className="section" style={{ pointerEvents: selectedReport ? 'auto' : 'none', opacity: selectedReport ? 1 : 0.5 }}>
                <h2>2. Itens para Faturamento</h2>
                <p style={{ color: '#ccc' }}>Adicione peças e serviços do catálogo para gerar o orçamento/NF.</p>

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
            </div>

            {/* TABELA DE ITENS COTADOS */}
            {selectedReport && (
                <div className="section">
                    <h3>Itens Selecionados ({cotadas.length})</h3>
                    
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
                            <tfoot>
                                <tr>
                                    <td colSpan="3" style={{ fontWeight: 'bold', textAlign: 'right', backgroundColor: '#2c2c2c', color: '#fff', borderTop: '2px solid #fff' }}>TOTAL GERAL:</td>
                                    <td colSpan="2" style={{ fontWeight: 'bold', textAlign: 'right', backgroundColor: '#2c2c2c', color: '#fff', borderTop: '2px solid #fff' }}>R$ {totalGeral.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <p style={{ color: '#888' }}>Adicione peças e serviços para o orçamento final.</p>
                    )}

                    <div className="submit-area">
                        <button 
                            onClick={handleSubmitInvoice} 
                            disabled={!selectedReport || cotadas.length === 0 || isSubmitting}
                            className="btn-primary"
                            style={{ backgroundColor: '#28a745' }}
                        >
                            {isSubmitting ? 'Gerando NF...' : 'Gerar NF/Orçamento Final'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BudgetAndInvoiceGenerator;