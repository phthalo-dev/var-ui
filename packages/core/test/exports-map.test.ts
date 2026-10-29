import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

const pkgDir = join(dirname(fileURLToPath(import.meta.url)), '..');

function readPkg(name: 'core' | 'react') {
  return JSON.parse(readFileSync(join(pkgDir, '..', name, 'package.json'), 'utf8')) as {
    exports: Record<string, { import: string; types: string }>;
  };
}

describe('package subpath exports', () => {
  it('core exposes button and theme-constants entry points', () => {
    const { exports } = readPkg('core');
    expect(exports['./components/button']?.import).toBe('./dist/components/button.mjs');
    expect(exports['./button']).toBeUndefined();
    expect(exports['./components/controlSize']).toBeUndefined();
    expect(exports['./theme-constants']?.import).toBe('./dist/theme/constants.mjs');
    expect(exports['./internal']).toBeUndefined();
    expect(exports['./components/indicators/segmented-control']?.import).toBe(
      './dist/components/indicators/segmented-control.mjs',
    );
    expect(exports['./indicators/segmented-control']).toBeUndefined();
    expect(exports['./register-default-theme']?.import).toBe('./dist/theme/register-default.mjs');
    expect(exports['./styles']?.import).toBe('./dist/styles.mjs');
    expect(exports['./base-styles']).toBeUndefined();
    expect(exports['./index']).toBeUndefined();
    expect(exports['./components/index']).toBeUndefined();
  });

  it('react exposes component modules explicitly, not implementation helpers', () => {
    const { exports } = readPkg('react');
    expect(exports['./components/*']).toBeUndefined();
    expect(exports['./components/Button']).toEqual({
      types: './dist/components/Button.d.mts',
      import: './dist/components/Button.mjs',
    });
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
    expect(exports['./button']).toBeUndefined();
    expect(exports['./Button']).toBeUndefined();
  });
});
