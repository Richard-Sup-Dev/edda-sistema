// src/utils/index.js
import path from 'path';
import fs from 'fs/promises';

/**
 * Converte um arquivo de imagem em uma string Base64 (Data URI)
 */
async function imageToBase64(filePath) {
    if (!filePath) return '';
    try {
        const data = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        let mimeType = 'image/jpeg';
        if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.gif') mimeType = 'image/gif';
        else if (ext === '.webp') mimeType = 'image/webp';

        return `data:${mimeType};base64,${data.toString('base64')}`;
    } catch (error) {
        console.error('[ERRO FATAL - BASE64] Falha ao ler arquivo:', filePath, error.message);
        return '';
    }
}

/**
 * Formata data para dd/MM/yyyy no fuso de São Paulo (UTC-3)
 * Corrige: 2025-11-01T00:00:00Z → 01/11/2025 (não 02/11)
 */
// [src/utils/index.js]

/**
 * Formata data para dd/MM/yyyy, forçando a interpretação UTC
 * para evitar que o fuso horário local subtraia um dia (00:00:00Z).
 */
function formatDate(dateString) {
    if (!dateString) return 'Não informado';

    let date;
    try {
        date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Não informado';
    } catch (e) {
        return 'Não informado';
    }

    // CRÍTICO: Se a data não tiver componente de tempo (como é o caso de datas do DB
    // que são salvas como 00:00:00Z), adicionamos o offset do fuso horário local
    // (timezoneOffset é o inverso do fuso local) para "resetar" a hora para 00:00:00 local.
    // Isso evita o erro de subtrair um dia.

    // (1) Pegar o offset atual (ex: -180 minutos para GMT-3)
    const offset = date.getTimezoneOffset();

    // (2) Ajustar a data local para a meia-noite
    const correctedDate = new Date(date.getTime() + offset * 60 * 1000);

    // Agora, usamos os métodos getLocal** para formatar
    const dia = String(correctedDate.getDate()).padStart(2, '0');
    const mes = String(correctedDate.getMonth() + 1).padStart(2, '0');
    const ano = correctedDate.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

/**
 * Converte array de strings em lista HTML
 */
function textToHtmlList(items) {
    if (!items || items.length === 0) return '<ul><li>Nenhum item listado.</li></ul>';

    if (typeof items[0] === 'string' && items[0].startsWith('<li')) {
        return `<ul>${items.join('')}</ul>`;
    }

    return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

export {
    imageToBase64,
    textToHtmlList,
    formatDate,
};