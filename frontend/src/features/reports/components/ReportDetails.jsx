// src/components/ReportDetails.jsx — VERSÃO FINAL PREMIUM EDDA 2025
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from "@/config/api";
import BudgetSection from "@/features/finance/components/BudgetSection";

function ReportDetails({ reportId, onBack }) {
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pecasCotadas, setPecasCotadas] = useState([]);
    const [servicosCotados, setServicosCotados] = useState([]);
    const [isSavingBudget, setIsSavingBudget] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchReportDetails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_ENDPOINTS.RELATORIOS}/${reportId}/full`);
            setReportData(response.data);

            if (response.data.pecasCotadas) setPecasCotadas(response.data.pecasCotadas);
            if (response.data.servicosCotados) setServicosCotados(response.data.servicosCotados);
        } catch (err) {
            const msg = err.response?.data?.error || 'Erro ao carregar relatório.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [reportId]);

    useEffect(() => {
        fetchReportDetails();
    }, [fetchReportDetails]);

    const handleSaveBudget = async () => {
        setIsSavingBudget(true);
        setMessage({ text: '', type: '' });
        try {
            await axios.post(`${API_ENDPOINTS.RELATORIOS}/${reportId}/orcamento`, {
                pecas_cotadas: pecasCotadas,
                servicos_cotados: servicosCotados
            });
            setMessage({ text: 'ORÇAMENTO SALVO COM SUCESSO!', type: 'success' });
            fetchReportDetails();
        } catch (error) {
            const msg = error.response?.data?.error || 'Erro ao salvar orçamento.';
            setMessage({ text: msg, type: 'error' });
        } finally {
            setIsSavingBudget(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', color: '#94a3b8', fontSize: '2em' }}>
                CARREGANDO RELATÓRIO...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', color: '#e74c3c', fontSize: '2em' }}>
                ERRO: {error}
            </div>
        );
    }

    if (!reportData) {
        return <div style={{ textAlign: 'center', color: '#ccc' }}>Relatório não encontrado.</div>;
    }

    const totalPecas = pecasCotadas.reduce((sum, p) => sum + (parseFloat(p.quantidade || 0) * parseFloat(p.valor_cobrado || 0)), 0);
    const totalServicos = servicosCotados.reduce((sum, s) => sum + (parseFloat(s.quantidade || 0) * parseFloat(s.valor_cobrado || 0)), 0);
    const totalGeral = totalPecas + totalServicos;

    return (
        <div style={{ 
            background: '#0f172a', 
            minHeight: '100vh', 
            padding: '40px 20px',
            color: '#e2e8f0'
        }}>
            {/* BOTÃO VOLTAR */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <button onClick={onBack} style={{
                    padding: '18px 70px',
                    fontSize: '1.7em',
                    fontWeight: 'bold',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '70px',
                    cursor: 'pointer',
                    boxShadow: '0 15px 40px rgba(231, 76, 60, 0.6)'
                }}>
                    ← VOLTAR PARA BUSCA
                </button>
            </div>

            {/* TÍTULO ÉPICO */}
            <h1 style={{
                color: '#7B2E24',
                fontSize: '3.8em',
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: '0 0 30px rgba(230, 126, 34, 0.7)',
                margin: '0 0 60px 0',
                letterSpacing: '2px'
            }}>
                RELATÓRIO TÉCNICO #{reportData.os_numero}
            </h1>

            {/* CARD DO CLIENTE */}
            <div style={{
                background: 'linear-gradient(135deg, #1a2530, #2c3e50)',
                padding: '40px',
                borderRadius: '24px',
                maxWidth: '1100px',
                margin: '0 auto 60px',
                border: '2px solid #34495e',
                boxShadow: '0 25px 70px rgba(0,0,0,0.8)',
                textAlign: 'center'
            }}>
                <h2 style={{ color: '#e67e22', fontSize: '2.6em', marginBottom: '20px' }}>
                    {reportData.cliente_nome}
                </h2>
                <p style={{ fontSize: '1.6em', margin: '15px 0' }}>
                    <strong>CNPJ:</strong> {reportData.cliente_cnpj_formatado || reportData.cliente_cnpj}
                </p>
                <p style={{ fontSize: '1.5em', color: '#94a3b8' }}>
                    Emissão: {reportData.data_emissao_formatado}
                </p>
                <button onClick={() => window.open(reportData.pdfUrl, '_blank')} style={{
                    marginTop: '30px',
                    padding: '20px 90px',
                    fontSize: '2em',
                    fontWeight: 'bold',
                    background: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '70px',
                    cursor: 'pointer',
                    boxShadow: '0 20px 50px rgba(39,174,96,0.8)'
                }}>
                    ABRIR PDF TÉCNICO
                </button>
            </div>

            {/* MENSAGEM DE SUCESSO/ERRO */}
            {message.text && (
                <div style={{
                    padding: '25px',
                    margin: '40px auto',
                    maxWidth: '900px',
                    borderRadius: '20px',
                    fontSize: '1.6em',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    background: message.type === 'success' 
                        ? 'linear-gradient(135deg, #27ae60, #2ecc71)' 
                        : 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    color: 'white',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.6)'
                }}>
                    {message.text}
                </div>
            )}

            {/* ORÇAMENTO DO CHEFE */}
            <div style={{
                background: 'linear-gradient(135deg, #1a2530, #2c3e50)',
                padding: '50px',
                borderRadius: '30px',
                maxWidth: '1300px',
                margin: '0 auto 70px',
                border: '3px solid #e67e22',
                boxShadow: '0 30px 80px rgba(230,126,34,0.4)'
            }}>
                <h2 style={{ color: '#e67e22', textAlign: 'center', fontSize: '2.8em', marginBottom: '40px' }}>
                    ORÇAMENTO DO CHEFE
                </h2>

                <BudgetSection 
                    onPecasCotadasChange={setPecasCotadas}
                    onServicosCotadosChange={setServicosCotados}
                />

                <div style={{
                    marginTop: '50px',
                    padding: '30px',
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '30px'
                }}>
                    <button onClick={handleSaveBudget} disabled={isSavingBudget} style={{
                        padding: '22px 80px',
                        fontSize: '2em',
                        fontWeight: 'bold',
                        background: '#f39c12',
                        color: 'white',
                        border: 'none',
                        borderRadius: '70px',
                        cursor: 'pointer',
                        boxShadow: '0 20px 50px rgba(243,156,18,0.7)'
                    }}>
                        {isSavingBudget ? 'SALVANDO...' : 'SALVAR ORÇAMENTO'}
                    </button>

                    <div style={{ textAlign: 'right' }}>
                        <h1 style={{
                            margin: 0,
                            fontSize: '4.8em',
                            fontWeight: 'bold',
                            color: '#2ecc71',
                            textShadow: '0 0 40px rgba(46,204,113,0.8)',
                            letterSpacing: '3px'
                        }}>
                            R$ {totalGeral.toFixed(2).replace('.', ',')}
                        </h1>
                        <p style={{ margin: '10px 0 0', fontSize: '1.6em', color: '#94a3b8' }}>
                            TOTAL DO ORÇAMENTO
                        </p>
                    </div>
                </div>
            </div>

            {/* INFORMAÇÕES TÉCNICAS */}
            <div style={{
                background: 'linear-gradient(135deg, #1a2530, #2c3e50)',
                padding: '40px',
                borderRadius: '24px',
                maxWidth: '1100px',
                margin: '0 auto',
                border: '2px solid #34495e',
                boxShadow: '0 20px 60px rgba(0,0,0,0.7)'
            }}>
                <h2 style={{ color: '#e67e22', fontSize: '2.4em', marginBottom: '30px' }}>
                    Informações Técnicas
                </h2>
                <p style={{ fontSize: '1.4em', lineHeight: '2', margin: '20px 0' }}>
                    <strong>Descrição:</strong> {reportData.descricao || '-'}
                </p>
                <p style={{ fontSize: '1.4em', lineHeight: '2', margin: '20px 0' }}>
                    <strong>Objetivo:</strong> {reportData.objetivo || '-'}
                </p>
                <p style={{ fontSize: '1.4em', lineHeight: '2', margin: '20px 0' }}>
                    <strong>Causas dos Danos:</strong> {reportData.causas_danos || '-'}
                </p>
                <p style={{ fontSize: '1.4em', lineHeight: '2', margin: '20px 0' }}>
                    <strong>Conclusão:</strong> {reportData.conclusao || '-'}
                </p>
            </div>

            {/* RODAPÉ */}
            <div style={{ textAlign: 'center', margin: '100px 0 50px', color: '#64748b', fontSize: '1.3em' }}>
                <p>Sistema EDDA • Relatórios Premium • Orgulho Brasileiro © 2025</p>
            </div>
        </div>
    );
}

export default ReportDetails;