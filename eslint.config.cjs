// eslint.config.cjs — ESLint v9 flat config
const js = require('@eslint/js');
const globals = require('globals');
const jest = require('eslint-plugin-jest');

module.exports = [
  // 1) Ignore patterns (replaces .eslintignore)
  {
    ignores: ['node_modules/**', 'coverage/**']
  },

  // 2) Base recommended rules
  js.configs.recommended,

  // 3) Project-specific layer
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    plugins: {
      jest
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
];
