import relatoriosRepository from '../repositories/relatoriosRepository.js';
import { textToHtmlList, formatDate } from '../utils/index.js';
import pdfGenerator from '../pdfGenerator/index.js';
import path from 'path'; 
import fs from 'fs'; 
import { pathToFileURL, fileURLToPath } from 'url'; 
import { Buffer } from 'buffer'; 
import clientesService from './clientesService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const safeJsonParse = (field) => {
    if (!field) return [];
    try { return JSON.parse(field); } catch (e) { return []; }
};

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
const EDDA_LOGO_PATH = path.join(__dirname, '..', '..', 'assets', 'edda_logo.png');
const EIXO_ILUSTRACAO_PATH = path.join(__dirname, '..', '..', 'assets', 'imagem_eixo.png');

// -------------------------------------------------------------------
// [IMPLEMENTADO] FUNÇÕES DE FORMATAÇÃO CNPJ/CEP
// -------------------------------------------------------------------

/**
 * Remove caracteres não numéricos e aplica o formato CNPJ.
 * Ex: 20256872000122 -> 20.256.872/0001-22
 */
const formatCnpj = (cnpj) => {
    if (!cnpj || typeof cnpj !== 'string') return cnpj;
    const cleaned = cnpj.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (cleaned.length !== 14) return cnpj; // Se não tem 14 dígitos, retorna o original

    return cleaned.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        '$1.$2.$3/$4-$5'
    );
};

/**
 * Remove caracteres não numéricos e aplica o formato CEP.
 * Ex: 07830300 -> 07830-300
 */
const formatCep = (cep) => {
    if (!cep || typeof cep !== 'string') return cep;
    const cleaned = cep.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (cleaned.length !== 8) return cep; // Se não tem 8 dígitos, retorna o original

    return cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};

// -------------------------------------------------------------------
// 1. FUNÇÃO DE ISOLAMENTO (FINAL: Converte M/G/TΩ e usa HTML bold)
// -------------------------------------------------------------------
const conclusaoIsolamentoAutomatica = (medicoes) => {
    if (!medicoes || medicoes.length === 0) {
        return ''; // Retorna vazio se não houver dados
    }

    const VALOR_MINIMO_GOHMS = 1.0;

    const falhaCritica = medicoes.some(medicao => {
        const valorMedido = parseFloat(medicao.valor);
        const unidade = (medicao.unidade || 'GΩ').toUpperCase();

        if (isNaN(valorMedido)) {
            return false;
        }

        let valorEmGigaOhms;

        switch (unidade) {
            case 'MΩ':
                valorEmGigaOhms = valorMedido / 1000.0;
                break;
            case 'TΩ':
                valorEmGigaOhms = valorMedido * 1000.0;
                break;
            case 'GΩ':
            default:
                valorEmGigaOhms = valorMedido;
                break;
        }

        return valorEmGigaOhms < VALOR_MINIMO_GOHMS;
    });

    if (falhaCritica) {
        return `As medições de isolamento, após correção de unidades, indicam que <b>um ou mais pontos estão abaixo do valor normativo de ${VALOR_MINIMO_GOHMS.toLocaleString('pt-BR')} GΩ</b>. O equipamento apresenta risco e está <b>FORA</b> dos padrões normativos.`;
    } else {
        return `Todas as medições de isolamento foram convertidas e estão em conformidade com o valor normativo. O isolamento do equipamento está <b>DENTRO</b> das normas e dos padrões normativos.`;
    }
};

// -------------------------------------------------------------------
// 2. FUNÇÃO DE BATIMENTO RADIAL (FINAL: Usa HTML bold)
// -------------------------------------------------------------------
const conclusaoBatimentoAutomatica = (medicoes) => {
    if (!medicoes || medicoes.length === 0) {
        return '';
    }

    const foraDaNorma = medicoes.some(medicao => {
        const valorEncontrado = parseFloat(medicao.valor_encontrado);
        const tolerancia = parseFloat(medicao.tolerancia);

        return !isNaN(valorEncontrado) && !isNaN(tolerancia) && valorEncontrado > tolerancia;
    });

    if (foraDaNorma) {
        return 'As medições realizadas no batimento radial do eixo indicam que <b>um ou mais valores estão fora das normas de funcionamento (tolerância)</b>. Recomenda-se a substituição e/ou ajuste do componente.';
    } else {
        return 'Todas as medições realizadas no batimento radial do eixo estão <b>dentro das normas de funcionamento e tolerâncias</b> exigidas. O eixo está em condição adequada.';
    }
};

