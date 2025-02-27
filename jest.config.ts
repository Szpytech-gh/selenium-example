import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-selenium',
  setupFilesAfterEnv: [],
};

export default config;