// src/components/DashboardLayout.jsx
import React, { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from 'react-router-dom';

// Configurações de Relatórios
import CreateReportForm from "@/features/reports/components/CreateReportForm";
import ReportSearch from "@/features/reports/components/ReportSearch";

// Configurações de Usuários e Admin
import ClientCRUD from "@/features/users/ClientCRUD";
import PartsServicesCRUD from "@/features/finance/components/PartsServicesCRUD";
import ProfileSettings from "@/pages/Users/ProfileSettings";

// Configurações de NF e Financeiro
import CreateNF from "@/features/nf/components/CreateNF";
import Financeiro from "@/features/finance/components/Financeiro";
import { useEffect } from 'react';
import {
  FileText, Search, Users, Package, Receipt, DollarSign,
  LogOut, ChevronDown, Shield, Settings
} from 'lucide-react';


const menuItems = [
  { id: 'create', label: 'Criar Relatório', icon: FileText },
  { id: 'search', label: 'Buscar Relatórios / NF', icon: Search },
  { id: 'clients', label: 'Gestão de Clientes', icon: Users },
  { id: 'parts', label: 'Peças e Serviços', icon: Package },
  { id: 'criar-nf', label: 'Criar NF', icon: Receipt },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
];

const extraMenuItems = [
  { id: 'profile-settings', label: 'Configurações de Perfil', icon: Users } // Usando Users ou um novo ícone (Ex: Settings)
];

const componentMap = {
  create: CreateReportForm,
  search: ReportSearch,
  clients: ClientCRUD,
  parts: PartsServicesCRUD,
  'criar-nf': CreateNF,
  financeiro: Financeiro,
  'profile-settings': ProfileSettings,
};

function DashboardLayout() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-orange-600 text-6xl font-bold">
        EDDA
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const displayName = user?.nome
    ? user.nome.trim().split(' ').slice(0, 2).join(' ')
    : 'Usuário';

  const userInitial = user?.nome
    ? user.nome.trim().charAt(0).toUpperCase()
    : 'U';

  if (!currentView) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white">
        <nav style={{
          width: sidebarOpen ? '280px' : '80px',
          backgroundColor: '#1a1a1a',
          transition: 'width 0.4s ease',
          borderRight: '1px solid #333',
          position: 'fixed',
          top: '80px',
          left: 0,
          height: '100vh',
          zIndex: 1000
        }}>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{
              color: '#4a90e2',
              fontSize: '1.1rem',
              fontWeight: '600',
              textAlign: sidebarOpen ? 'center' : 'left',
              margin: '0 0 2rem 0',
              paddingBottom: '1rem',
              borderBottom: '1px solid #333',
              opacity: sidebarOpen ? 1 : 0,
              transition: 'opacity 0.3s'
            }}>
              SISTEMA RELATÓRIOS
            </h3>

            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: isActive ? '#7B2E24' : 'transparent',
                    color: isActive ? '#fff' : '#ccc',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: isActive ? '600' : '500',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                  onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Icon size={22} />
                  {sidebarOpen && <span>{item.label}</span>}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      left: 0, top: 0, bottom: 0,
                      width: '4px',
                      backgroundColor: '#fff',
                      borderRadius: '0 4px 4px 0'
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div style={{ flex: 1, marginLeft: sidebarOpen ? '280px' : '80px', transition: 'margin-left 0.4s ease' }}>
          <header style={{
            height: '80px',
            backgroundColor: '#1a1a1a',
            borderBottom: '3px solid #7B2E24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px', height: '44px',
                background: 'linear-gradient(135deg, #7B2E24, #e67e22)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                color: '#fff'
              }}>E</div>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#7B2E24' }}>EDDA</h1>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#aaa' }}>Produtos e Soluções em GTD</p>
              </div>
            </div>

            {/* DROPDOWN COMPLETO - AGORA COM MINHAS CONFIGURAÇÕES EM TODAS AS TELAS */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #444',
                  borderRadius: '50px',
                  padding: '8px 16px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg, #e67e22, #f39c12)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#fff',
                  fontSize: '1.2rem'
                }}>
                  {userInitial}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{displayName}</div>
                  <div style={{ fontSize: '0.7rem', color: '#aaa' }}>
                    {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </div>
                </div>
                <ChevronDown size={16} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
              </button>

              {/* DROPDOWN - SEMPRE COM MINHAS CONFIGURAÇÕES */}
              {dropdownOpen && (
                <>
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: sidebarOpen ? '280px' : '80px',
                      right: 0,
                      bottom: 0,
                      zIndex: 1199,
                    }}
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: '#1f1f1f',
                    border: '1px solid #444',
                    borderRadius: '12px',
                    minWidth: '280px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
                    zIndex: 1200
                  }}>
                    {/* Painel Administrativo (só admin) */}
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          width: '100%',
                          padding: '18px 24px',
                          background: 'linear-gradient(135deg, #7B2E24, #c4451c)',
                          color: '#ffcc00',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          textDecoration: 'none'
                        }}
                      >
                        <Shield size={22} /> Painel Administrativo
                      </Link>
                    )}

                    {/* MINHAS CONFIGURAÇÕES - SEMPRE VISÍVEL */}
                    <Link
                      to="/profile-settings"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        width: '100%',
                        padding: '18px 24px',
                        background: 'transparent',
                        color: '#e0e0e0',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Settings size={20} /> Configurações
                    </Link>

                    <hr style={{ border: 'none', borderTop: '1px solid #444', margin: '8px 0' }} />

                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                      }}
                      style={{
                        width: '100%',
                        padding: '18px 24px',
                        background: 'transparent',
                        color: '#e74c3c',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#330d0d'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={20} /> Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </header>

          <main style={{
            marginTop: '80px',
            padding: '2rem',
            minHeight: 'calc(100vh - 100px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="text-center">
              <h1 className="text-7xl font-bold text-orange-600 mb-8">EDDA</h1>
              <p className="text-3xl text-gray-300 mb-4">Bem-vindo ao sistema</p>
              <p className="text-xl text-gray-500">Selecione uma opção no menu lateral</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const ActiveComponent = componentMap[currentView];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: currentView ? '#0f0f0f' : '#111111',
      color: '#fff',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* Sidebar e Header */}
      <nav style={{
        width: sidebarOpen ? '280px' : '80px',
        backgroundColor: '#1a1a1a',
        transition: 'width 0.4s ease',
        borderRight: '1px solid #333',
        position: 'fixed',
        top: '80px',
        left: 0,
        height: '100vh',
        zIndex: 1000
      }}>
        <div style={{ padding: '1.5rem' }}>
          <h3 style={{
            color: '#4a90e2',
            fontSize: '1.1rem',
            fontWeight: '600',
            textAlign: sidebarOpen ? 'center' : 'left',
            margin: '0 0 2rem 0',
            paddingBottom: '1rem',
            borderBottom: '1px solid #333',
            opacity: sidebarOpen ? 1 : 0,
            transition: 'opacity 0.3s'
          }}>
            SISTEMA RELATÓRIOS
          </h3>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: isActive ? '#7B2E24' : 'transparent',
                  color: isActive ? '#fff' : '#ccc',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Icon size={22} />
                {sidebarOpen && <span>{item.label}</span>}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: '4px',
                    backgroundColor: '#fff',
                    borderRadius: '0 4px 4px 0'
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div style={{ flex: 1, marginLeft: sidebarOpen ? '280px' : '80px', transition: 'margin-left 0.4s ease' }}>
        {/* HEADER ÚNICO - FUNCIONA EM TODAS AS TELAS (bem-vindo e internas) */}
        <header style={{
          height: '80px',
          backgroundColor: '#1a1a1a',
          borderBottom: '3px solid #7B2E24',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px',
              background: 'linear-gradient(135deg, #7B2E24, #e67e22)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.3rem',
              color: '#fff'
            }}>E</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#7B2E24' }}>EDDA</h1>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#aaa' }}>Produtos e Soluções em GTD</p>
            </div>
          </div>

          {/* DROPDOWN - SEMPRE COM MINHAS CONFIGURAÇÕES */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: '#1f1f1f', border: '1px solid #444',
                borderRadius: '50px', padding: '8px 16px', cursor: 'pointer'
              }}
            >
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #e67e22, #f39c12)',
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', color: '#fff', fontSize: '1.2rem'
              }}>
                {userInitial}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{displayName}</div>
                <div style={{ fontSize: '0.7rem', color: '#aaa' }}>
                  {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </div>
              </div>
              <ChevronDown size={16} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
            </button>

            {dropdownOpen && (
              <>
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: sidebarOpen ? '280px' : '80px',
                    right: 0,
                    bottom: 0,
                    zIndex: 1199,
                  }}
                  onClick={() => setDropdownOpen(false)}
                />
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #444',
                  borderRadius: '12px',
                  minWidth: '280px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.8)',
                  zIndex: 1200
                }}>
                  {/* Painel Administrativo - só admin */}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        width: '100%',
                        padding: '20px 24px',
                        background: 'linear-gradient(135deg, #9a3d2e, #c4451c)',
                        color: '#ffdd00',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        textDecoration: 'none'
                      }}
                    >
                      <Shield size={24} /> Painel Administrativo
                    </Link>
                  )}

                  {/* MINHAS CONFIGURAÇÕES - SEMPRE VISÍVEL */}
                  <Link
                    to="/profile-settings"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: 'transparent',
                      color: '#e0e0e0',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Settings size={22} /> Configurações
                  </Link>

                  <hr style={{ border: 'none', borderTop: '1px solid #555', margin: '10px 0' }} />

                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: 'transparent',
                      color: '#e74c3c',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#440000'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={22} /> Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main style={{
          marginTop: '80px',
          padding: '2rem',
          minHeight: 'calc(100vh - 100px)'
        }}>
          {currentView ? (
            ActiveComponent && <ActiveComponent />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h1 className="text-7xl font-bold text-orange-600 mb-8">EDDA</h1>
                <p className="text-3xl text-gray-300 mb-4">Bem-vindo ao sistema</p>
                <p className="text-xl text-gray-500">Selecione uma opção no menu lateral</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;