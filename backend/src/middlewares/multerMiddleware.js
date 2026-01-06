// src/middlewares/multerMiddleware.js (ORDEM CORRIGIDA PARA ESM)

import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url'; // Módulo 'url' importado

// === 1. DEFINIÇÃO DE __dirname/filename (POSIÇÃO CORRETA) ===
// Estas linhas DEVEM ser executadas antes de qualquer uso de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ==========================================================

// === 2. USO DA VARIÁVEL ===
const uploadDir = path.join(__dirname, '..', '..', 'uploads'); // Agora __dirname está definido

const ensureUploadDir = async () => {
    try {
        await fs.access(uploadDir);
    } catch {
        await fs.mkdir(uploadDir);
    }
};
ensureUploadDir();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {

        console.log(`[MULTER-FILENAME] Salvando arquivo: ${file.originalname}`);
        // Nome original para evitar conflitos de cache no frontend/backend
        // Define o nome no formato: timestamp-nomeoriginal.ext
        const sanitizedFilename = file.originalname.replace(/[^a-z0-9.]/gi, '_');
        cb(null, `${Date.now()}-${sanitizedFilename}`);
    }
});

// Exporta a instância base do Multer
const uploadInstance = multer({ 
    storage: storage,
    limits: {
        // CORREÇÃO CRÍTICA: Aumenta o limite para o valor de campo (50MB) 
        // para acomodar a longa string Base64.
        fieldSize: 100 * 1024 * 1024, 
        
        // Mantém o limite de tamanho de arquivo (se usado para uploads diretos)
        fileSize: 20 * 1024 * 1024 // Você pode ajustar este limite também, se necessário
    }
});

export default uploadInstance;