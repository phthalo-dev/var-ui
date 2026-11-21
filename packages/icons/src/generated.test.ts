import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { iconNameList } from '@var-ui/core';
import { describe, expect, it } from 'vite-plus/test';
import { defaultIcons } from './default-icons';
import { defaultGlyphInnerHtml } from './glyphs';
import * as index from './index';

/**
 * Everything except `src/glyph-data/*` is generated from it. When one of these fails, run
 * `vp run @var-ui/icons#generate` (and add the name to `iconNameList` in `@var-ui/core`).
 */
const FIX = 'run `vp run @var-ui/icons#generate`';
const src = fileURLToPath(new URL('.', import.meta.url));
const names = (dir: string, ext: string) =>
  readdirSync(join(src, dir))
    .filter((file) => file.endsWith(ext))
    .map((file) => file.slice(0, -ext.length))
    .sort();

const glyphs = names('glyph-data', '.ts');

describe('generated icon entries are up to date', () => {
  it('core names every glyph, and every name has a glyph', () => {
    expect([...iconNameList].sort(), 'iconNameList in @var-ui/core').toEqual(glyphs);
  });

  it('one React entry per glyph (src/icons)', () => {
    expect(names('icons', '.tsx'), FIX).toEqual(glyphs);
  });

  it('the glyphs barrel, defaultIcons and the index cover every glyph', () => {
    expect(Object.keys(defaultGlyphInnerHtml).sort(), FIX).toEqual(glyphs);
    expect(Object.keys(defaultIcons).sort(), FIX).toEqual(glyphs);
    for (const name of glyphs) expect(index, `${name}: ${FIX}`).toHaveProperty(name);
  });

  it('package.json exports both subpaths per glyph', () => {
    const pkg = JSON.parse(readFileSync(join(src, '../package.json'), 'utf8')) as {
      exports: Record<string, unknown>;
    };
    const subpaths = Object.keys(pkg.exports).filter((key) => key !== '.');
    const expected = [
      './brand',
      './glyphs',
      ...glyphs.flatMap((name) => [`./${name}`, `./glyphs/${name}`]),
    ].sort();
    expect(subpaths.sort(), FIX).toEqual(expected);
  });
});
