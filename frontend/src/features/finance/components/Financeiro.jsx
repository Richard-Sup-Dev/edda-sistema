// src/components/Financeiro.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { logger } from '@/config/api';
import { API_ENDPOINTS } from '@/config/api';
import FinanceCard from './FinanceCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Financeiro() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2025');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_ENDPOINTS.RELATORIOS}/financeiro/resumo`);
        setData(res.data);
      } catch (err) {
        logger.error('Error loading financial data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);

  if (loading) {
    return (
      <div style={{ fontFamily: '"Inter", sans-serif', padding: '2rem' }}>
        <div style={{ height: '40px', width: '220px', background: '#2a2a2a', borderRadius: '12px', marginBottom: '8px' }} />
        <div style={{ height: '20px', width: '320px', background: '#222', borderRadius: '8px', marginBottom: '2rem' }} />
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: '#1a1a1a',
              padding: '1.75rem',
              borderRadius: '18px',
              borderLeft: '5px solid #444',
              animation: 'pulse 1.5s infinite'
            }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', background: '#2a2a2a', borderRadius: '16px' }} />
                <div style={{ height: '20px', width: '60%', background: '#2a2a2a', borderRadius: '8px' }} />
              </div>
              <div style={{ height: '44px', width: '80%', background: '#333', borderRadius: '10px', marginBottom: '8px' }} />
              <div style={{ height: '18px', width: '50%', background: '#2a2a2a', borderRadius: '6px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Valores com fallback para o formato antigo e novo
  const total_anual = data?.total_anual || data?.totalAcumuladoAno || 0;

  const pendentes = data?.pendentes || { valor: 0, variacao: 0, os_count: 0 };
  const concluidos = data?.concluidos_mes || { valor: 0, variacao: 0, os_count: 0 };
  const faturado = data?.faturado_mes || { valor: 0, variacao: 0, nf_count: 0 };
  const evolucao_mensal = data?.evolucao_mensal || data?.evolucaoMensal || [];

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', padding: '2rem' }}>
      {/* TÍTULO */}
      <h1 style={{
        fontSize: '2.3rem',
        fontWeight: '800',
        color: '#7B2E24',
        marginBottom: '0.5rem',
        fontFamily: '"Poppins", sans-serif',
        letterSpacing: '-0.5px'
      }}>
        Financeiro
      </h1>
      <p style={{ color: '#aaa', marginBottom: '1.5rem', fontSize: '1rem' }}>
        Resumo em tempo real dos serviços e faturamento.
      </p>

      {/* RESUMO + FILTRO */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #7B2E24, #9a3a2e)',
          padding: '1.5rem 2rem',
          borderRadius: '20px',
          boxShadow: '0 12px 32px rgba(123, 46, 36, 0.4)',
          minWidth: '280px',
          color: '#fff',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ margin: 0, fontSize: '1rem', opacity: 0.9, fontWeight: '500' }}>
            Total Acumulado {selectedYear}
          </p>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '2.2rem',
            fontWeight: '800',
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: '-1px'
          }}>
            R$ {Number(total_anual).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{
            padding: '0.9rem 1.5rem',
            borderRadius: '16px',
            border: '2px solid #444',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            fontSize: '1rem',
            fontFamily: '"Inter", sans-serif',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.3s ease',
            minWidth: '140px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#7B2E24';
            e.currentTarget.style.backgroundColor = '#1f1f1f';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#444';
            e.currentTarget.style.backgroundColor = '#1a1a1a';
          }}
        >
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>

      {/* CARDS - COM PORCENTAGENS REAIS */}
      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginBottom: '3rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
      }}>
        <FinanceCard
          title="Pendentes"
          value={pendentes.valor}
          count={`${pendentes.os_count} O.S. em aberto`}
          color="#e67e22"
          icon="Pendente"
          trend={pendentes.variacao}   // PORCENTAGEM REAL
        />
        <FinanceCard
          title="Concluídos (Mês)"
          value={concluidos.valor}
          count={`${concluidos.os_count} finalizadas`}
          color="#27ae60"
          icon="Concluído"
          trend={concluidos.variacao}  // PORCENTAGEM REAL
        />
        <FinanceCard
          title="Faturado (Mês)"
          value={faturado.valor}
          count={`${faturado.nf_count} NFs emitidas`}
          color="#7B2E24"
          icon="Faturado"
          trend={faturado.variacao}    // PORCENTAGEM REAL
        />
      </div>

      {/* GRÁFICO ANIMADO */}
      <h2 style={{
        margin: '0 0 1rem 0',
        fontWeight: '700',
        color: '#fff',
        fontSize: '1.5rem',
        fontFamily: '"Poppins", sans-serif'
      }}>
        Evolução Mensal
      </h2>

      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        marginBottom: '2rem',
        border: '1px solid #333'
      }}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={evolucao_mensal} margin={{ top: 20, right: 40, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="5 5" stroke="#2a2a2a" />
            <XAxis dataKey="mes" stroke="#999" tick={{ fontSize: 13, fontFamily: '"Inter", sans-serif' }} />
            <YAxis stroke="#999" tick={{ fontSize: 12, fontFamily: '"Inter", sans-serif' }} tickFormatter={(v) => `R$${v/1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #7B2E24',
                borderRadius: '16px',
                padding: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                fontFamily: '"Inter", sans-serif'
              }}
              labelStyle={{ color: '#fff', fontWeight: '700' }}
              formatter={(v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            />
            <Line
              type="monotone"
              dataKey="valor"   // CORRIGIDO (era "total")
              stroke="#7B2E24"
              strokeWidth={4}
              dot={{ fill: '#7B2E24', r: 7, stroke: '#fff', strokeWidth: 3 }}
              activeDot={{ r: 9 }}
              animationDuration={1800}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem' }}>
        {evolucao_mensal.length > 0 ? evolucao_mensal.map(m => m.mes.slice(-2)).join(' • ') : 'Jan • Fev • Mar • Abr • Mai • Jun • Jul • Ago • Set • Out • Nov • Dez'}
      </p>
    </div>
  );
}

export default Financeiro;