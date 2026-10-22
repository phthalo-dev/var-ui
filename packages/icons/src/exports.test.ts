import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { iconNameList } from '@var-ui/core';
import { describe, expect, it } from 'vite-plus/test';
import { close } from './icons/close';
import { svg as closeSvg } from './glyph-data/close';
import { isValidElement } from 'react';

const pkgRoot = fileURLToPath(new URL('..', import.meta.url));

describe('@var-ui/icons subpaths', () => {
  it('publishes one React entry and one SVG entry per semantic icon', () => {
    const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8')) as {
      exports: Record<string, { import: string }>;
    };
    const glyphFiles = readdirSync(join(pkgRoot, 'src/glyph-data')).map((file) =>
      file.replace(/\.ts$/, ''),
    );
    expect(glyphFiles.sort()).toEqual([...iconNameList].sort());
    for (const name of iconNameList) {
      expect(pkg.exports[`./${name}`]?.import).toBe(`./dist/icons/${name}.mjs`);
      expect(pkg.exports[`./glyphs/${name}`]?.import).toBe(`./dist/glyph-data/${name}.mjs`);
    }
  });

  it('exports the close glyph without the rest of the registry', () => {
    expect(isValidElement(close)).toBe(true);
    expect(closeSvg).toContain('<svg');
    expect(closeSvg).toContain('M6 6l12 12');
  });
});
