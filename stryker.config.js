// @ts-check
/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
const config = {
  checkers: ['typescript'],
  coverageAnalysis: 'perTest',
  ignorers: ['logger'],
  ignorePatterns: ['src/sandbox.ts'],
  ignoreStatic: true,
  mutate: ['src/**/*.ts', '!src/**/*.test.ts', '!src/ABI/**'],
  packageManager: 'yarn',
  plugins: ['@stryker-mutator/*', './stryker/stryker-logger-ignorer.js'],
  reporters: ['html', 'progress'],
  testRunner: 'vitest',
  vitest: {
    configFile: 'vitest/vitest.config.ts',
  },
}

export default config
