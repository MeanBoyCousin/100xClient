// @ts-check
/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
const config = {
  coverageAnalysis: 'perTest',
  ignorePatterns: ['src/sandbox.ts'],
  mutate: ['src/**/*.ts', '!src/**/*.test.ts', '!src/ABI/**'],
  packageManager: 'yarn',
  reporters: ['html', 'progress'],
  testRunner: 'vitest',
}

export default config
