import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: ['src/index.ts', 'src/glyphs.ts'],
    dts: true,
    format: ['esm'],
    sourcemap: true,
    deps: { neverBundle: ['react', '@var-ui/core'] },
  },
});
