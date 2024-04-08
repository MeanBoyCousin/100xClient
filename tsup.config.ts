import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  dts: true,
  format: 'esm',
  minify: true,
  platform: 'node',
  outDir: 'lib',
  sourcemap: true,
  splitting: false,
  treeshake: true,
})
