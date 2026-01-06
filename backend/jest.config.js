export default {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: ['**/__tests__/**/health.test.js'],
  testPathIgnorePatterns: [
    'node_modules/',
    'dist/'
  ],
  testTimeout: 30000
};
