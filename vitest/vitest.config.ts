import { resolve } from 'path'

import { configDefaults, defineConfig } from 'vitest/config'

const config = defineConfig({
  resolve: {
    alias: [
      { find: 'src', replacement: resolve(__dirname, '../', './src') },
      { find: 'vitest/utils', replacement: resolve(__dirname, '../', './vitest/utils.ts') },
    ],
  },
  root: './src',
  test: {
    coverage: {
      all: true,
      exclude: [
        '__mocks__/',
        '__tests__/',
        'types/',
        '**/types.ts',
        '**/*.d.ts',
        'constants/**',
        'ABI/**',
        'sandbox.ts',
      ],
      reporter: ['html', 'lcov'],
      reportsDirectory: '../reports/vitest',
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
    fakeTimers: {
      toFake: [...(configDefaults.fakeTimers.toFake ?? []), 'performance'],
    },
  },
})

export default config
