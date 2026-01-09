// src/components/CreateNF.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';
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
          apiClient.get(API_ENDPOINTS.PECAS),
          apiClient.get(API_ENDPOINTS.SERVICOS)
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
        const res = await apiClient.get(API_ENDPOINTS.CLIENTES);
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
      const response = await apiClient.post(
        `${API_ENDPOINTS.NF}/generate`,
        nfData
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
    <div className="p-8 space-y-8">
      {/* Seção 1: Buscar Cliente */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">1</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Selecione o Cliente</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            value={buscaCliente}
            onChange={(e) => setBuscaCliente(e.target.value)}
            placeholder="Digite nome, CNPJ ou número da O.S..."
            className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder-gray-400"
          />
          
          {sugestoes.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto z-50">
              {sugestoes.map(c => (
                <div
                  key={c.id}
                  onClick={() => selecionarCliente(c)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                >
                  <div className="font-semibold text-gray-900">{c.nome_fantasia}</div>
                  <div className="text-sm text-gray-600">
                    CNPJ: {c.cnpj}
                    {c.os_numero && <span className="ml-3 text-orange-600 font-medium">O.S.: {c.os_numero}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cliente && (
          <div className="bg-linear-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-600 font-semibold mb-1">Cliente Selecionado</p>
                <p className="text-lg font-bold text-gray-900">{cliente.nome_fantasia}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600 font-semibold mb-1">CNPJ</p>
                <p className="text-lg font-bold text-gray-900">{cliente.cnpj}</p>
              </div>
              {cliente.os_numero && (
                <div>
                  <p className="text-sm text-blue-600 font-semibold mb-1">Ordem de Serviço</p>
                  <p className="text-lg font-bold text-orange-600">{cliente.os_numero}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Seção 2: Adicionar Itens */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <span className="text-orange-600 font-bold text-sm">2</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Adicione os Itens</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3">
            <select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value);
                setItemId('');
                setBuscaItem('');
              }}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-gray-900 font-medium"
            >
              <option value="peca">Peça</option>
              <option value="servico">Serviço</option>
            </select>
          </div>

          <div className="lg:col-span-9 relative">
            <input
              type="text"
              placeholder="Digite para buscar peça ou serviço..."
              value={buscaItem}
              onChange={(e) => setBuscaItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && buscaItem.trim().length >= 2) {
                  const item = listaItens.find(i =>
                    (i.nome_peca || i.nome_servico || i.nome || i.descricao || '')
                      .toLowerCase()
                      .includes(buscaItem.toLowerCase())
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
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-gray-900 placeholder-gray-400"
            />

            {buscaItem.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-orange-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
                {listaItens
                  .filter(item => {
                    const texto = (item.nome_peca || item.nome_servico || item.nome || item.descricao || '').toLowerCase();
                    return texto.includes(buscaItem.toLowerCase());
                  })
                  .slice(0, 25)
                  .map(item => {
                    const precoLista = Number(tipo === 'peca' ? item.valor_venda || item.valor || 0 : item.valor_unitario || item.valor || 0);
                    return (
                      <div
                        key={item.id}
                        onMouseDown={(e) => {
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
                        }}
                        className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <div className="font-semibold text-gray-900">
                          {(item.nome || item.nome_servico || item.nome_peca || item.descricao || '').trim() || `Item sem nome (ID: ${item.id})`}
                        </div>
                        <div className="text-sm text-gray-600">
                          R$ {precoLista.toFixed(2)} • Código: {item.id}
                        </div>
                      </div>
                    );
                  })}
                {listaItens.filter(item => {
                  const texto = (item.nome_peca || item.nome_servico || item.nome || item.descricao || '').toLowerCase();
                  return texto.includes(buscaItem.toLowerCase());
                }).length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-500">
                    Nenhum item encontrado
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabela de Itens */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Descrição</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Qtd</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Unitário</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Total</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Ação</th>
              </tr>
            </thead>
            <tbody>
              {itens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-gray-400 italic">
                    Nenhum item adicionado ainda
                  </td>
                </tr>
              ) : (
                itens.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        item.tipo === 'peca' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {item.tipo === 'peca' ? 'Peça' : 'Serviço'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.descricao}</td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => atualizarQuantidade(item.id, parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 text-center bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      />
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      R$ {(item.valor_unitario || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600 text-lg">
                      R$ {(item.valor_total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => removerItem(item.id)}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Total */}
        {itens.length > 0 && (
          <div className="bg-linear-to-br from-green-50 to-green-100 border-t-2 border-green-200 px-6 py-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-700">Valor Total da Nota Fiscal</span>
              <span className="text-3xl font-black text-green-600">
                R$ {total.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Botão Gerar NF */}
      {cliente && itens.length > 0 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmitNF}
            disabled={loading}
            className={`px-12 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/50'
            } text-white`}
          >
            {loading ? 'GERANDO NOTA FISCAL...' : 'GERAR NOTA FISCAL'}
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateNF;