/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['.d.ts', '.js', '/node_modules/', '/lib/'],
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  coverageDirectory: 'tests/results/coverage',
};