// -------------------------------------------------------------------
// 3. FUNÇÃO AUXILIAR PARA MAPEAR SEÇÃO PARA TÍTULO
// -------------------------------------------------------------------
const mapSectionToTitle = (secao) => {
    switch (secao) {
        case 'isolamento': return '3.1. RESISTÊNCIA DA ISOLAÇÃO';
        case 'bobina_carcaca': return '3.2. MEDIDA ENTRE BOBINA E CARCAÇA';
        case 'batimento': return '3.4. FOTOS MEDIÇÃO DO BATIMENTO RADIAL';
        case 'metodologia': return '4. METODOLOGIA';
        case 'pecas_atuais': return '5. PEÇAS ATUAIS';
        default: return secao;
    }
};

// [relatoriosService.js] - Função gerarPdf - BLOCO CORRIGIDO
async function gerarPdf({ id, caminhoSalvarPdf, caminhoEncontrarFotos }) {


    try {
        console.log(`[GERAR PDF] - Iniciando para o ID: ${id} - ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);

        // [relatoriosService.js]

        // ... (linha 135)
        const relatorio = await relatoriosRepository.executarTransacao(async (client) => {

            // 👇 ADICIONE ESTA LINHA 👇
            // (Obs: Estou assumindo que sua função se chama 'buscarRelatorioPorId'. 
            // Se o nome for outro, apenas ajuste.)
            const relatorioData = await relatoriosRepository.buscarRelatorioPorId(id, client);

            // Agora a verificação funciona
            if (!relatorioData) {

                // 🚨 REMOVA ou comente esta linha, ela causaria um novo erro!
                // console.log(`[DEBUG-DATAS] Início DB: ${relatorioData.data_inicio_servico} | Fim DB: ${relatorioData.data_fim_servico}`);

                console.error(`[ERRO] - Relatório com ID ${id} não encontrado.`);
                return null;
            }

            // O resto do seu código agora funcionará, pois 'relatorioData' existe
            console.log('>>> DIAGNÓSTICO RTE BRUTO DO DB:', relatorioData?.numero_rte);

            const { medicoesIsolamento, medicoesBatimento, pecasAtuais, fotosRelatorio } =
                await relatoriosRepository.buscarDadosRelacionados(relatorioData.id, client);

            // ... (continue o resto da função)

            // 1. Mapeamento de campos críticos (Datas e RTE)
            relatorioData.data_emissao = relatorioData.data_emissao || '';
            relatorioData.data_inicio_servico = relatorioData.data_inicio_servico || '';
            relatorioData.data_fim_servico = relatorioData.data_fim_servico || '';
            relatorioData.numero_rte = relatorioData.numero_rte || '';

            relatorioData.data_emissao_formatado = formatDate(relatorioData.data_emissao);
            relatorioData.data_inicio_formatado = formatDate(relatorioData.data_inicio_servico);
            relatorioData.data_fim_formatado = formatDate(relatorioData.data_fim_servico);

            relatorioData.data_inicio_formatado = relatorioData.data_inicio_formatado;
            relatorioData.data_fim_formatado = relatorioData.data_fim_formatado;

            console.log(`[DEBUG-TemplateKeys] Início formatado: ${relatorioData.data_inicio_formatado} | Fim formatado: ${relatorioData.data_fim_formatado}`);

            // Tratamento de fotos_com_caminho (que é uma string JSON no DB)
            relatorioData.fotos_com_caminho = relatorioData.fotos_com_caminho || '';
            console.log('[DEBUG-DB] Fotos RAW do DB (JSON String):', relatorioData.fotos_com_caminho);
            // ---------------------------------------------------------------------------------

            // Tratamento dos outros campos com a mesma lógica segura
            relatorioData.empresa_cnpj = '20.256.872/0001-22';
            relatorioData.empresa_crea = '1973483';

            // 🌟 CORREÇÃO: MAPEAR TÍTULO, O.S. E CLIENTE PARA A NOVA TABELA
            relatorioData.titulo_relatorio = relatorioData.titulo_relatorio || 'Não informado';// Mapeia o campo do DB para o novo placeholder
            relatorioData.os_numero = relatorioData.os_numero || 'Não preenchido';
            console.log('[DEBUG-SALVAR] Dados para salvar:', relatorioData);
            relatorioData.cliente_nome = relatorioData.cliente_nome || 'Não preenchido';

            // relatorioData.cliente_cnpj = relatorioData.cliente_cnpj || 'Não preenchido'; // LINHA ORIGINAL
            relatorioData.cliente_cnpj = relatorioData.cliente_cnpj
                ? formatCnpj(relatorioData.cliente_cnpj)
                : 'Não preenchido'; // LINHA IMPLEMENTADA COM FORMATAÇÃO

            relatorioData.responsavel = relatorioData.responsavel || 'Não preenchido';
            relatorioData.cliente_endereco = relatorioData.cliente_endereco || 'Não preenchido';
            relatorioData.cliente_bairro = relatorioData.cliente_bairro || 'Não preenchido';
            relatorioData.cliente_cidade = relatorioData.cliente_cidade || 'Não preenchido';
            relatorioData.cliente_estado = relatorioData.cliente_estado || 'Não preenchido';
            // relatorioData.cliente_cep = relatorioData.cliente_cep || 'Não preenchido'; // LINHA ORIGINAL
            relatorioData.cliente_cep = relatorioData.cliente_cep
                ? formatCep(relatorioData.cliente_cep)
                : 'Não preenchido'; // LINHA IMPLEMENTADA COM FORMATAÇÃO

            relatorioData.art = relatorioData.art || 'Não preenchido';
            relatorioData.elaborado_por = relatorioData.elaborado_por || 'Não preenchido';
            relatorioData.checado_por = relatorioData.checado_por || 'Não preenchido';
            relatorioData.aprovado_por = relatorioData.aprovado_por || 'Não preenchido';

            // LIMPEZA DE FALLBACKS E APLICAÇÃO DA LÓGICA DE CONCLUSÃO
            relatorioData.descricao = relatorioData.descricao || '';

            // 🌟 APLICAÇÃO DA LÓGICA DE ISOLAMENTO (que está correta)
            const conclusaoManualIsolamento = relatorioData.conclusao_isolamento || '';
            relatorioData.conclusao_isolamento = conclusaoManualIsolamento.length > 0
                ? conclusaoManualIsolamento
                : conclusaoIsolamentoAutomatica(medicoesIsolamento);

            // Lógica de Conclusão do Batimento Radial (que está correta)
            const conclusaoManualBatimento = relatorioData.conclusao_batimento || '';
            relatorioData.conclusao_batimento = conclusaoManualBatimento.length > 0
                ? conclusaoManualBatimento
                : conclusaoBatimentoAutomatica(medicoesBatimento);

            // 🚨 REMOVENDO FALLBACKS GENÉRICOS (para seção Bobina/Carcaça)
            relatorioData.conclusao_bobina_carcaca = relatorioData.conclusao_bobina_carcaca || '';

            // O PDF Generator espera 'relatorio_numero'
            relatorioData.relatorio_numero = relatorioData.os_numero || `FRTE-${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
            relatorioData.rev = relatorioData.rev || '0';
            relatorioData.medicoes_isolamento = medicoesIsolamento || [];
            relatorioData.medicoes_batimento = medicoesBatimento || [];
            relatorioData.pecas_atuais = pecasAtuais || [];

            // 🌟 CORREÇÃO LISTAGEM (Splits the string by new lines)
            relatorioData.objetivo_text = relatorioData.objetivo || 'Nenhum objetivo fornecido.'; // Campo de texto simples (para o HTML)

            const causasDanosArray = relatorioData.causas_danos ? relatorioData.causas_danos.split('\n').filter(line => line.trim().length > 0) : [];
            const conclusaoArray = relatorioData.conclusao ? relatorioData.conclusao.split('\n').filter(line => line.trim().length > 0) : [];
            const objetivoArray = relatorioData.objetivo
                ? relatorioData.objetivo.split('\n').filter(line => line.trim())
                : [];
            relatorioData.objetivo_list = textToHtmlList(objetivoArray);

            relatorioData.causas_danos_list = textToHtmlList(causasDanosArray);
            relatorioData.conclusao_list = textToHtmlList(conclusaoArray);


            // ... (restante do código de mapeamento de logos e fotos) ...

            // --- CORREÇÃO (pathToFileURL) PARA LOGO ---
            // [relatoriosService.js - Corrigindo a construção do caminho]

            // [relatoriosService.js]

            // ... (código anterior) ...

            // --- CORREÇÃO (pathToFileURL) PARA LOGO ---
            relatorioData.cliente_logo_path = relatorioData.cliente_logo_path || relatorioData.cliente_logo || '';

            // 🚨 CORREÇÃO DE LÓGICA 🚨
            // O ano/mês deve vir da data do relatório, não da data atual.
            // Use a data_emissao (ou outra data do relatório) para encontrar a pasta correta.
            const dataParaCaminho = new Date(relatorioData.data_emissao || relatorioData.data_inicio_servico || Date.now());
            const ano = String(dataParaCaminho.getFullYear());
            const mes = String(dataParaCaminho.getMonth() + 1).padStart(2, '0');
            // 🚨 FIM DA CORREÇÃO DE LÓGICA 🚨

            // Agora esta linha usará o 'ano' e 'mes' corretos do relatório
            relatorioData.cliente_logo_path = relatorioData.cliente_logo_path
                ? path.join(UPLOADS_DIR, ano, mes, String(relatorioData.id), 'fotos', relatorioData.cliente_logo_path)
                : ''; // Se não houver logo, o caminho é vazio

            // CONVERTE o caminho do disco em uma URL 'file:///'
            if (relatorioData.cliente_logo_path) {
                relatorioData.cliente_logo_path = pathToFileURL(relatorioData.cliente_logo_path).href;
            }
            // --- FIM DA CORREÇÃO ---

            console.log('>>> VALOR FINAL DA LOGO ANTES DO PDF:', relatorioData.cliente_logo_path);


            // ====================================================================
            // CRÍTICO: LÓGICA DE PRIORIDADE PARA AS FOTOS DO MOBILE
            // ====================================================================
            let fotosParaMapear = fotosRelatorio || [];

            // Se o Controller salvou a lista de fotos no campo fotos_com_caminho (string JSON)
            if (relatorioData.fotos_com_caminho) {
                const fotosDoController = safeJsonParse(relatorioData.fotos_com_caminho);

                if (fotosDoController.length > 0) {
                    console.log('[FOTOS-PDF] Usando array de fotos salvo pelo Controller (Mobile).');

                    // Mapeia o resultado do JSON (que tem 'fileName') para o formato esperado ('caminho_foto')
                    fotosParaMapear = fotosDoController.map(f => ({
                        caminho_foto: f.fileName,
                        legenda: f.legenda,
                        secao: f.secao,
                        // Adicione outros campos se o seu Repository precisar
                    }));
                }
            }

            // Mapear fotos (Usaremos fotosParaMapear, que agora contém as fotos do Mobile)
            // [relatoriosService.js] - (Perto da linha 400)

            // Mapear fotos (Usaremos fotosParaMapear, que agora contém as fotos do Mobile)
            const fotosDoDb = fotosParaMapear;

            // --- 🚀 LÓGICA DE CAMINHO DAS FOTOS (ATUALIZADA) ---
            // --- 🚀 LÓGICA DE CAMINHO DAS FOTOS (ATUALIZADA) ---

            let photoCounter = 0; // 👈 PASSO 1: Adicione este contador

            const mapPhotos = (f) => {
                // Usa 'caminhoEncontrarFotos' (a variável desestruturada no início)
                const osPath = path.join(caminhoEncontrarFotos, f.caminho_foto);

                const fotoId = `foto-ref-${photoCounter}`; // 👈 PASSO 1: Crie o ID
                photoCounter++; // 👈 PASSO 1: Incremente o ID

                return {
                    ...f,
                    fileName: f.caminho_foto,
                    // Converte o caminho do disco em uma URL 'file:///' que o Playwright entende
                    fullPath: pathToFileURL(osPath).href,
                    refId: fotoId // 👈 PASSO 1: Anexe o ID ao objeto
                };
            };
            // --- FIM DA CORREÇÃO ---

            // Mapeamento final para as seções (agora inclui o refId)
            relatorioData.fotos_isolamento = fotosDoDb.filter(f => f.secao === 'isolamento').map(mapPhotos);
            relatorioData.fotos_isolamento = fotosDoDb.filter(f => f.secao === 'isolamento').map(mapPhotos);
            relatorioData.fotos_pecas_atuais = fotosDoDb.filter(f => f.secao === 'pecas_atuais').map(mapPhotos);
            relatorioData.fotos_metodologia = fotosDoDb.filter(f => f.secao === 'metodologia').map(mapPhotos);
            relatorioData.fotos_batimento = fotosDoDb.filter(f => f.secao === 'batimento').map(mapPhotos);
            relatorioData.fotos_bobina_carcaca = fotosDoDb.filter(f => f.secao === 'bobina_carcaca').map(mapPhotos);
            // ====================================================================


            // ====================================================================
            // [CORREÇÃO APLICADA] GERAÇÃO DE SUMÁRIO E ÍNDICE DE FOTOS HTML
            // ====================================================================

            // [relatoriosService.js]

            // ====================================================================
            // [CORREÇÃO APLICADA] GERAÇÃO DE SUMÁRIO E ÍNDICE DE FOTOS HTML
            // ====================================================================

            // --- 1. SUMÁRIO (ÍNDICE PRINCIPAL) ---
            // (Esta parte estava correta e permanece igual)
            const sumarioItems = [
                { title: '1. OBJETIVO', page: 3 },
                { title: '2. REFERÊNCIA NORMATIVA', page: 3 },
                { title: '3. DESCRIÇÃO', page: 3 },
                { title: '3.1. RESISTÊNCIA DA ISOLAÇÃO', page: 3 },
                { title: '3.2. MEDIDA ENTRE BOBINA E CARCAÇA', page: 4 },
                { title: '3.3. MEDIÇÃO DO BATIMENTO RADIAL', page: 5 },
                { title: '3.4. FOTOS MEDIÇÃO DO BATIMENTO RADIAL', page: 6 },
                { title: '4. METODOLOGIA', page: 9 },
                { title: '5. PEÇAS ATUAIS', page: 10 },
                { title: '6. CAUSAS DOS DANOS', page: 12 },
                { title: '7. CONCLUSÃO', page: 12 },
            ];

            const sumarioLiTags = sumarioItems.map(item => `
            <li class="summary-item">
                <span>${item.title}</span>
                <span class="summary-page-number">${item.page}</span>
            </li>
        `);

            relatorioData.sumario_html = textToHtmlList(sumarioLiTags);


            // --- 2. ÍNDICE DE FOTOS ---
            // (Esta é a parte que vamos corrigir)

            // Combina todas as fotos para o índice (você já tinha feito isso)
            const allPhotos = [
                ...relatorioData.fotos_isolamento,
                ...relatorioData.fotos_bobina_carcaca,
                ...relatorioData.fotos_batimento,
                ...relatorioData.fotos_metodologia,
                ...relatorioData.fotos_pecas_atuais
            ];

            // 🚨 NOVA LÓGICA: Itera sobre CADA foto, não sobre as seções
            const photoIndexLiTags = allPhotos.map((foto, index) => {

                // Usamos a legenda da foto. Se não houver, usamos a descrição ou um fallback.
                const fotoTitulo = foto.legenda || foto.descricao || `Foto ${index + 1}`;

                // ⚠️ NOTA SOBRE A PÁGINA:
                // O número da página é dinâmico, ele depende de onde o PDF renderiza a foto.
                // Deixar em branco ('') é o correto para que o CSS do seu template (Playwright) 
                // possa preencher isso dinamicamente, se ele estiver configurado para isso.
                let pageNumber = '';

                return `
                <li class="photo-index-item">
                    <span>${fotoTitulo}</span>
                    <span class="summary-page-number">${pageNumber}</span>
                </li>
            `;
            });

            // CORREÇÃO: Usando textToHtmlList para encapsular com <ul>...</ul>
            relatorioData.indice_fotos_html = textToHtmlList(photoIndexLiTags);

            // ====================================================================

            console.log('[DEBUG] - Dados prontos para pdfGenerator.');

            return relatorioData;
        });

        if (!relatorio) { return null; }

        // O pdfGenerator agora usará a lógica de .length > 0 para exibir os valores!
        const pdfBuffer = await pdfGenerator.gerarPdf(relatorio); // <-- Variável é 'pdfBuffer'


        // --- LÓGICA DE SALVAR O PDF (JÁ CORRIGIDA ANTERIORMENTE) ---
        // A lógica de salvar o PDF foi movida para usar a pasta /uploads/[ID]

        // 1. Define o nome do arquivo (o controller montará a URL)
        // --- LÓGICA DE SALVAR O PDF (CORRIGIDA) ---

        // 1. Define o nome do arquivo
        const fileName = `relatorio-${id}.pdf`;

        // 2. Define o caminho final do arquivo, usando o caminho que o Controller ENVIANDO (caminhoSalvarPdf)
        // O Controller já garantiu que este caminho exista.
        const filePath = path.join(caminhoSalvarPdf, fileName);

        // 3. Salva o PDF
        await fs.promises.writeFile(filePath, pdfBuffer);

        console.log(`[GERAR PDF] - PDF salvo em: ${filePath}`);

        // 4. Retorna SÓ o nome do arquivo
        return fileName;
        // --- FIM DA LÓGICA DE SALVAR ---

    } catch (error) {
        console.error("[ERRO FATAL] - Erro na função 'gerarPdf':", error);
        throw error;
    }
}

