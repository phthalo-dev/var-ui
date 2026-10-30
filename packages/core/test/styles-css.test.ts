// @vitest-environment node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runTypestylesBuild } from '@typestyles/build-runner';
import { describe, expect, it } from 'vite-plus/test';

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NEEDLES = ['.var-ui-button', '.theme-var-ui-default', '@property --var-ui-'];
const MIN_BYTES = 10_000;

describe('core styles.css extract', () => {
  it('includes recipes, default theme, and token @property rules', async () => {
    const css = await runTypestylesBuild({
      root: coreRoot,
      modules: ['src/styles.ts'],
    });
    expect(Buffer.byteLength(css, 'utf8')).toBeGreaterThan(MIN_BYTES);
    for (const needle of NEEDLES) {
      expect(css).toContain(needle);
    }
  }, 30_000);

  it('ships the reduced-motion token mode and forced-colors rules', async () => {
    const css = await runTypestylesBuild({
      root: coreRoot,
      modules: ['src/styles.ts'],
    });
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.theme-var-ui-default\s*\{[^}]*--var-ui-duration-medium:\s*0ms/,
    );
    expect(css).toContain('@media (forced-colors: active)');
  }, 30_000);
});
