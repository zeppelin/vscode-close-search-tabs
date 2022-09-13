/* eslint-env node */
module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
  },
  plugins: ['ember', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
    'no-const-assign': 'warn',
    'no-this-before-super': 'warn',
    'no-undef': 'warn',
    'no-unreachable': 'warn',
    'constructor-super': 'warn',
    'valid-typeof': 'warn',
  },
};
