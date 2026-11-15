import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import type { Catalog } from './types';

/**
 * Resolve the version of @var-ui/react installed for the user's project by
 * walking up from `startDir` looking for node_modules, or undefined when the
 * package is not installed.
 */
export function findInstalledReactVersion(startDir: string): string | undefined {
  let dir = resolve(startDir);
  while (true) {
    const pkgPath = join(dir, 'node_modules', '@var-ui', 'react', 'package.json');
    if (existsSync(pkgPath)) {
      try {
        return (JSON.parse(readFileSync(pkgPath, 'utf8')) as { version?: string }).version;
      } catch {
        return undefined;
      }
    }
    const parent = dirname(dir);
    if (parent === dir) {
      return undefined;
    }
    dir = parent;
  }
}

/**
 * The CLI ships a docs catalog generated at build time, so it can lag the
 * @var-ui/react version the user has installed. Return a stderr warning for
 * that mismatch, or undefined when there is nothing to warn about (no meta —
 * older catalogs and fixtures —, no installed package, or matching versions).
 */
export function staleCatalogWarning(
  catalog: Catalog,
  installedVersion: string | undefined,
): string | undefined {
  const documented = catalog.meta?.packages.react;
  if (!documented || !installedVersion || installedVersion === documented) {
    return undefined;
  }
  return [
    `warning: this @var-ui/cli catalog was generated against @var-ui/react@${documented},`,
    `but your project has @var-ui/react@${installedVersion}; component docs may be stale.`,
    'Check https://var-ui.dev or node_modules/@var-ui/react/dist for the current API,',
    'and upgrade @var-ui/cli if it is behind.',
  ].join('\n');
}
