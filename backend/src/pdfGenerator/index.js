import path from 'path';
import fs from 'fs/promises';
import utils from './utils.js';
const { getUploadBase64, getAssetBase64 } = utils;
import { textToHtmlList, formatDate } from '../utils/index.js';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { Buffer } from 'buffer';
import { pathToFileURL, fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stylesPath = path.join(__dirname, 'styles', 'report.css');
const templatePath = path.join(__dirname, 'templates', 'report.html');

/**
 * Formata um código de RTE/Medição (ex: 205A, 20612) inserindo uma barra (ex: 205/A, 206/12).
 */
function formatarCodigoLegenda(legenda) {
    if (!legenda) return '';

    const codigoLimpo = legenda.trim().toUpperCase();

    // Se a legenda começar com "FOTO", não aplica a regra da barra.
    if (codigoLimpo.startsWith('FOTO')) {
        return codigoLimpo; // Retorna "FOTO 1: ..." intacto
    }

    // Regra: Se a string tiver 4 ou mais caracteres (e NÃO for FOTO), insere a barra.
    if (codigoLimpo.length >= 4) {
        return codigoLimpo.slice(0, 3) + '/' + codigoLimpo.slice(3);
    }

    return codigoLimpo; // <--- Ajustado de 'legenda' para 'codigoLimpo'
}

// --- Função Auxiliar: getHeaderHtml (Sem Alterações)
async function getHeaderHtml(logoBase64) {
    return `
        <div style="font-family: Arial, sans-serif; font-size: 9px; width: 100%; border-bottom: 2px solid #00566C; padding: 8px 1cm; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
                ${logoBase64 ? `<img src="${logoBase64}" alt="Logo EDDA" style="height: 45px; margin-right: 10px;">` : ''}
                <div>
                    <p style="font-size: 11px; margin: 0; font-weight: bold; color:#00566C;">RELATÓRIO TÉCNICO</p>
                    <p style="margin: 0; font-size: 9px; color:#666;">EDDA - Produtos e Soluções em GTD</p>
                </div>
            </div>
            <div style="text-align: right; font-size: 8px; color:#555;">
                <p style="margin: 0;">Avenida Doutor Antenor Soares Gandra, 1815 - Jardim Colônia - Jundiaí - SP</p>
                <p style="margin: 0;">CEP 13.218-111 - www.eddaenergia.com - (11) 4533-0044 (11) 4533-0158 </p>
            </div>
        </div>
    `;
}

// --- Função Auxiliar: getFooterHtml (Sem Alterações)
function getFooterHtml(logoBase64) {
    return `
        <div style="font-family: Arial, sans-serif; font-size: 9px; width: 100%; border-top: 2px solid #00566C; padding: 5px 1cm; display:flex; justify-content:space-between; align-items: center; color: #555;">
            <div style="display: flex; align-items: center;">
                ${logoBase64 ? `<img src="${logoBase64}" alt="Logo EDDA" style="height: 20px; margin-right: 15px;">` : '<span>EDDA Energia</span>'}
                <span style="font-weight: bold; color: #00566C;">RELATÓRIO TÉCNICO</span>
            </div>
            <span>Página <span class="pageNumber"></span>/<span class="totalPages"></span></span>
        </div>
    `;
}

// --- Função Principal de Renderização de Fotos: generatePhotoHtml (Sem Alterações)
async function generatePhotoHtml(photos) {
    if (!photos || photos.length === 0) {
        return '<p style="text-align:center; color:#888;">Nenhuma foto nesta seção.</p>';
    }

    const photosHtmlArray = await Promise.all(
        photos.map(async (foto) => {

            const fotoUrl = foto.fullPath;
            const legendaFormatada = formatarCodigoLegenda(foto.legenda);

            if (!fotoUrl) {
                console.warn('[FOTO-PDF] Um objeto de foto foi recebido sem a propriedade "fullPath". Pulando.');
                return '';
            }

            return `
                <div class="photo-item-dynamic" style="display: flex; flex-direction: column; align-items: center; text-align: center; page-break-inside: avoid;">
                    <img src="${fotoUrl}" alt="${legendaFormatada || ''}" style="width: 100%; height: auto; max-width: 100%;">
                    <p class="photo-caption-dynamic" style="margin-top: 8px; font-size: 10px; color: #333;">${legendaFormatada || ''}</p>
                </div>
            `;
        })
    );

    const validPhotos = photosHtmlArray.filter(html => html.length > 0);
    const isSinglePhoto = validPhotos.length === 1;

    if (isSinglePhoto) {
        return `<div class="photo-single-center">${validPhotos.join('')}</div>`;
    } else {
        return `<div class="photo-gallery" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; page-break-inside: avoid;">
            ${validPhotos.join('')}
        </div>`;
    }
}

// --- Função Principal de Renderização: generateReportHtml (Com Correções de Lógica e Base64)
async function generateReportHtml(relatorio) {
    const cssContent = await fs.readFile(stylesPath, 'utf8');
    const templateContent = await fs.readFile(templatePath, 'utf8');

    // --- Logo EDDA ---
    let eddaLogoBase64 = '';
    let eixoIllustrationBase64 = '';
    try {
        [eddaLogoBase64, eixoIllustrationBase64] = await Promise.all([
            getAssetBase64('edda_logo_horizontal.png'),
            getAssetBase64('Imagem_eixo.png')
        ]);
        if (eddaLogoBase64.length > 100) {
            console.log(`[DEBUG] - Logo EDDA Base64 gerada com sucesso. (Tamanho: ${eddaLogoBase64.length})`);
        } else {
            console.error('[ERRO CRÍTICO BASE64] - Logo EDDA Base64 é muito curta/inválida.');
        }
    } catch (e) {
        console.error('[ERRO CRÍTICO PATH] - Falha ao ler ou converter Logo EDDA (Verifique os nomes em assets/).', e);
    }

    // === LOGO DO CLIENTE: CONVERSÃO PARA BASE64 INLINE ===
    let clienteLogoFinalBase64 = '';
    const clienteLogoUrl = relatorio.cliente_logo_path || '';

    if (clienteLogoUrl) {
        try {
            // 1. Extrai o caminho local puro da URL file:///
            let localPath = clienteLogoUrl.replace(/^file:\/\/\//i, '');

            // CORREÇÃO CRÍTICA FINAL:
            // O caminho ainda pode ter barras invertidas. Vamos normalizar para barras (/)
            // e depois usar o path.resolve para convertê-las para o formato nativo (\)
            localPath = localPath.replace(/\\/g, '/'); // Troca barras invertidas por normais
            localPath = path.resolve(localPath);      // Finaliza a resolução para o formato nativo (Windows espera '\')

            // 2. Lê o arquivo e determina o MIME Type
            const data = await fs.readFile(localPath);
            const ext = path.extname(localPath).toLowerCase();
            let mimeType = 'image/jpeg';
            if (ext === '.png') mimeType = 'image/png';
            else if (ext === '.webp') mimeType = 'image/webp';

            // 3. Converte para Data URI (Base64 Inline)
            clienteLogoFinalBase64 = `data:${mimeType};base64,${data.toString('base64')}`;

            console.log('[DEBUG-LOGO-CONVERT] Logo do Cliente convertida para Base64.');
        } catch (e) {
            console.error('[ERRO-LOGO-CONVERSAO] Falha ao converter logo para Base64. (Caminho incorreto ou arquivo não encontrado):', e.message);
            clienteLogoFinalBase64 = '';
        }
    } else {
        console.warn('[DEBUG] Nenhuma logo de cliente fornecida pelo serviço.');
    }

    // Geração de HTML para tabelas e listas
    const pecas_atuais_html = (relatorio.pecas_atuais || []).map(p => `<li>${p.descricao || ''} - Obs: ${p.observacao || ''}</li>`).join('') || '';
    const medicoes_bobina_carcaca_html = (relatorio.medicoes_bobina_carcaca || []).map(m => `<tr><td>${m.descricao || ''}</td><td>${m.valor || ''}</td><td>${m.unidade || ''}</td></tr>`).join('') || '<tr><td colspan="3">Nenhuma medição.</td></tr>';

    const medicoes_isolamento = relatorio.medicoes_isolamento || [];
    let medicoes_isolamento_html = '';

    for (let i = 0; i < medicoes_isolamento.length; i += 2) {
        const m1 = medicoes_isolamento[i];
        const m2 = medicoes_isolamento[i + 1];
        medicoes_isolamento_html += `
            <tr>
                <td>${m1?.descricao || ''}</td>
                <td>${m1?.valor || ''}</td>
                <td>${m1?.unidade || ''}</td>
                <td>${m2?.descricao || ''}</td>
                <td>${m2?.valor || ''}</td>
                <td>${m2?.unidade || ''}</td>
            </tr>
        `;
    }
    if (medicoes_isolamento.length === 0) {
        medicoes_isolamento_html = '<tr><td colspan="6">Nenhuma medição de isolamento.</td></tr>';
    }

    const medicoes_batimento_html = (relatorio.medicoes_batimento || []).map(m => `<tr><td>${m.descricao || ''}</td><td>${m.valor || ''}</td><td>${m.unidade || ''}</td><td>${m.tolerancia || ''}</td></tr>`).join('') || '<tr><td colspan="4">Nenhuma medição.</td></tr>';

    // Template Data
    const templateData = {
        titulo_relatorio: relatorio.titulo_relatorio || '',
        os_numero: relatorio.os_numero || '',
        cliente_nome: relatorio.cliente_nome || '',
        rev: relatorio.rev || '',
        relatorio_numero: relatorio.relatorio_numero || '',
        // MANTÉM OS VALORES FORMATADOS VINDO DO SERVICE
        data_emissao_formatado: relatorio.data_emissao_formatado || '',
        data_inicio_formatado: relatorio.data_inicio_formatado || '',
        data_fim_formatado: relatorio.data_fim_formatado || '',

        numero_rte: formatarCodigoLegenda(relatorio.numero_rte) || '',
        art: relatorio.art || '',
        empresa_cnpj: relatorio.empresa_cnpj || '',
        empresa_crea: relatorio.empresa_crea || '',
        responsavel: relatorio.responsavel || '',
        elaborado_por: relatorio.elaborado_por || '',
        checado_por: relatorio.checado_por || '',
        aprovado_por: relatorio.aprovado_por || '',
        cliente_cnpj: relatorio.cliente_cnpj || '',
        cliente_endereco: relatorio.cliente_endereco || '',
        cliente_cidade: relatorio.cliente_cidade || '',
        cliente_estado: relatorio.cliente_estado || '',
        cliente_cep: relatorio.cliente_cep || '',
        cliente_bairro: relatorio.cliente_bairro || '',
        eixoIllustrationBase64: eixoIllustrationBase64,
        cliente_logo_base64: clienteLogoFinalBase64 || '', // CORREÇÃO: Usa a variável Base64 FINAL
        pecas_atuais_html: pecas_atuais_html,
        medicoes_isolamento_html: medicoes_isolamento_html,
        medicoes_batimento_html: medicoes_batimento_html,
        medicoes_bobina_carcaca_html: medicoes_bobina_carcaca_html,
        fotos_isolamento_html: await generatePhotoHtml(relatorio.fotos_isolamento || []),
        metodologia_html: await generatePhotoHtml(relatorio.fotos_metodologia || []),
        batimento_html: await generatePhotoHtml(relatorio.fotos_batimento || []),
        bobina_carcaca_html: await generatePhotoHtml(relatorio.fotos_bobina_carcaca || []),
        fotos_pecas_atuais_html: await generatePhotoHtml(relatorio.fotos_pecas_atuais || []),
        objetivo_text: relatorio.objetivo_text || '<ul><li>Nenhum objetivo fornecido.</li></ul>',
        causas_danos_list: relatorio.causas_danos_list || '<ul><li>Nenhuma causa listada.</li></ul>',
        conclusao_list: relatorio.conclusao_list || '<ul><li>Nenhuma conclusão listada.</li></ul>',
        descricao: relatorio.descricao || 'Descrição não fornecida.',
        descricao_bobina_carcaca: relatorio.descricao_bobina_carcaca || 'Descrição da seção aqui...',
        conclusao_isolamento: relatorio.conclusao_isolamento || 'Conclusão não fornecida.',
        conclusao_batimento: relatorio.conclusao_batimento || 'Conclusão não fornecida.',
        conclusao_bobina_carcaca: relatorio.conclusao_bobina_carcaca || 'Conclusão não fornecida.',
        sumario_html: relatorio.sumario_html || '',
        indice_fotos_html: relatorio.indice_fotos_html || '',
        // Removidas as reatribuições redundantes e problemáticas de data
    };

    // Substituição no template
    let fullHtml = templateContent;
    for (const [key, value] of Object.entries(templateData)) {
        fullHtml = fullHtml.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
    }

    fullHtml = fullHtml.replace('</head>', `<style>${cssContent}</style></head>`);

    const headerHtml = await getHeaderHtml(eddaLogoBase64);
    const footerHtml = getFooterHtml(eddaLogoBase64);

    return { fullHtml, headerHtml, footerHtml };
} // <--- CHAVE DE FECHAMENTO DA generateReportHtml ESTAVA AQUI NO CÓDIGO ANTERIOR

export default {
    generateReportHtml,
    gerarPdf: async (relatorio) => {
        let browser = null;
        let page = null;
        let tempHtmlPath = null;

        try {
            console.log('[PDF] Iniciando geração do PDF...');

            const { fullHtml: contentHtml, headerHtml: headerTemplate, footerHtml: footerTemplate } =
                await generateReportHtml(relatorio);

            console.log(`[PDF] HTML gerado. Tamanho: ${contentHtml.length} caracteres`);

            // SALVA HTML TEMPORÁRIO
            tempHtmlPath = path.join(__dirname, '..', '..', 'temp_report.html');
            await fs.writeFile(tempHtmlPath, contentHtml, 'utf8');
            console.log('[PDF] HTML salvo em:', tempHtmlPath);

            // ABRE NAVEGADOR
            browser = await chromium.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-gpu',
                    '--single-process',
                    '--disable-dev-shm-usage',
                    '--memory-pressure-off',
                    '--max_old_space_size=4096'
                ],
            });

            const context = await browser.newContext();
            page = await context.newPage();

            // CARREGA VIA file://
            // ... (código anterior) ...

            // CARREGA VIA file://
            console.log('[PDF] Carregando HTML via file://...');
            await page.goto(`file://${tempHtmlPath.replace(/\\/g, '/')}`, {
                waitUntil: 'networkidle', // Playwright usa 'networkidle' (o certo)
                timeout: 300000
            });

            // =============================================================
            // 🛑 CORREÇÕES CRÍTICAS PARA QUEBRA DE PÁGINA EM SERVIDOR 🛑
            // =============================================================

            // 1. FORÇAR MODO DE IMPRESSÃO
            // Garante que o motor de layout use as regras CSS de 'print' (page-break-*)
            console.log('[PDF] Forçando modo de impressão...');
            await page.emulateMedia({ media: 'print' }); // Playwright usa { media: 'print' }

            // 2. PAUSA FORÇADA (O MAIS IMPORTANTE PARA INCONSISTÊNCIA)
            // Dá ao Chromium tempo extra para terminar os cálculos de layout de todas as páginas.
            console.log('[PDF] Aguardando 2 segundos para cálculo de quebra de página...');
            await page.waitForTimeout(2000); // 2000 milissegundos

            // GERA PDF
            console.log('[PDF] Gerando PDF...');
            const pdfBuffer = await page.pdf({
                // ... (o restante da função page.pdf permanece igual)
                format: 'A4',
                printBackground: true,
                displayHeaderFooter: true,
                headerTemplate,
                footerTemplate,
                margin: { top: '2cm', right: '1cm', bottom: '2cm', left: '1cm' },
                preferCSSPageSize: true,
                scale: 1,
                timeout: 300000,
            });

            console.log('[PDF] PDF GERADO COM SUCESSO! Tamanho:', pdfBuffer.length);
            return pdfBuffer;

        } catch (error) {
            console.error("Erro crítico ao gerar PDF:", error.message);
            throw error;
        } finally {
            if (page && !page.isClosed()) await page.close().catch(() => { });
            if (browser) await browser.close().catch(() => { });
            if (tempHtmlPath) {
                setTimeout(() => fs.unlink(tempHtmlPath).catch(() => { }), 5000);
            }
        }
    }
};