// src/services/relatoriosService.js (AJUSTE NA FUNÇÃO salvarRelatorio)

async function salvarRelatorio(body) {
    const medicoesIsolamentoJson = safeJsonParse(body.medicoes_isolamento || body.medicoesIsolamento);
    const medicoesBatimentoJson = safeJsonParse(body.medicoes_batimento || body.medicoesBatimento);
    const pecasAtuaisJson = safeJsonParse(body.pecas_atuais || body.pecasAtuais);
    const fotosComCaminhoJson = body.fotosComCaminho;
    
    // 🚨 NOVOS DADOS FINANCEIROS
    const pecasCotadasJson = safeJsonParse(body.pecas_cotadas); 
    const servicosCotadosJson = safeJsonParse(body.servicos_cotados);


    // Obtém o ID do cliente ou tenta criá-lo
    const clienteId = await clientesService.getOrCreateCliente(body);

    return relatoriosRepository.executarTransacao(async (client) => {
        const relatorioData = {
            ...body,
            cliente_id: clienteId, 
            data_inicio: body.data_inicio || '',
            data_fim: body.data_fim || '',
            numero_rte: body.numero_rte || '',
            cliente_logo_path: body.cliente_logo || '', 
            fotos_com_caminho: body.fotosComCaminho || null,
        };

        const relatorioId = await relatoriosRepository.salvarRelatorio(relatorioData, client);
        
        // Salva dados técnicos
        if (medicoesIsolamentoJson.length > 0) await relatoriosRepository.salvarMedicaoIsolamento(relatorioId, medicoesIsolamentoJson, client);
        if (medicoesBatimentoJson.length > 0) await relatoriosRepository.salvarMedicaoBatimento(relatorioId, medicoesBatimentoJson, client);
        if (pecasAtuaisJson.length > 0) await relatoriosRepository.salvarPecasAtuais(relatorioId, pecasAtuaisJson, client);
        
        // 🚨 SALVA DADOS FINANCEIROS 🚨
        if (pecasCotadasJson.length > 0) await relatoriosRepository.salvarRelatorioPecas(relatorioId, pecasCotadasJson, client);
        if (servicosCotadosJson.length > 0) await relatoriosRepository.salvarRelatorioServicos(relatorioId, servicosCotadasJson, client);
        
        console.log('[DEBUG-SERVICE] RelatorioData salvo com cliente_id:', clienteId);
        return relatorioId;
    });
}

