import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

const pkgDir = join(dirname(fileURLToPath(import.meta.url)), '..');

type ExportEntry = { import: string; types: string };

function readPkg(name: 'core' | 'react') {
  return JSON.parse(readFileSync(join(pkgDir, '..', name, 'package.json'), 'utf8')) as {
    exports: Record<string, ExportEntry | string | null>;
  };
}

function moduleExport(
  exports: Record<string, ExportEntry | string | null>,
  key: string,
): ExportEntry {
  const entry = exports[key];
  if (!entry || typeof entry === 'string') {
    throw new Error(`Expected module export for ${key}`);
  }
  return entry;
}

describe('package subpath exports', () => {
  it('core uses wildcards for components/shared and reserves theme/styles entries', () => {
    const { exports } = readPkg('core');
    expect(exports['./components/*']).toEqual({
      types: './dist/components/*.d.mts',
      import: './dist/components/*.mjs',
    });
    expect(exports['./shared/*']).toEqual({
      types: './dist/shared/*.d.mts',
      import: './dist/shared/*.mjs',
    });
    expect(exports['./components/index']).toBeNull();
    expect(exports['./components/controlSize']).toBeUndefined();
    expect(exports['./components/fieldChrome']).toBeUndefined();
    expect(exports['./components/focusRing']).toBeUndefined();
    expect(moduleExport(exports, './theme-constants').import).toBe('./dist/theme/constants.mjs');
    expect(moduleExport(exports, './register-default-theme').import).toBe(
      './dist/theme/register-default.mjs',
    );
    expect(moduleExport(exports, './styles').import).toBe('./dist/styles.mjs');
    expect(exports['./styles.css']).toBe('./dist/styles.css');
    expect(moduleExport(exports, './tokens/declare').import).toBe('./dist/tokens/declare.mjs');
    expect(moduleExport(exports, './icons/iconNames').import).toBe('./dist/icons/iconNames.mjs');
    expect(exports['./button']).toBeUndefined();
    expect(exports['./internal']).toBeUndefined();
    expect(exports['./base-styles']).toBeUndefined();
    expect(exports['./index']).toBeUndefined();
  });

  it('react uses a components wildcard and does not publish helpers', () => {
    const { exports } = readPkg('react');
    expect(exports['./components/*']).toEqual({
      types: './dist/components/*.d.mts',
      import: './dist/components/*.mjs',
    });
    expect(exports['./components/index']).toBeNull();
    for (const internal of [
      'menuContent',
      'menuPresets',
      'controlSizeContext',
      'commandPaletteHotkey',
      'commandPaletteController',
      'racClassName',
    ]) {
      expect(exports[`./components/${internal}`]).toBeUndefined();
    }
    expect(exports['./internal']).toBeUndefined();
    expect(exports['./button']).toBeUndefined();
    expect(exports['./Button']).toBeUndefined();
  });
});
