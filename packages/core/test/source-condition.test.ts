import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vite-plus/test';

/**
 * In-repo consumers resolve Var UI packages to TypeScript source through the `@var-ui/source`
 * export condition (see `source-conditions.ts` at the repo root), so every built entry needs a
 * source twin. A missing one would silently fall back to a stale `dist` in the docs and tests.
 */
const packagesDir = path.resolve(import.meta.dirname, '../..');
const SOURCE = '@var-ui/source';

/** Every file a wildcard target can match (`./src/components/*.ts`). */
function wildcardMatches(pkgDir: string, target: string): string[] {
  const [prefix, suffix] = target.split('*') as [string, string];
  const dir = path.join(pkgDir, path.dirname(prefix));
  return readdirSync(dir, { recursive: true, encoding: 'utf8' }).filter((file) =>
    `./${path.join(path.relative(pkgDir, dir), file)}`.endsWith(suffix),
  );
}

describe.each(['core', 'react', 'icons'])('@var-ui/%s exports', (name) => {
  const pkgDir = path.join(packagesDir, name);
  const { exports } = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf8')) as {
    exports: Record<string, string | null | Record<string, string>>;
  };
  const conditional = Object.entries(exports).filter(
    (entry): entry is [string, Record<string, string>] =>
      typeof entry[1] === 'object' && entry[1] !== null,
  );

  it('gives every built entry a source condition, listed first', () => {
    for (const [key, entry] of conditional) {
      expect(Object.keys(entry)[0], key).toBe(SOURCE);
    }
  });

  it('points every source condition at a file that exists', () => {
    for (const [key, entry] of conditional) {
      const target = entry[SOURCE]!;
      if (target.includes('*')) {
        expect(wildcardMatches(pkgDir, target).length, key).toBeGreaterThan(0);
      } else {
        expect(existsSync(path.join(pkgDir, target)), `${key} → ${target}`).toBe(true);
      }
    }
  });
});