async function salvarCaminhosFotos(uploadedFilesData) {
    if (!uploadedFilesData || uploadedFilesData.length === 0) { return; }
    await relatoriosRepository.executarTransacao(async (client) => {
        await relatoriosRepository.salvarCaminhosFotos(uploadedFilesData, client);
    });
}


// FUNÇÃO PARA SALVAR BASE64 (PARA O CONTROLLER)
async function salvarFotoBase64NoDB(base64Data, section, relatorioId, description) {
    if (!base64Data || !relatorioId) { return; }

    const fotoDataUrlPrefix = 'data:image/jpeg;base64,';
    let base64Content = base64Data;

    // 1. Limpar o prefixo (se necessário)
    if (base64Data.startsWith(fotoDataUrlPrefix)) {
        base64Content = base64Data.substring(fotoDataUrlPrefix.length);
    }

    // 2. Converter Base64 para Buffer e salvar no disco
    const buffer = Buffer.from(base64Content, 'base64'); // <-- Este 'buffer' (minúsculo) está correto aqui
    const fileName = `base64_${section}_${relatorioId}_${Date.now()}.jpg`;

    // --- LÓGICA DE CAMINHO ---
    // AINDA SALVA NA RAIZ, o controller/gerarPdf vai mover
    const filePath = path.join(UPLOADS_DIR, fileName);
    // ---------------------------------

    try {
        await fs.promises.writeFile(filePath, buffer); // <-- E está correto aqui
        console.log(`[BASE64-SALVO] Foto ${fileName} salva com sucesso em: ${filePath}`);

        // 3. Registrar o caminho da foto no DB
        const fileRecord = [{
            relatorio_id: relatorioId,
            caminho_foto: fileName, // Salva só o nome
            secao: section,
            descricao: description || 'Foto Base64'
        }];

        // Função existente que salva caminhos de fotos
        await salvarCaminhosFotos(fileRecord);

    } catch (error) {
        console.error(`[ERRO-BASE64] Falha ao salvar arquivo Base64 ${fileName}:`, error);
        throw error;
    }
}

