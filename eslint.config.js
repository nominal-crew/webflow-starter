import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
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
      // 'no-console': [
      //   'warn',
      //   {
      //     allow: ['warn', 'error']
      //   }
      // ],

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
    files: ['*.js', 'scripts/**/*.js', 'scripts/**/*.mjs'],

    languageOptions: {
      globals: {
        ...globals.nodeBuiltin
      }
    }
  }
];
