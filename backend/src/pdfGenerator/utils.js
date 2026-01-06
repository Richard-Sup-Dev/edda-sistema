// pdfGenerator/utils.js

import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
// 🚨 MÓDULO NECESSÁRIO: Você deve ter instalado este pacote.
import { fileTypeFromBuffer } from 'file-type';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Define o diretório de uploads (usando process.cwd() que aponta para a raiz do backend)
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

// -------------------------------------------------------------------
// Função imageToBase64 (CORRIGIDA: Determina o MIME Type dinamicamente)
// -------------------------------------------------------------------
async function imageToBase64(imagePath) {
    try {
        console.log(`[BASE64] Tentando carregar: ${imagePath}`);

        // 1. Verifica se o arquivo existe
        await fs.access(imagePath);
        
        // 2. Lê o buffer do arquivo
        const imageBuffer = await fs.readFile(imagePath);

        const buffer = imageBuffer;
        const base64Content = buffer.toString('base64');
        
        // 3. Determina o MIME Type real do arquivo usando file-type
        let mimeType = 'image/jpeg'; // Default seguro

        const type = await fileTypeFromBuffer(buffer);
        
        if (type && type.mime) {
             mimeType = type.mime;
             console.log(`[BASE64-MIME] Tipo de arquivo detectado: ${mimeType}`);
        } else {
             // Fallback: Se a detecção falhar, tentamos a extensão do arquivo
             if (imagePath.toLowerCase().endsWith('.png')) {
                 mimeType = 'image/png';
             }
             console.warn(`[BASE64-MIME] Falha na detecção, usando fallback: ${mimeType}`);
        }
        
        // 4. Retorna a string Base64 COMPLETA com o MIME Type CORRETO
        return `data:${mimeType};base64,${base64Content}`;

    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error(`[imageToBase64 ERROR] Falha na conversão de ${path.basename(imagePath)}:`, error);
        } else {
            console.warn(`[imageToBase64 WARNING] Arquivo não encontrado: ${imagePath}`);
        }
        // Retorna um GIF transparente 1x1 em caso de falha para não quebrar o HTML
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }
}


async function getAssetBase64(fileName) {
    const assetPath = path.join(__dirname, 'assets', fileName);
    return await imageToBase64(assetPath);
}

/**
 * Converte uma imagem da pasta 'uploads' em Base64.
 */
async function getUploadBase64(fullPath) {
    // Confia no fullPath gerado pelo Service (que é o caminho absoluto).
    // A complexidade de path.join/isAbsolute foi removida no passo anterior.
    return await imageToBase64(fullPath);
}

export default {
    getAssetBase64,
    getUploadBase64
};