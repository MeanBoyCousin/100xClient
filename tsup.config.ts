import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  entry: ['src/index.ts', 'src/enums.ts'],
  format: 'esm',
  minify: false,
  platform: 'node',
  outDir: 'lib',
  sourcemap: false,
  splitting: false,
  treeshake: true,
})
