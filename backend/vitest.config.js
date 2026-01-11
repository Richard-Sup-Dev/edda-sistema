import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'src/__tests__/setup.js',
        'src/server.js',
        'src/components/**',
        '**/node_modules/**'
      ]
    },
    setupFiles: ['src/__tests__/setup.js'],
    include: ['src/__tests__/**/*.test.js'],
    exclude: ['node_modules', 'dist']
  },
});
