import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vite-plus/test';

/**
 * Every published package that calls TypeStyles at runtime must share the app's copy. A regular
 * dependency lets the package manager install a second `typestyles`, which means a second class
 * and token registry (issue #332).
 */
const packagesDir = path.resolve(import.meta.dirname, '../..');

describe.each(['core', 'react', 'astro', 'docs'])('@var-ui/%s', (name) => {
  const manifest = JSON.parse(
    readFileSync(path.join(packagesDir, name, 'package.json'), 'utf8'),
  ) as Record<string, Record<string, string> | undefined>;

  it('peer-depends on typestyles instead of depending on it', () => {
    expect(manifest.dependencies?.typestyles).toBeUndefined();
    expect(manifest.peerDependencies?.typestyles).toBeDefined();
  });
});
