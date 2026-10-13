// @vitest-environment node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runTypestylesBuild } from '@typestyles/build-runner';
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
    expect(css).toContain('.var-ui-docs-hljs [data-codeblock] .hljs');
  });
});
