// backend/src/controllers/relatoriosController.js

import relatoriosService from '../services/relatoriosService.js';
import relatorioSchema from '../validations/relatorioValidation.js';
import fs from 'fs/promises';
import path from 'path';
import { Buffer } from 'buffer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.SERVER_BASE_URL || 'http://localhost:3001';
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

// Garante que a pasta /uploads exista na inicialização
await fs.mkdir(uploadDir, { recursive: true }).catch(() => {});

// ==================== BUSCA AVANÇADA ====================
async function buscarRelatorios(req, res) {
  const { q, page = 1, limit = 10 } = req.query;
  const userId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';

  try {
    const results = await relatoriosService.buscarRelatorios({
      query: q?.trim() || '', // Se não tiver q, busca todos
      page: Number(page),
      limit: Number(limit),
      userId,
      isAdmin
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error);
    return res.status(500).json({ erro: 'Erro interno ao realizar a busca.' });
  }
}

// ==================== HELPER: SALVAR BASE64 ====================
async function decodeBase64AndSave(base64String) {
  if (!base64String) return null;

  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.jpeg`;
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);
  return fileName;
}

// ==================== CRIAR RELATÓRIO (FLUXO PRINCIPAL) ====================
async function criarRelatorio(req, res) {
  try {
    // --- PROCESSAMENTO DE ARQUIVOS (LOGO E FOTOS) ---
    const clienteLogoFile = req.files?.cliente_logo?.[0];
    const fotosFiles = req.files?.photos || [];
    const fotosBase64Payload = req.body.fotos_base64 ? JSON.parse(req.body.fotos_base64) : [];

    let body = { ...req.body };
    body.data_inicio = body.data_inicio || '';
    body.data_fim = body.data_fim || '';
    body.numero_rte = body.numero_rte || '';

    // Logo do cliente
    if (clienteLogoFile) {
      body.cliente_logo = clienteLogoFile.filename;
    }

    // Processamento de fotos
    let fotosComCaminho = [];
    const fotosMetadados = body.photo_metadata ? JSON.parse(body.photo_metadata) : [];

    // Prioridade 1: Fotos via Base64 (mobile)
    if (fotosBase64Payload.length > 0) {
      for (const foto of fotosBase64Payload) {
        if (!foto.base64) continue;
        const fileName = await decodeBase64AndSave(foto.base64);
        if (fileName) {
          fotosComCaminho.push({
            legenda: foto.legenda || '',
            secao: foto.secao || foto.sectionTitle || 'metodologia',
            fileName
          });
        }
      }
    }
    // Prioridade 2: Fotos via Multer (web)
    else if (fotosFiles.length > 0 && fotosMetadados.length > 0) {
      fotosComCaminho = fotosMetadados.map((meta, i) => ({
        legenda: meta.legenda || meta.description || '',
        secao: meta.secao || meta.section || 'metodologia',
        fileName: fotosFiles[i]?.filename || ''
      }));
    }

    body.fotosComCaminho = fotosComCaminho.length > 0 ? JSON.stringify(fotosComCaminho) : '';

    // Limpa campos temporários
    delete body.fotos;
    delete body.fotos_base64;
    delete body.photo_metadata;

    // --- VALIDAÇÃO JOI ---
    const { error, value } = relatorioSchema.validate(body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ erro: error.details.map(d => d.message).join('; ') });
    }

    // --- SALVAR NO BANCO E CRIAR ESTRUTURA DE PASTAS ---
    const relatorioId = await relatoriosService.salvarRelatorio(value);

    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const idPasta = String(relatorioId);

    const pastaRelatorio = path.join(uploadDir, ano, mes, idPasta);
    const pastaFotos = path.join(pastaRelatorio, 'fotos');
    const pastaPdf = path.join(pastaRelatorio, 'pdf');

    await fs.mkdir(pastaFotos, { recursive: true });
    await fs.mkdir(pastaPdf, { recursive: true });

    // --- MOVER ARQUIVOS PARA A NOVA ESTRUTURA ---
    const fotosParaSalvarNoDB = [];

    // Mover logo
    if (value.cliente_logo) {
      const oldPath = path.join(uploadDir, value.cliente_logo);
      const newPath = path.join(pastaFotos, value.cliente_logo);
      await fs.rename(oldPath, newPath).catch(() => {});
    }

    // Mover fotos
    if (fotosComCaminho.length > 0) {
      for (const foto of fotosComCaminho) {
        if (foto.fileName) {
          const oldPath = path.join(uploadDir, foto.fileName);
          const newPath = path.join(pastaFotos, foto.fileName);
          await fs.rename(oldPath, newPath).catch(() => {});
        }

        fotosParaSalvarNoDB.push({
          relatorioId,
          caminho_foto: foto.fileName,
          legenda: foto.legenda,
          secao: foto.secao
        });
      }

      await relatoriosService.salvarCaminhosFotos(fotosParaSalvarNoDB);
    }

    // --- GERAR PDF ---
    const pdfFileName = await relatoriosService.gerarPdfBuffer({
      id: relatorioId,
      caminhoSalvarPdf: pastaPdf,
      caminhoEncontrarFotos: pastaFotos
    });

    if (!pdfFileName) {
      throw new Error('Falha ao gerar o PDF.');
    }

    // --- CRIAR meta.json ---
    const pdfUrl = `${BASE_URL}/uploads/${ano}/${mes}/${idPasta}/pdf/${pdfFileName}`;

    const metaData = {
      id: relatorioId,
      os_numero: value.os_numero,
      cliente_nome: value.cliente_nome,
      criadoEm: agora.toISOString(),
      pdfUrl,
      caminhoFotos: `${BASE_URL}/uploads/${ano}/${mes}/${idPasta}/fotos/`
    };

    await fs.writeFile(path.join(pastaRelatorio, 'meta.json'), JSON.stringify(metaData, null, 2));

    // --- RESPOSTA FINAL ---
    return res.status(201).json({
      sucesso: true,
      id: relatorioId,
      pdfUrl
    });

  } catch (error) {
    console.error('Erro crítico ao criar relatório:', error);
    return res.status(500).json({
      sucesso: false,
      erro: error.message || 'Erro interno do servidor ao criar relatório.'
    });
  }
}

// ==================== BUSCAR METADADOS (meta.json) ====================
async function getRelatorioMeta(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID do relatório é obrigatório.' });
  }

  try {
    const relatorio = await relatoriosService.buscarRelatorioPorId(id);
    if (!relatorio) {
      return res.status(404).json({ erro: 'Relatório não encontrado.' });
    }

    const dataRef = relatorio.data_inicio_servico ? new Date(relatorio.data_inicio_servico) : new Date();
    const ano = dataRef.getFullYear();
    const mes = String(dataRef.getMonth() + 1).padStart(2, '0');

    const metaPath = path.join(uploadDir, String(ano), mes, String(id), 'meta.json');

    const metaContent = await fs.readFile(metaPath, 'utf8');
    const metaData = JSON.parse(metaContent);

    return res.status(200).json(metaData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ erro: 'Metadados do relatório não encontrados.' });
    }
    console.error('Erro ao buscar meta.json:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar metadados.' });
  }
}

// ==================== SALVAR ORÇAMENTO ====================
async function salvarOrcamento(req, res) {
  const { id } = req.params;
  const { pecas_cotadas, servicos_cotados } = req.body;

  if (!id) {
    return res.status(400).json({ erro: 'ID do relatório é obrigatório.' });
  }

  try {
    await relatoriosService.salvarOrcamento(id, pecas_cotadas || [], servicos_cotados || []);
    return res.status(200).json({ mensagem: 'Orçamento salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error);
    return res.status(500).json({ erro: error.message || 'Erro ao salvar orçamento.' });
  }
}

// ==================== BUSCAR DETALHES COMPLETOS ====================
async function buscarDetalhesCompletos(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID do relatório é obrigatório.' });
  }

  try {
    const detalhes = await relatoriosService.buscarDetalhesCompletos(id);
    if (!detalhes) {
      return res.status(404).json({ erro: 'Relatório não encontrado.' });
    }

    return res.status(200).json(detalhes);
  } catch (error) {
    console.error('Erro ao buscar detalhes completos:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar detalhes do relatório.' });
  }
}

// ==================== ROTAS LEGADAS (DESATIVADAS) ====================
async function salvarFotos(req, res) {
  return res.status(410).json({ erro: 'Rota desativada. Use /api/relatorios para criar relatório completo.' });
}
async function salvarFotoBase64(req, res) {
  return res.status(410).json({ erro: 'Rota desativada. Use /api/relatorios.' });
}
async function getRelatorioPdfLink(req, res) {
  return res.status(410).json({ erro: 'Rota desativada. Use /api/relatorios/:id/meta.' });
}
async function gerarPdfRelatorio(req, res) {
  return res.status(410).json({ erro: 'Rota desativada. PDF é gerado automaticamente na criação.' });
}

export default {
  criarRelatorio,
  buscarRelatorios,
  getRelatorioMeta,
  salvarOrcamento,
  buscarDetalhesCompletos,
  salvarFotos,
  salvarFotoBase64,
  getRelatorioPdfLink,
  gerarPdfRelatorio
};