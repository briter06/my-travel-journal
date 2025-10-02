const { defineConfig, globalIgnores } = require('eslint/config');
const tsParser = require('@typescript-eslint/parser');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  // TypeScript files
  {
    files: ['packages/**/*.ts', 'packages/**/*.tsx'], // All TS/TSX files in monorepo
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json', // Must point to correct TS config
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'prettier',
    ),
    rules: {
      '@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowTernary: true, allowTaggedTemplates: true },
      ],
    },
  },

  // Global ignores
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/build/',
    '**/.vscode/',
    '**/tests/results/',
    '**/.env',
  ]),
]);
