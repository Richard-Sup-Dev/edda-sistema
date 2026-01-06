// src/components/FinanceCard.jsx
import React from 'react';
import { Clock, CheckCircle, FileText, TrendingUp } from 'lucide-react';

const iconMap = {
  Pendente: Clock,
  Concluído: CheckCircle,
  Faturado: FileText
};

export default function FinanceCard({ title, value, count, color, icon = '', trend = null }) {
  const IconComponent = iconMap[icon] || null;

  return (
    <div
      style={{
        flex: 1,
        minWidth: '280px',
        backgroundColor: '#1a1a1a',
        padding: '1.75rem',
        borderRadius: '18px',
        border: `1px solid ${color}20`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        transform: 'translateY(0) scale(1)'
      }}
      onMouseEnter={(e) => {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-10px) scale(1.03)';
        card.style.boxShadow = `
          0 20px 40px rgba(0,0,0,0.6),
          0 0 30px ${color}40,
          inset 0 0 30px ${color}15
        `;
        card.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        const card = e.currentTarget;
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
        card.style.borderColor = `${color}20`;
      }}
    >
      {/* BARRA SUPERIOR GRADIENTE */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: '5px',
        background: `linear-gradient(90deg, ${color}00, ${color}, ${color}cc, ${color})`,
        borderRadius: '18px 18px 0 0'
      }} />

      {/* ÍCONE + TÍTULO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
        {IconComponent && (
          <div
            style={{
              width: '48px',
              height: '48px',
              background: `${color}15`,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 0 20px ${color}30`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(15deg) scale(1.2)';
              e.currentTarget.style.background = `${color}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(0) scale(1)';
              e.currentTarget.style.background = `${color}15`;
            }}
          >
            <IconComponent size={24} style={{ color, transition: 'all 0.3s ease' }} />
          </div>
        )}
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#fff',
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '0.3px'
          }}>
            {title}
          </h3>
          {trend !== null && (
            <p style={{
              margin: '6px 0 0 0',
              fontSize: '0.8rem',
              color: trend > 0 ? '#34d399' : '#f87171',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <TrendingUp size={14} style={{ transform: trend > 0 ? 'rotate(0)' : 'rotate(180deg)' }} />
              {trend > 0 ? '+' : ''}{Math.abs(trend)}%
            </p>
          )}
        </div>
      </div>

      {/* VALOR */}
      <p style={{
        fontSize: '2.1rem',
        fontWeight: '800',
        margin: '0.5rem 0',
        color: '#fff',
        fontFamily: '"Poppins", sans-serif',
        lineHeight: '1',
        letterSpacing: '-0.5px'
      }}>
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>

      {/* CONTADOR */}
      <p style={{
        margin: 0,
        color: '#bbb',
        fontSize: '0.9rem',
        fontFamily: '"Inter", sans-serif',
        fontWeight: '500'
      }}>
        {count}
      </p>
    </div>
  );
}