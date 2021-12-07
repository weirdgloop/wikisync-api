module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  env: {
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'no-console': 'off',
    'no-prototype-builtins': 'off',
    'radix': 'off',
    'max-len': 'off',
    'no-bitwise': 'off',
    'no-plusplus': 'off',
    'import/prefer-default-export': 'off'
  }
};
