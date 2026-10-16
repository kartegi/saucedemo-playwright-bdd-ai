import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default defineConfig(
  {
    ignores: [
      'node_modules/',
      '.features-gen/',
      'test-results/',
      'playwright-report/',
      'blob-report/',
      'allure-results/',
      'allure-report/',
      '_site/',
    ],
  },
  js.configs.recommended,
  // Rules that use the types, for example no-floating-promises: a missing `await` before a
  // Playwright action is the most common bug in this kind of code
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    // The scripts are plain JavaScript and not part of the TypeScript project
    files: ['**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: { process: 'readonly', console: 'readonly' } },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['src/**/*.ts', 'features/**/*.ts', 'tests/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/expect-expect': 'off',
      'playwright/no-standalone-expect': 'off',
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-wait-for-timeout': 'warn',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  prettier,
);
