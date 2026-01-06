// src/pages/Users/ProfileSettings.jsx

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, Shield } from 'lucide-react';

export default function ProfileSettings() {
  const { user, logout } = useAuth();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0f172a', 
      padding: '60px 20px',
      color: '#e2e8f0'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{
          color: '#e67e22',
          fontSize: '3.5em',
          textAlign: 'center',
          marginBottom: '50px',
          fontWeight: 'bold',
          textShadow: '0 0 20px rgba(230,126,34,0.5)'
        }}>
          Configurações do Perfil
        </h1>

        <div style={{
          background: 'linear-gradient(135deg, #1a2530, #2c3e50)',
          padding: '50px',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          border: '2px solid #34495e'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
            <div>
              <p style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4em', margin: '20px 0' }}>
                <User size={28} color="#e67e22" />
                <strong>Nome:</strong> {user?.nome || 'Não informado'}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4em', margin: '20px 0' }}>
                <Mail size={28} color="#e67e22" />
                <strong>E-mail:</strong> {user?.email || 'Não informado'}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4em', margin: '20px 0' }}>
                <Shield size={28} color="#e67e22" />
                <strong>Função:</strong> {user?.role === 'admin' ? 'Administrador' : 'Técnico'}
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '200px',
                height: '200px',
                background: '#333',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '5em',
                color: '#e67e22'
              }}>
                {user?.nome?.charAt(0).toUpperCase() || 'U'}
              </div>
              <p style={{ fontSize: '1.2em', color: '#94a3b8' }}>
                Foto de perfil em breve...
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <button style={{
              padding: '18px 60px',
              fontSize: '1.6em',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '70px',
              cursor: 'pointer',
              boxShadow: '0 15px 40px rgba(231,76,60,0.6)'
            }} onClick={logout}>
              <Lock style={{ marginRight: '10px' }} size={28} />
              Sair da Conta
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '60px', color: '#64748b', fontSize: '1.2em' }}>
            Funcionalidades em desenvolvimento: alteração de senha, 2FA, tema claro/escuro
          </p>
        </div>
      </div>
    </div>
  );
}