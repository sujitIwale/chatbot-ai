module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  root: true,
  ignorePatterns: ['.eslintrc.js', 'dist'],
  rules: {
    // Disable some rules that conflict with TypeScript
    'no-unused-vars': 'off',
    'no-undef': 'off',
  },
}; 