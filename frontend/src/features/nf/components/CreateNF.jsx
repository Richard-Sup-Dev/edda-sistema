// src/components/CreateNF.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, UPLOAD_BASE_URL, logger } from '@/config/api';
import { notifySuccess, notifyError } from "@/utils/notifications";

function CreateNF() {
  const [cliente, setCliente] = useState(null);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [itens, setItens] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [tipo, setTipo] = useState('peca');
  const [itemId, setItemId] = useState('');
  const [buscaItem, setBuscaItem] = useState('');
  const [loading, setLoading] = useState(false);

  // Carregar peças e serviços
  useEffect(() => {
    const carregarItens = async () => {
      try {
        const [resPecas, resServicos] = await Promise.all([
          axios.get(API_ENDPOINTS.PECAS),
          axios.get(API_ENDPOINTS.SERVICOS)
        ]);
        setPecas(resPecas.data);
        setServicos(resServicos.data);
      } catch (err) {
        logger.error('Error loading items:', err);
      }
    };
    carregarItens();
  }, []);

  // NOVA VERSÃO FINAL DO useEffect (substitua todo o useEffect da busca por este):
  useEffect(() => {
    if (buscaCliente.length < 3) {
      setSugestoes([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.CLIENTES);
        const clientesFiltrados = res.data.filter(cliente =>
          (cliente.nome_fantasia || cliente.nome || '')
            .toLowerCase()
            .includes(buscaCliente.toLowerCase()) ||
          (cliente.cnpj || '').includes(buscaCliente) ||
          (cliente.cpf || '').includes(buscaCliente) ||
          (cliente.os_numero || '').toString().includes(buscaCliente)
        );
        setSugestoes(clientesFiltrados.slice(0, 15)); // mostra só os 15 primeiros
      } catch (err) {
        logger.error('Error searching clients:', err);
        setSugestoes([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [buscaCliente]);

  const selecionarCliente = (c) => {
    setCliente(c);
    // Agora mostra o nome do cliente no campo (fica lindo e profissional)
    setBuscaCliente(`${c.nome_fantasia || c.nome} • ${c.cnpj || c.cpf || 'Sem CPF/CNPJ'}`);
    setSugestoes([]);
  };

  const listaItens = tipo === 'peca' ? pecas : servicos;

  const adicionarItem = () => {
    if (!itemId) return;
    const item = listaItens.find(i => i.id === parseInt(itemId));
    if (!item) return;

    const precoReal = Number(
      tipo === 'peca'
        ? item.valor_venda || item.valor || 0
        : item.valor_unitario || item.valor || 0
    );

    setItens(prev => [...prev, {
      id: Date.now(),
      tipo,
      item_id: item.id,
      descricao: item.descricao || item.nome || item.nome_peca || `Item ${item.id}`,
      quantidade: 1,
      valor_unitario: precoReal,
      valor_total: precoReal
    }]);

    setItemId('');
    setBuscaItem('');
  };

  const atualizarQuantidade = (id, qtd) => {
    setItens(prev => prev.map(i =>
      i.id === id
        ? { ...i, quantidade: qtd || 1, valor_total: (qtd || 1) * i.valor_unitario }
        : i
    ));
  };

  const removerItem = (id) => {
    setItens(prev => prev.filter(i => i.id !== id));
  };

  const total = itens.reduce((s, i) => s + i.valor_total, 0);

  const handleSubmitNF = async () => {
    if (loading || !cliente || itens.length === 0) return;

    setLoading(true);

    const token = localStorage.getItem('token');

    if (!token) {
      notifyError("Sessão expirada ou não autenticada. Faça login novamente.");
      setLoading(false);
      return;
    }

    // DADOS PARA O BACKEND
    const nfData = {
      // *NOTA: Idealmente, o número da NF deve vir do backend (ex: buscando o próximo ID)
      numeroNF: 99999,
      cliente: cliente,
      itens: itens,
      total: total,
      // Dados fiscais mockados
      deducoes: 0,
      baseISS: total,
      valorISS: total * 0.05,
      aliquota: 5,
      informacoesComplementares: `NF gerada para a O.S. ${cliente.os_numero || 'Não informada'}.`,
      osNumero: cliente.os_numero || ''
    };

    try {
      const response = await axios.post(
        `${API_ENDPOINTS.NF}/generate`,
        nfData,
        // ... headers ...
      );

      const { numero, caminho_salvo, url_acesso } = response.data;

      notifySuccess(`SUCESSO! NF Nº ${numero} salva.`);

      // 🚨 AÇÃO CRÍTICA: Abrir a URL do PDF em uma nova aba
      const fullUrl = `${UPLOAD_BASE_URL}${url_acesso}`;
      window.open(fullUrl, '_blank');

      // Limpar formulário
      setCliente(null);
      setBuscaCliente('');
      setItens([]);

    } catch (error) {
      logger.error('Erro ao gerar NF no Backend:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        notifyError("ERRO 401: Sua sessão expirou. Faça login novamente.");
      } else {
        notifyError(`Falha na geração da NF. Detalhes: ${error.response?.data?.error || error.message}`);
      }
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '120px', position: 'relative' }}>
      <h1 style={{
        color: '#7B2E24',
        fontSize: '2.6em',
        margin: '0 0 40px 0',
        textAlign: 'center',
        fontWeight: 'bold',
        textShadow: '0 0 15px rgba(230, 126, 34, 0.4)'
      }}>
        Gerar Nota Fiscal
      </h1>

      <div style={{ marginBottom: '15px' }}>
        <p style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '1.25em', margin: 0 }}>
          1. Digite o cliente (nome, CNPJ ou O.S.)
        </p>
      </div>

      <div style={{ position: 'relative', marginBottom: '25px' }}>
        <input
          type="text"
          value={buscaCliente}
          onChange={(e) => setBuscaCliente(e.target.value)}
          placeholder="Digite nome, O.S. ou CNPJ..."
          style={{
            width: '100%',
            padding: '16px 18px',
            background: '#2d3748',
            color: '#e2e8f0',
            border: '2px solid #4a5568',
            borderRadius: '12px',
            fontSize: '1.1em',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#27ae60'}
          onBlur={(e) => e.target.style.borderColor = '#4a5568'}
        />
        {sugestoes.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#2c2c2c',
            border: '1px solid #444',
            borderTop: 'none',
            maxHeight: '240px',
            overflowY: 'auto',
            zIndex: 1000,
            borderRadius: '0 0 12px 12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            {sugestoes.map(c => (
              <div
                key={c.id}
                onClick={() => selecionarCliente(c)}
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #444',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.target.style.background = '#333'}
                onMouseOut={e => e.target.style.background = '#2c2c2c'}
              >
                <strong style={{ color: '#e2e8f0' }}>{c.nome_fantasia}</strong>
                <span style={{ color: '#94a3b8', marginLeft: '10px' }}>({c.cnpj})</span>
                {c.os_numero && <span style={{ color: '#f39c12', marginLeft: '10px' }}>• O.S.: {c.os_numero}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {cliente && (
        <div style={{
          background: 'linear-gradient(135deg, #2c3e50, #1a2530)',
          padding: '20px',
          borderRadius: '14px',
          marginBottom: '35px',
          border: '2px solid #34495e',
          boxShadow: '0 8px 25px rgba(0,0,0,0.4)'
        }}>
          <p style={{ margin: '8px 0', fontSize: '1.2em', color: '#e2e8f0' }}>
            <strong>Cliente:</strong> {cliente.nome_fantasia}
          </p>
          <p style={{ margin: '8px 0', color: '#94a3b8' }}>
            <strong>CNPJ:</strong> {cliente.cnpj}
          </p>
          {cliente.os_numero && (
            <p style={{ margin: '8px 0', color: '#f39c12', fontWeight: 'bold' }}>
              <strong>O.S.:</strong> {cliente.os_numero}
            </p>
          )}
        </div>
      )}

      <div style={{ margin: '40px 0 15px' }}>
        <p style={{ color: '#e67e22', fontWeight: 'bold', fontSize: '1.25em', margin: 0 }}>
          2. Adicione os itens da NF
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '14px',
        marginBottom: '30px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setItemId('');
            setBuscaItem('');
          }}
          style={{
            padding: '14px 18px',
            background: '#2d3748',
            color: '#e2e8f0',
            border: '2px solid #4a5568',
            borderRadius: '12px',
            fontSize: '1.1em',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%236b7280' viewBox='0 0 20 20'%3e%3cpath d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            backgroundSize: '14px',
            minWidth: '160px'
          }}
        >
          <option value="peca">Peça</option>
          <option value="servico">Serviço</option>
        </select>

        <div style={{ position: 'relative', flex: 1, minWidth: '340px' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'flex-end'
          }}>
            <input
              type="text"
              placeholder="Digite para buscar peça ou serviço..."
              value={buscaItem}
              onChange={(e) => setBuscaItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && buscaItem.trim().length >= 2) {
                  const item = listaItens.find(i =>
                    (
                      i.nome_peca ||
                      i.nome_servico ||
                      i.nome ||
                      i.descricao ||
                      ''
                    ).toLowerCase().includes(buscaItem.toLowerCase())
                  );
                  if (item) {
                    e.preventDefault();
                    const preco = Number(tipo === 'peca' ? item.valor_venda || item.valor || 0 : item.valor_unitario || item.valor || 0);
                    setItens(prev => [...prev, {
                      id: Date.now(),
                      tipo,
                      item_id: item.id,
                      descricao: item.nome || item.nome_servico || item.nome_peca || item.descricao || `Item ${item.id}`,
                      quantidade: 1,
                      valor_unitario: preco,
                      valor_total: preco
                    }]);
                    setBuscaItem('');
                  }
                }
              }}
              style={{
                flex: 1,
                minWidth: '260px',
                padding: '16px 18px',
                background: '#2d3748',
                color: '#e2e8f0',
                border: '2px solid #4a5568',
                borderRadius: '12px',
                fontSize: '1.1em',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#e67e22'}
              onBlur={(e) => e.target.style.borderColor = '#4a5568'}
            />
          </div>

          {buscaItem.length >= 2 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#2d3748',
              border: '2px solid #e67e22',
              borderTop: 'none',
              maxHeight: '340px',
              overflowY: 'auto',
              zIndex: 1000,
              borderRadius: '0 0 12px 12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              marginTop: '8px'
            }}>
              {listaItens
                .filter(item => {
                  const texto = (
                    item.nome_peca ||
                    item.nome_servico ||
                    item.nome ||
                    item.descricao ||
                    ''
                  ).toLowerCase();
                  return texto.includes(buscaItem.toLowerCase());
                })
                .slice(0, 25)
                .map(item => {
                  const precoLista = Number(
                    tipo === 'peca'
                      ? item.valor_venda || item.valor || 0
                      : item.valor_unitario || item.valor || 0
                  );

                  return (
                    <div
                      key={item.id}
                      onMouseDown={(e) => {
                        e.preventDefault(); // evita perder foco
                        const preco = Number(tipo === 'peca' ? item.valor_venda || item.valor || 0 : item.valor_unitario || item.valor || 0);
                        setItens(prev => [...prev, {
                          id: Date.now(),
                          tipo,
                          item_id: item.id,
                          descricao: item.nome || item.nome_servico || item.nome_peca || item.descricao || `Item ${item.id}`,
                          quantidade: 1,
                          valor_unitario: preco,
                          valor_total: preco
                        }]);
                        setBuscaItem(''); // limpa pra digitar o próximo rapidinho
                      }}
                      style={{
                        padding: '14px 18px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #3a4556',
                        background: itemId === item.id.toString() ? '#e67e22' : 'transparent',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={e => e.target.style.background = '#3a4556'}
                      onMouseLeave={e => e.target.style.background = itemId === item.id.toString() ? '#e67e22' : 'transparent'}
                    >
                      <div style={{ fontWeight: '600', color: '#e2e8f0' }}>
                        {(item.nome || item.nome_servico || item.nome_peca || item.descricao || '').trim() || 'Item sem nome (ID: ' + item.id + ')'}
                      </div>
                      <div style={{ fontSize: '0.92em', color: '#94a3b8' }}>
                        R$ {precoLista.toFixed(2)} • Código: {item.id}
                      </div>
                    </div>
                  );
                })}

              {listaItens.filter(item => {
                const texto = (
                  item.nome_peca ||
                  item.nome_servico ||
                  item.nome ||
                  item.descricao ||
                  ''
                ).toLowerCase();
                return texto.includes(buscaItem.toLowerCase());
              }).length === 0 && (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                    Nenhum item encontrado
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1e1e1e', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <thead>
          <tr style={{ background: '#2c3e50' }}>
            <th style={{ padding: '16px', textAlign: 'left', color: '#4a90e2' }}>Tipo</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#4a90e2' }}>Descrição</th>
            <th style={{ padding: '16px', textAlign: 'center', color: '#4a90e2' }}>Qtd</th>
            <th style={{ padding: '16px', textAlign: 'right', color: '#4a90e2' }}>Unitário</th>
            <th style={{ padding: '16px', textAlign: 'right', color: '#4a90e2' }}>Total</th>
            <th style={{ padding: '16px', textAlign: 'center', color: '#4a90e2' }}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {itens.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#888', fontSize: '1.3em', fontStyle: 'italic' }}>
                Nenhum item adicionado ainda
              </td>
            </tr>
          ) : (
            itens.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '14px', color: '#94a3b8' }}>
                  {item.tipo === 'peca' ? 'Peça' : 'Serviço'}
                </td>
                <td style={{ padding: '14px', fontWeight: '600', color: '#e2e8f0' }}>
                  {item.descricao}
                </td>
                <td style={{ padding: '14px', textAlign: 'center' }}>
                  <input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => atualizarQuantidade(item.id, parseInt(e.target.value) || 1)}
                    style={{
                      width: '80px',
                      padding: '10px',
                      textAlign: 'center',
                      background: '#2c3e50',
                      color: '#fff',
                      border: '1px solid #555',
                      borderRadius: '8px',
                      fontSize: '1em'
                    }}
                  />
                </td>
                <td style={{ padding: '14px', textAlign: 'right', color: '#94a3b8' }}>
                  R$ {(item.valor_unitario || 0).toFixed(2)}
                </td>
                <td style={{ padding: '14px', textAlign: 'right', fontWeight: 'bold', color: '#27ae60', fontSize: '1.1em' }}>
                  R$ {(item.valor_total || 0).toFixed(2)}
                </td>
                <td style={{ padding: '14px', textAlign: 'center' }}>
                  <button
                    onClick={() => removerItem(item.id)}
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontSize: '0.9em',
                      cursor: 'pointer',
                      transition: '0.3s'
                    }}
                    onMouseOver={e => e.target.style.background = '#c0392b'}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{
        textAlign: 'right',
        margin: '40px 0',
        fontSize: '2em',
        color: '#27ae60',
        fontWeight: 'bold',
        textShadow: '0 0 20px rgba(39, 174, 96, 0.5)'
      }}>
        Total: R$ {total.toFixed(2)}
      </div>

      {cliente && itens.length > 0 && (
        <div style={{
          margin: '60px auto 40px',
          maxWidth: '1200px',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <button
            onClick={handleSubmitNF} // <--- NOVO: Chama a função que envia para o BACKEND
            disabled={loading}
            style={{
              background: loading ? '#555' : '#27ae60',
              color: 'white',
              padding: '22px 80px',
              fontSize: '1.8em',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '70px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 15px 40px rgba(39,174,96,0.6)',
              transition: 'all 0.4s',
              minWidth: '420px',
              animation: loading ? 'none' : 'pulse 3s infinite'
            }}
            onMouseOver={e => {
              if (!loading) e.target.style.transform = 'translateY(-4px)';
              if (!loading) e.target.style.boxShadow = '0 25px 60px rgba(39,174,96,0.8)';
            }}
            onMouseOut={e => {
              if (!loading) e.target.style.transform = 'translateY(0)';
              if (!loading) e.target.style.boxShadow = '0 15px 40px rgba(39,174,96,0.6)';
            }}
          >
            {loading ? 'GERANDO PDF...' : 'GERAR NOTA FISCAL E SALVAR NO BACKEND'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 20px 60px rgba(39, 174, 96, 0.8); }
          50% { box-shadow: 0 20px 80px rgba(39, 174, 96, 1); }
          100% { box-shadow: 0 20px 60px rgba(39, 174, 96, 0.8); }
        }
      `}</style>
    </div>
  );
}

export default CreateNF;