export default {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1'
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  testPathIgnorePatterns: [
    'node_modules/',
    'dist/'
  ],
  transform: {
    '^.+\\.js$': ['babel-jest', { presets: ['@babel/preset-env'] }]
  },
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/__tests__/**',
    '!src/server.js',
    '!src/components/**',
    '!**/node_modules/**'
  ],
  transformIgnorePatterns: [
    '/node_modules/'
  ],
};
