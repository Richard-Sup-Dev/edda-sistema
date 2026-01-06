// backend/src/utils/nfGenerator.js
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configurações para usar __dirname em ambiente ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Importante: Defina o caminho para a sua logo. 
// O Puppeteer precisa que o recurso seja acessível (ex: Base64 ou caminho absoluto/URL).
// Vamos usar um caminho absoluto para um arquivo de exemplo dentro da pasta assets:
const LOGO_PATH = path.join(__dirname, '..', 'pdfGenerator', 'assets', 'edda_logo_horizontal.png');

// ----------------------------------------------------
// FUNÇÕES DE UTILIDADE E ESTILO (O mesmo do seu código React, adaptado para string)
// ----------------------------------------------------

const formatNumeroNF = (numeroNF) => String(numeroNF).padStart(6, '0');

const buildNFStyle = () => `
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
`;

/**
 * Converte um arquivo local para Base64 para ser incorporado no HTML.
 * Isso garante que o Puppeteer carregue a imagem sem precisar de servidor estático.
 */
const getBase64Image = (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.warn(`Aviso: Logo não encontrada em ${filePath}.`);
        return 'data:image/svg+xml;base64,...'; // Fallback SVG
    }
    const file = fs.readFileSync(filePath);
    return `data:image/${path.extname(filePath).slice(1)};base64,${file.toString('base64')}`;
};

/**
 * Constrói o HTML do corpo da Nota Fiscal.
 * @param {object} props - Os dados da NF.
 * @returns {string} O HTML completo da NF.
 */
