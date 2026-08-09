// eslint.config.js — configuração flat (ESLint 9).
// Foco em pegar erros reais (variáveis indefinidas, debugger) sem ser pedante.
import globals from 'globals';

export default [
    {
        ignores: ['node_modules/'],
    },
    {
        files: ['js/**/*.js', 'test/**/*.mjs'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'no-undef': 'error',
            'no-debugger': 'error',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-console': 'off',
            'prefer-const': 'warn',
        },
    },
];
