// src/components/ReportSearch.jsx — VERSÃO PREMIUM EDDA 2025
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, UPLOAD_BASE_URL, logger } from '@/config/api';
import { notifyError } from "@/utils/notifications";
import ReportDetails from './ReportDetails';

function ReportSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const fetchReports = useCallback(async () => {
    if (!searchQuery || searchQuery.length < 3) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_ENDPOINTS.RELATORIOS}/search`, { params: { q: searchQuery } });
      setResults(res.data.relatorios.map(r => ({
        ...r,
        status: r.status || 'concluido'
      })));
    } catch (err) {
      logger.error('Erro ao buscar relatórios:', err);
      notifyError('Erro ao buscar relatórios. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedReportId(null);
    fetchReports();
  };

  // AQUI É O SEGREDO: ReportDetails agora tem fundo escuro e liberdade total
  if (selectedReportId) {
    return (
      <div style={{ 
        background: '#0f172a', 
        minHeight: '100vh', 
        padding: '40px 20px',
        color: '#e2e8f0'
      }}>
        <ReportDetails 
          reportId={selectedReportId} 
          onBack={() => setSelectedReportId(null)} 
        />
      </div>
    );
  }

  return (
    <div className="container">
      {/* TÍTULO ÉPICO */}
      <h1 style={{
        color: '#7B2E24',
        fontSize: '3em',
        textAlign: 'center',
        fontWeight: 'bold',
        textShadow: '0 0 20px rgba(230, 126, 34, 0.5)',
        margin: '0 0 50px 0'
      }}>
        Busca Avançada de Relatórios
      </h1>

      <form onSubmit={handleSearch} style={{ maxWidth: '800px', margin: '0 auto 50px' }}>
        <input
          type="text"
          placeholder="Ex: 12345, Cliente A, 00.000.000/0001-00"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '22px',
            borderRadius: '16px',
            border: '2px solid #555',
            background: '#1e293b',
            color: '#e2e8f0',
            fontSize: '1.4em',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        />
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            type="submit" 
            disabled={isLoading || searchQuery.length < 3}
            style={{
              padding: '20px 100px',
              fontSize: '1.9em',
              fontWeight: 'bold',
              background: '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '70px',
              cursor: 'pointer',
              boxShadow: '0 20px 50px rgba(230,126,34,0.7)'
            }}
          >
            {isLoading ? 'BUSCANDO...' : 'BUSCAR RELATÓRIOS'}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ color: '#e67e22', textAlign: 'center', marginBottom: '30px' }}>
            Resultados Encontrados ({results.length})
          </h2>
          <div style={{ background: '#1e1e1e', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#2c3e50' }}>
                <tr>
                  <th style={{ padding: '20px', color: '#e67e22' }}>O.S.</th>
                  <th style={{ padding: '20px', color: '#e67e22' }}>Cliente</th>
                  <th style={{ padding: '20px', color: '#e67e22' }}>Emissão</th>
                  <th style={{ padding: '20px', color: '#e67e22' }}>Status</th>
                  <th style={{ padding: '20px', color: '#e67e22' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '18px', textAlign: 'center', color: '#e2e8f0', fontWeight: 'bold' }}>
                      {r.os_numero}
                    </td>
                    <td style={{ padding: '18px', color: '#e2e8f0' }}>{r.cliente_nome_final}</td>
                    <td style={{ padding: '18px', color: '#94a3b8' }}>{r.data_emissao}</td>
                    <td style={{ padding: '18px', textAlign: 'center' }}>
                      <span style={{
                        padding: '8px 16px',
                        borderRadius: '30px',
                        fontWeight: 'bold',
                        background: r.status === 'concluido' ? '#27ae60' : r.status === 'pendente' ? '#e67e22' : '#f39c12',
                        color: 'white'
                      }}>
                        {r.status === 'concluido' ? 'CONCLUÍDO' : r.status === 'pendente' ? 'PENDENTE' : 'EM ANÁLISE'}
                      </span>
                    </td>
                    <td style={{ padding: '18px', textAlign: 'center' }}>
                      <button 
                        onClick={() => window.open(`${UPLOAD_BASE_URL}/uploads/relatorios/relatorio-${r.id}.pdf`, '_blank')}
                        style={{ background: '#27ae60', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '12px', marginRight: '10px', fontWeight: 'bold' }}>
                        PDF
                      </button>
                      <button 
                        onClick={() => setSelectedReportId(r.id)}
                        style={{ background: '#f39c12', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
                        DETALHES
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {searchQuery && !isLoading && results.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', fontSize: '1.6em', marginTop: '80px' }}>
          Nenhum relatório encontrado para: <strong>"{searchQuery}"</strong>
        </p>
      )}
    </div>
  );
}

export default ReportSearch;