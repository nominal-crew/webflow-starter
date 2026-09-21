import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.wrangler/**']
  },

  js.configs.recommended,

  {
    files: ['src/**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.browser
      }
    },

    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],

      'prefer-const': 'error',
      'no-var': 'error'
    }
  },

  {
    files: ['*.js'],

    languageOptions: {
      globals: {
        ...globals.nodeBuiltin
      }
    }
  }
];
