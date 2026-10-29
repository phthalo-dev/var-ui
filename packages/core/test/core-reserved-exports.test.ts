// @vitest-environment node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

const pkg = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../package.json'), 'utf8'),
) as { exports: Record<string, unknown>; sideEffects: string[] };

describe('@var-ui/core package.json', () => {
  it('exports and marks styles.css as a side effect', () => {
    expect(pkg.exports['./styles.css']).toBe('./dist/styles.css');
    expect(pkg.exports['./styles']).toEqual({
      types: './dist/styles.d.mts',
      import: './dist/styles.mjs',
    });
    expect(pkg.sideEffects).toContain('./dist/styles.css');
    expect(pkg.exports['./base-styles']).toBeUndefined();
  });
});
