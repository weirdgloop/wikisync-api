import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import { configs as airbrbConfigs } from 'eslint-config-airbnb-extended/legacy';

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  airbrbConfigs.base.recommended,
  airbrbConfigs.base.typescript,
  {
    languageOptions: {
      globals: {
        node: true,
        es6: true,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      semi: 'error',
      'prefer-const': 'error',
      'no-console': 'off',
      'no-prototype-builtins': 'off',
      radix: 'off',
      'max-len': 'off',
      'no-bitwise': 'off',
      'no-plusplus': 'off',
      'import/prefer-default-export': 'off',
      'import-x/prefer-default-export': 'off',
      'class-methods-use-this': 'off',
      'consistent-return': 'off',
    },
  },
]);
