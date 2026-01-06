// src/components/NFPreviewHTML.jsx
import logoEdda from '../assets/edda-logo.png';
import React from 'react';

const NFPreviewHTML = ({
  cliente = {},
  itens = [],
  total = 0,
  numeroNF = '000001',
  deducoes = 0,
  baseISS = 0,
  valorISS = 0,
  aliquota = 0,
  informacoesComplementares = '',
  osNumero = '' // Moved osNumero to separate prop if needed
}) => {
  const nomeFantasia = cliente?.nome_fantasia || cliente?.nome || 'CLIENTE NÃO INFORMADO';
  const cnpjCpf = cliente?.cnpj || cliente?.cpf || '';
  const endereco = cliente?.endereco || 'ENDEREÇO NÃO INFORMADO';
  const cidade = cliente?.cidade || '';
  const bairro = cliente?.bairro || '';
  const uf = cliente?.uf || '';
  const cep = cliente?.cep || '';
  const inscricao = cliente?.inscricao_estadual || 'ISENTO';

  const dataEmissao = new Date().toLocaleDateString('pt-BR');

  return (
    <>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #nf-print-area, #nf-print-area * { visibility: visible; }
          #nf-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          @page { size: A4 portrait; margin: 10mm 8mm 12mm 8mm; }
          #nf-print-area { page-break-after: avoid; }
          table { 
            page-break-inside: avoid; 
            page-break-after: auto; 
          }
          .recebimento-table { page-break-before: avoid; }
        }
        #nf-print-area {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10.5px;
          line-height: 1.4;
          color: #000;
          background: white;
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 10mm;
          box-sizing: border-box;
          border: 2px solid #000;
        }
        #nf-print-area table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 6px;
        }
        #nf-print-area td, #nf-print-area th {
          border: 1px solid #666;
          padding: 4px 5px;
          vertical-align: top;
        }
        .header-title {
          background: #d0e6ff;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
          padding: 8px;
          border-bottom: 3px double #000;
        }
        .logo {
          text-align: center;
          vertical-align: middle;
          padding: 10px 0 5px;
        }
        .logo img {
          height: auto;
          width: 95%;
          max-height: 100px;
          object-fit: contain;
          border: none;
        }
        .light-blue { background: #d0e6ff; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .small { font-size: 8.5px; line-height: 1.3; }
        .border-thick { border: 2px solid #000 !important; }
        .no-border { border: none !important; }
        .double-border { border-bottom: 3px double #000; }
      `}</style>

      <div id="nf-print-area">
        {/* Cabeçalho Principal */}
        <table>
          <tbody>
            <tr>
              <td colSpan={6} className="header-title">NOTA FISCAL DE SERVIÇOS</td>
            </tr>
            <tr>
              <td colSpan={2} rowSpan={2} className="logo">
                <img src={logoEdda} alt="Logo EDDA" />
              </td>
              <td colSpan={4} className="light-blue text-center bold">
                NOTA FISCAL DE SERVIÇOS Nº {numeroNF.padStart(6, '0')}
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="light-blue text-center bold">
                DATA DE EMISSÃO: {dataEmissao}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Tomador do Serviço */}
        <table>
          <tbody>
            <tr className="light-blue bold">
              <td colSpan={6}>TOMADOR DO SERVIÇO OU DESTINATÁRIO</td>
            </tr>
            <tr>
              <td colSpan={4}><strong>NOME/RAZÃO SOCIAL:</strong> {nomeFantasia}</td>
              <td colSpan={2}><strong>CNPJ/CPF:</strong> {cnpjCpf}</td>
            </tr>
            <tr>
              <td colSpan={6}><strong>ENDEREÇO:</strong> {endereco}{bairro ? ` - ${bairro}` : ''}</td>
            </tr>
            <tr>
              <td colSpan={3}><strong>CIDADE:</strong> {cidade}</td>
              <td><strong>UF:</strong> {uf}</td>
              <td><strong>CEP:</strong> {cep}</td>
              <td><strong>INSCRIÇÃO ESTADUAL:</strong> {inscricao}</td>
            </tr>
            {osNumero && (
              <tr>
                <td colSpan={6}><strong>O.S.:</strong> <span style={{ color: '#c00' }}>{osNumero}</span></td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Tabela de Itens */}
        <table>
          <thead>
            <tr className="light-blue bold">
              <th width="10%">CÓDIGO</th>
              <th width="8%">QUANT.</th>
              <th width="42%">DESCRIÇÃO</th>
              <th width="10%">ALÍQ.</th>
              <th width="15%">PREÇO UNIT.</th>
              <th width="15%">PREÇO TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item, i) => (
              <tr key={i}>
                <td className="text-center">{item.item_id || item.id || ''}</td>
                <td className="text-center">{item.quantidade || 1}</td>
                <td>{item.descricao || 'Sem descrição'}</td>
                <td className="text-center">—</td>
                <td className="text-right">R$ {Number(item.valor_unitario || 0).toFixed(2)}</td>
                <td className="text-right bold">R$ {Number(item.valor_total || 0).toFixed(2)}</td>
              </tr>
            ))}
            {/* Mais linhas em branco para adicionar peças e serviços */}
            {Array.from({ length: Math.max(0, 15 - itens.length) }, (_, i) => (
              <tr key={`empty-${i}`}>
                <td colSpan={6} style={{ height: '18px' }}>&nbsp;</td>
              </tr>
            ))}
            <tr className="border-thick light-blue bold double-border">
              <td colSpan={5} className="text-right">TOTAL</td>
              <td className="text-right">R$ {Number(total).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Deduções e ISS - Condicional */}
        {(deducoes > 0 || baseISS > 0 || valorISS > 0) && (
          <table>
            <tbody>
              <tr className="light-blue bold"><td colSpan={6}>DEDUÇÕES LEGAIS: R$ {Number(deducoes).toFixed(2)}</td></tr>
              <tr><td colSpan={6} className="bold">BASE DE CÁLCULO DO ISS: R$ {Number(baseISS).toFixed(2)}</td></tr>
              <tr className="light-blue bold"><td colSpan={6}>VALOR DO ISS ({aliquota}%): R$ {Number(valorISS).toFixed(2)}</td></tr>
            </tbody>
          </table>
        )}

        {/* Informações Complementares - Condicional, sem texto fixo */}
        {informacoesComplementares && (
          <table>
            <tbody>
              <tr className="light-blue bold">
                <td width="72%">INFORMAÇÕES COMPLEMENTARES</td>
                <td className="text-center">Nº DE CONTROLE DO FORMULÁRIO {numeroNF.padStart(6, '0')}</td>
              </tr>
              <tr>
                <td colSpan={2} className="small">
                  {informacoesComplementares}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Recebimento - Removidas as caixinhas em branco */}
        <table className="recebimento-table">
          <tbody>
            <tr className="light-blue bold">
              <td colSpan={3} className="text-center">
                RECEBEMOS DE <strong>{nomeFantasia.toUpperCase()}</strong> OS SERVIÇOS CONSTANTES DA NOTA FISCAL INDICADA AO LADO
              </td>
              <td rowSpan={3} className="text-center bold" style={{ borderLeft: '3px double #000' }}>
                NOTA FISCAL<br />
                Nº {numeroNF.padStart(6, '0')}
              </td>
            </tr>
            <tr>
              <td><strong>DATA DO RECEBIMENTO</strong></td>
              <td colSpan={2}><strong>IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR</strong></td>
            </tr>
            <tr>
              <td style={{ height: '70px' }}>___/___/______</td>
              <td colSpan={2} style={{ height: '70px', verticalAlign: 'bottom' }}>
                ____________________________________________________<br />
                Assinatura do Recebedor
              </td>
            </tr>
          </tbody>
        </table>

        {/* Placeholder para QR Code e Código de Verificação - Adicione props reais se integrado */}
        {/* <table>
          <tbody>
            <tr>
              <td colSpan={6} className="text-center">
                <img src="URL_DO_QR_CODE" alt="QR Code NFS-e" style={{ height: '80px' }} />
                <br />
                Código de Verificação: [INSIRA AQUI DO XML]
              </td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </>
  );
};

export default NFPreviewHTML;