const buildNFHTML = (props = {}) => {
    const {
        cliente = {},
        itens = [],
        total = 0,
        numeroNF = '000001',
        deducoes = 0,
        baseISS = 0,
        valorISS = 0,
        aliquota = 0,
        informacoesComplementares = '',
        osNumero = ''
    } = props;

    const nomeFantasia = cliente?.nome_fantasia || cliente?.nome || 'CLIENTE NÃO INFORMADO';
    const cnpjCpf = cliente?.cnpj || cliente?.cpf || '';
    const endereco = cliente?.endereco || 'ENDEREÇO NÃO INFORMADO';
    const cidade = cliente?.cidade || '';
    const bairro = cliente?.bairro || '';
    const uf = cliente?.uf || '';
    const cep = cliente?.cep || '';
    const inscricao = cliente?.inscricao_estadual || 'ISENTO';

    const dataEmissao = new Date().toLocaleDateString('pt-BR');
    const nfFormatada = formatNumeroNF(numeroNF);
    const logoBase64 = getBase64Image(LOGO_PATH);
    
    // Formato BRL: toFixed(2) e substitui o ponto por vírgula
    const formatBRL = (value) => Number(value || 0).toFixed(2).replace('.', ',');

    const emptyRowsCount = Math.max(0, 15 - itens.length);
    const emptyRows = Array.from({ length: emptyRowsCount }, (_, i) => `
        <tr key="empty-${i}">
            <td colspan="6" style="height: 18px;">&nbsp;</td>
        </tr>
    `).join('');

    const logoTag = `<img src="${logoBase64}" alt="Logo EDDA" />`;

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Nota Fiscal de Serviços</title>
        <style>${buildNFStyle()}</style>
    </head>
    <body>
        <div id="nf-print-area">
            <table>
                <tbody>
                    <tr>
                        <td colspan="6" class="header-title">NOTA FISCAL DE SERVIÇOS</td>
                    </tr>
                    <tr>
                        <td colspan="2" rowspan="2" class="logo">
                            ${logoTag}
                        </td>
                        <td colspan="4" class="light-blue text-center bold">
                            NOTA FISCAL DE SERVIÇOS Nº ${nfFormatada}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" class="light-blue text-center bold">
                            DATA DE EMISSÃO: ${dataEmissao}
                        </td>
                    </tr>
                </tbody>
            </table>

            <table>
                <tbody>
                    <tr class="light-blue bold">
                        <td colspan="6">TOMADOR DO SERVIÇO OU DESTINATÁRIO</td>
                    </tr>
                    <tr>
                        <td colspan="4"><strong>NOME/RAZÃO SOCIAL:</strong> ${nomeFantasia}</td>
                        <td colspan="2"><strong>CNPJ/CPF:</strong> ${cnpjCpf}</td>
                    </tr>
                    <tr>
                        <td colspan="6"><strong>ENDEREÇO:</strong> ${endereco}${bairro ? ` - ${bairro}` : ''}</td>
                    </tr>
                    <tr>
                        <td colspan="3"><strong>CIDADE:</strong> ${cidade}</td>
                        <td><strong>UF:</strong> ${uf}</td>
                        <td><strong>CEP:</strong> ${cep}</td>
                        <td><strong>INSCRIÇÃO ESTADUAL:</strong> ${inscricao}</td>
                    </tr>
                    ${osNumero ? `
                        <tr>
                            <td colspan="6"><strong>O.S.:</strong> <span style="color: #c00;">${osNumero}</span></td>
                        </tr>
                    ` : ''}
                </tbody>
            </table>

            <table>
                <thead>
                    <tr class="light-blue bold">
                        <th width="10%">CÓDIGO</th>
                        <th width="8%">QUANT.</th>
                        <th width="42%">DESCRIÇÃO</th>
                        <th width="10%">ALÍQ.</th>
                        <th width="15%">PREÇO UNIT.</th>
                        <th width="15%">PREÇO TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    ${itens.map((item, i) => `
                        <tr key="${i}">
                            <td class="text-center">${item.item_id || item.id || ''}</td>
                            <td class="text-center">${item.quantidade || 1}</td>
                            <td>${item.descricao || 'Sem descrição'}</td>
                            <td class="text-center">—</td>
                            <td class="text-right">R$ ${formatBRL(item.valor_unitario)}</td>
                            <td class="text-right bold">R$ ${formatBRL(item.valor_total)}</td>
                        </tr>
                    `).join('')}
                    ${emptyRows}
                    <tr class="border-thick light-blue bold double-border">
                        <td colspan="5" class="text-right">TOTAL</td>
                        <td class="text-right">R$ ${formatBRL(total)}</td>
                    </tr>
                </tbody>
            </table>

            ${(deducoes > 0 || baseISS > 0 || valorISS > 0) ? `
                <table>
                    <tbody>
                        <tr class="light-blue bold"><td colspan="6">DEDUÇÕES LEGAIS: R$ ${formatBRL(deducoes)}</td></tr>
                        <tr><td colspan="6" class="bold">BASE DE CÁLCULO DO ISS: R$ ${formatBRL(baseISS)}</td></tr>
                        <tr class="light-blue bold"><td colspan="6">VALOR DO ISS (${aliquota}%): R$ ${formatBRL(valorISS)}</td></tr>
                    </tbody>
                </table>
            ` : ''}

            ${informacoesComplementares ? `
                <table>
                    <tbody>
                        <tr class="light-blue bold">
                            <td width="72%">INFORMAÇÕES COMPLEMENTARES</td>
                            <td class="text-center">Nº DE CONTROLE DO FORMULÁRIO ${nfFormatada}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="small">
                                ${informacoesComplementares}
                            </td>
                        </tr>
                    </tbody>
                </table>
            ` : ''}

            <table class="recebimento-table">
                <tbody>
                    <tr class="light-blue bold">
                        <td colspan="3" class="text-center">
                            RECEBEMOS DE <strong>${nomeFantasia.toUpperCase()}</strong> OS SERVIÇOS CONSTANTES DA NOTA FISCAL INDICADA AO LADO
                        </td>
                        <td rowspan="3" class="text-center bold" style="border-left: 3px double #000;">
                            NOTA FISCAL<br />
                            Nº ${nfFormatada}
                        </td>
                    </tr>
                    <tr>
                        <td><strong>DATA DO RECEBIMENTO</strong></td>
                        <td colspan="2"><strong>IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR</strong></td>
                    </tr>
                    <tr>
                        <td style="height: 70px;">___/___/______</td>
                        <td colspan="2" style="height: 70px; vertical-align: bottom;">
                            ____________________________________________________<br />
                            Assinatura do Recebedor
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
    </html>
    `;
};

/**
 * Gera o PDF da NF a partir do HTML e salva no disco.
 */
const generateAndSaveNF = async (nfData) => {
    // 1. Geração do HTML
    const htmlContent = buildNFHTML(nfData);

    const dataEmissao = new Date();
    const ano = dataEmissao.getFullYear();
    const mes = String(dataEmissao.getMonth() + 1).padStart(2, '0');
    const nfFilename = `nf-${formatNumeroNF(nfData.numeroNF)}.pdf`;
    
    // Caminho para a pasta 'backend/uploads/nfs/Ano/Mes'
    const targetDir = path.join(__dirname, '..', '..', 'uploads', 'nfs', String(ano), mes); 
    const relativePathToSave = path.join('nfs', String(ano), mes, nfFilename);
    const filePath = path.join(targetDir, nfFilename);

    let browser;
    try {
        // 2. Cria a estrutura de pastas se não existir
        fs.mkdirSync(targetDir, { recursive: true });

        // 3. Configura e inicia o Puppeteer
        browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Define o conteúdo HTML
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0' 
        });

        // 4. Gera o PDF e salva
        await page.pdf({
            path: filePath,
            format: 'A4',
            printBackground: true, 
            margin: {
                top: '10mm',
                right: '8mm',
                bottom: '12mm',
                left: '8mm',
            }
        });

        await browser.close();

        return relativePathToSave;

    } catch (error) {
        // Garante que o navegador seja fechado em caso de erro
        if (browser) await browser.close();
        console.error('Erro ao gerar ou salvar o PDF da NF:', error);
        throw new Error('Falha na geração do PDF da Nota Fiscal. Verifique se o Puppeteer foi instalado corretamente.');
    }
};

export {
    generateAndSaveNF,
    formatNumeroNF
};