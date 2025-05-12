// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import jestPlugin from 'eslint-plugin-jest';

export default [
  // 1. Базовые правила ESLint
  js.configs.recommended,

  // 2. Настройки для Node.js/CommonJS файлов (backend, миграции)
  {
    files: [
      'backend/**/*.js',
      'db/**/*.js',
      'tests/**/*.js'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs', // Важно для require/module.exports
      globals: {
        ...globals.node, // Включает require, module, exports, __dirname, process, console
      },
    },
    rules: {
      'no-console': 'off', // Разрешаем console.log
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Игнорируем неиспользуемые аргументы с _
    },
  },

  // 3. Настройки для Frontend (Electron Renderer)
  {
    files: ['frontend/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser, // document, window и т.д.
        ...globals.node,    // require, process и т.д.
        ipcRenderer: 'readonly',
        electron: 'readonly',
        confirm: 'readonly',
      },
    },
  },

  // 4. Настройки для тестов Jest
  {
    files: ['**/*.test.js'],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // 5. Prettier конфигурация (должна быть последней)
];
