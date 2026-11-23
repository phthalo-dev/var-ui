// @vitest-environment node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runTypestylesBuild } from '@typestyles/build-runner';
import { extractFontFaces, extractThemeOnlyCss } from '@var-ui/docs/utils';
import { describe, expect, it } from 'vite-plus/test';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('typestyles extraction', () => {
  it('includes document base styles in the production CSS', async () => {
    const css = await runTypestylesBuild({
      root: docsRoot,
      modules: ['typestyles-entry.ts'],
    });

    expect(css).toContain('scroll-behavior: smooth');
    expect(css).toContain('box-sizing: border-box');
    expect(css).toMatch(/body\s*\{[^}]*margin:\s*0/);
    expect(css).toContain(
      '@property --var-ui-fontFamily-body { syntax: "*"; inherits: true; initial-value: none;',
    );
    expect(css).toContain('.var-ui-docs-top-nav');
    expect(css).toContain('[data-var-ui-mobile-nav-toggle]');
    expect(css).toContain('.var-ui-docs-hljs .var-ui-code-block .hljs');
  });

  it('omits base @font-face rules from lazy theme CSS', async () => {
    const [baseCss, forestCss] = await Promise.all([
      runTypestylesBuild({ root: docsRoot, modules: ['typestyles-entry.ts'] }),
      runTypestylesBuild({ root: docsRoot, modules: ['typestyles-themes/forest.ts'] }),
    ]);
    const baseFontFaces = extractFontFaces(baseCss);

    expect(baseFontFaces.length).toBeGreaterThan(0);
    expect(baseCss).toContain('font-family: "JetBrains Mono"');
    expect(forestCss).toContain('font-family: "JetBrains Mono"');

    const lazyCss = extractThemeOnlyCss(forestCss, 'forest', { baseFontFaces });
    expect(lazyCss).not.toContain('font-family: "JetBrains Mono"');
    expect(lazyCss).toContain('font-family: "Newsreader"');
    expect(lazyCss).toContain('.theme-var-ui-forest');
  });
});
