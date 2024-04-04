import { defineConfig } from 'vitest/config'

const config = defineConfig({
  root: './src',
  test: {
    coverage: {
      all: true,
      exclude: ['__mocks__/', '__tests__/', 'types/', '**/types.ts', '**/*.d.ts', 'constants/**'],
      reporter: ['html', 'lcov'],
      reportsDirectory: '../coverage',
      watermarks: {
        statements: [80, 95],
        functions: [80, 95],
        branches: [80, 95],
        lines: [80, 95],
      },
    },
    environment: 'node',
    globals: true,
    setupFiles: '../vitest/vitest.setup.ts',
  },
})

export default config
