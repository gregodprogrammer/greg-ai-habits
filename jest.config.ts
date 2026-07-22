import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/features/**/*.ts',
    'src/providers/**/*.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.dto.ts',
  ],
};

export default createJestConfig(config);
