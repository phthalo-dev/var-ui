import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { findInstalledReactVersion, staleCatalogWarning } from './catalog-freshness';
import type { Catalog } from './types';

const temps: string[] = [];

function tmpDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'var-ui-cli-fresh-'));
  temps.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of temps.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

function installProject(reactVersion: string): string {
  const project = tmpDir();
  const pkgDir = path.join(project, 'node_modules', '@var-ui', 'react');
  fs.mkdirSync(pkgDir, { recursive: true });
  fs.writeFileSync(
    path.join(pkgDir, 'package.json'),
    JSON.stringify({ name: '@var-ui/react', version: reactVersion }),
  );
  return project;
}

function catalogWithReactVersion(version: string): Catalog {
  return {
    version: '0.3.2',
    meta: {
      generatedAt: '2026-11-13T00:00:00.000Z',
      packages: { react: version, core: version, icons: version, astro: version },
    },
    components: [],
    guides: [],
  };
}

describe('findInstalledReactVersion', () => {
  it('walks up from startDir to the nearest node_modules', () => {
    const project = installProject('0.10.0');
    const nested = path.join(project, 'src', 'nested');
    fs.mkdirSync(nested, { recursive: true });
    expect(findInstalledReactVersion(nested)).toBe('0.10.0');
  });

  it('returns undefined when @var-ui/react is not installed', () => {
    const project = tmpDir();
    expect(findInstalledReactVersion(project)).toBeUndefined();
  });

  it('returns undefined when package.json is unreadable', () => {
    const project = tmpDir();
    const pkgDir = path.join(project, 'node_modules', '@var-ui', 'react');
    fs.mkdirSync(pkgDir, { recursive: true });
    fs.writeFileSync(path.join(pkgDir, 'package.json'), '{not json');
    expect(findInstalledReactVersion(project)).toBeUndefined();
  });
});

describe('staleCatalogWarning', () => {
  it('warns when the installed react is newer than the catalog', () => {
    const warning = staleCatalogWarning(catalogWithReactVersion('0.10.0'), '0.11.0');
    expect(warning).toContain('generated against @var-ui/react@0.10.0');
    expect(warning).toContain('your project has @var-ui/react@0.11.0');
  });

  it('warns in both directions (newer catalog, older install)', () => {
    const warning = staleCatalogWarning(catalogWithReactVersion('0.11.0'), '0.10.0');
    expect(warning).toContain('generated against @var-ui/react@0.11.0');
  });

  it('stays quiet when versions match', () => {
    expect(staleCatalogWarning(catalogWithReactVersion('0.10.0'), '0.10.0')).toBeUndefined();
  });

  it('stays quiet without an installed package or catalog meta', () => {
    expect(staleCatalogWarning(catalogWithReactVersion('0.10.0'), undefined)).toBeUndefined();
    expect(
      staleCatalogWarning({ version: '0.3.2', components: [], guides: [] }, '0.10.0'),
    ).toBeUndefined();
  });
});
