import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import react from 'eslint-plugin-react';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{js,jsx,tsx}'],
        extends: [
            js.configs.recommended,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
            'react/no-unescaped-entities': 'off', // Ignora caracteres como > no HTML

            // Desativa a regra que proíbe texto solto (React Native hierarchy)
            'react/jsx-no-literals': 'off', 
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
]);