import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isValidElement } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { varUiFaviconSvg, varUiMarkInnerHtml, varUiMarkSvg } from './brand';
import { varUiMark } from './index';

const pkgRoot = fileURLToPath(new URL('..', import.meta.url));

describe('@var-ui/icons/brand', () => {
  it('publishes the brand strings as their own subpath', () => {
    const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8')) as {
      exports: Record<string, { import: string }>;
    };
    expect(pkg.exports['./brand']?.import).toBe('./dist/brand.mjs');
  });

  it('draws the glyph with currentColor and its own stroke', () => {
    expect(varUiMarkInnerHtml).toContain('stroke="currentColor"');
    expect(varUiMarkInnerHtml).toContain('stroke-width="1.5"');
    expect(varUiMarkSvg).toMatch(/^<svg viewBox="0 0 24 24"/);
    expect(isValidElement(varUiMark)).toBe(true);
  });

  it('builds a standalone favicon with literal colours', () => {
    const svg = varUiFaviconSvg({ background: '#123456', foreground: '#fff' });
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('fill="#123456"');
    expect(svg).toContain('color="#fff"');
    expect(svg).toContain(varUiMarkInnerHtml);
  });
});
