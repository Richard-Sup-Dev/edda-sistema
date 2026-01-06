// src/hooks/usePasswordStrength.js
import { useState, useEffect } from 'react';

export default function usePasswordStrength(password = '') {
    const [strength, setStrength] = useState(0);
    const [label, setLabel] = useState('');
    const [color, setColor] = useState('#666');

    useEffect(() => {
        if (!password) {
            setStrength(0);
            setLabel('');
            setColor('#666');
            return;
        }

        let score = 0;

        // Comprimento
        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 10; // bônus por senha longa

        // Variedade de caracteres
        if (/[a-z]/.test(password)) score += 20;
        if (/[A-Z]/.test(password)) score += 20;
        if (/[0-9]/.test(password)) score += 20;
        if (/[^A-Za-z0-9]/.test(password)) score += 20;

        // Limita a 100
        const finalScore = Math.min(score, 100);
        setStrength(finalScore);

        // Labels e cores mais consistentes com seu design
        if (finalScore < 40) {
            setLabel('Fraca');
            setColor('#ff3b30');
        } else if (finalScore < 60) {
            setLabel('Média');
            setColor('#ff9500');
        } else if (finalScore < 80) {
            setLabel('Forte');
            setColor('#ffcc00');
        } else if (finalScore < 100) {
            setLabel('Muito Forte');
            setColor('#34c759');
        } else {
            setLabel('Excelente');
            setColor('#30d158'); // verde mais intenso
        }

    }, [password]);

    return { strength, label, color };
}