module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  globals: { 'ts-jest': { tsconfig: 'tsconfig.json' } },
};