// 🚀 FUNÇÃO DE BUSCA AVANÇADA (NOVA) 🚀
async function buscarRelatorios({ query, page, limit }) {
    if (!query) {
        throw new Error("Parâmetro de busca obrigatório.");
    }
    
    // Chama o repositório para fazer a busca paginada e o JOIN
    const results = await relatoriosRepository.buscarRelatoriosAvancado(query, page, limit);

    // Formatar datas e nomes para exibição no frontend
    const formattedRelatorios = results.relatorios.map(r => ({
        ...r,
        // Garante que o nome final do cliente venha formatado
        cliente_nome: r.cliente_nome_final || r.cliente_nome,
        // Formata a data de emissão para visualização
        data_emissao: formatDate(r.data_emissao)
    }));

    return {
        ...results,
        relatorios: formattedRelatorios
    };
}

// src/services/relatoriosService.js (ADICIONAR ESTE BLOCO)

/**
 * Busca todos os dados de um relatório (principal, medições, fotos e financeiro).
 */
async function buscarDetalhesCompletos(id) {
    if (!id) throw new Error("ID do relatório é obrigatório.");

    // O Service precisa de uma transação para puxar todos os dados relacionados
    const result = await relatoriosRepository.executarTransacao(async (client) => {
        // 1. Puxa os dados principais do relatório (que já inclui cliente_id)
        const relatorioPrincipal = await relatoriosRepository.buscarRelatorioPorId(id, client);

        if (!relatorioPrincipal) {
            return null;
        }

        // 2. Puxa todos os dados secundários (medições, fotos, pecasCotadas, servicosCotados)
        // O Repository já fará os JOINs nas tabelas financeiras
        const dadosRelacionados = await relatoriosRepository.buscarDadosRelacionados(id, client);
        
        // 3. Monta o objeto final
        return {
            ...relatorioPrincipal,
            ...dadosRelacionados
        };
    });
    
    // Formatação de dados para o Frontend (Datas e CNPJ)
    if (result) {
        result.data_emissao_formatado = formatDate(result.data_emissao);
        // Usa a formatação do service para o CNPJ
        result.cliente_cnpj_formatado = result.cliente_cnpj ? formatCnpj(result.cliente_cnpj) : result.cliente_cnpj; 
    }

    return result;
}


export default {
    salvarRelatorio,
    salvarCaminhosFotos,
    gerarPdfBuffer: gerarPdf,
    salvarFotoBase64NoDB,
    buscarRelatorios, 
    buscarDetalhesCompletos
};