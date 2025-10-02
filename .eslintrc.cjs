module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Uses TypeScript parser
  parserOptions: {
    ecmaVersion: 'latest', // Allows modern ECMAScript features
    sourceType: 'module', // Allows import/export
    project: './tsconfig.json', // Required for rules that need type info
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended', // ESLint recommended rules
    'plugin:@typescript-eslint/recommended', // TypeScript recommended rules
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // Advanced type-aware rules
    'prettier', // Turns off ESLint rules that conflict with Prettier
  ],
  rules: {
    // Add or override rules here
    '@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off'
  },
};
