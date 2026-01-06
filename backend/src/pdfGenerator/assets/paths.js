// src/pdfGenerator/assets/paths.js

const path = require('path');

// Caminho absoluto para a pasta 'assets' a partir do diretório atual (onde paths.js reside)
const assetsDir = path.resolve(__dirname); 

exports.paths = {
    // --- EDDA LOGO: Removido eddaLogoPath que não existe.
    
    // Logo Horizontal (usada no cabeçalho/rodapé do PDF)
    eddaLogoHorizontalPath: path.join(assetsDir, 'edda_logo_horizontal.png'),
    
    // Ilustração do Eixo (CRÍTICO: "I" maiúsculo, conforme sua pasta)
    eixoIllustrationPath: path.join(assetsDir, 'Imagem_eixo.png'),
    
    // Outras fotos de medição (Nomes exatos da sua pasta)
    foto1Path: path.join(assetsDir, 'FOTO_1_ISOLAMENTO_1E4.png'),
    foto2Path: path.join(assetsDir, 'FOTO_2_ISOLAMENTO_2E5.png'),
    foto3Path: path.join(assetsDir, 'FOTO_3_ISOLAMENTO_3E6.png'),
    foto4Path: path.join(assetsDir, 'FOTO_4_ISOLAMENTO_1E2.png'),
};