// @vitest-environment node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { runTypestylesBuild } from '@typestyles/build-runner';
import { codeBlock, designTokens } from '@var-ui/core';
import { describe, expect, it } from 'vite-plus/test';
import { CODE_BLOCK_ROOT_CLASS, codeHighlightRules } from './codeHighlight';

describe('hljs token rules (#335)', () => {
  it('scope to the core codeBlock root class', () => {
    expect(codeBlock().root.className.split(' ')).toContain(CODE_BLOCK_ROOT_CLASS);
  });

  it('colour keywords with the theme code token', () => {
    const keyword = Object.entries(codeHighlightRules).find(([selector]) =>
      selector.split(', ').includes(`.${CODE_BLOCK_ROOT_CLASS} .hljs-keyword`),
    );
    expect(keyword?.[1]).toEqual({ color: designTokens.color.code.keyword.var });
  });

  it('are extracted with @var-ui/docs/styles', async () => {
    const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
    const css = await runTypestylesBuild({ root: pkgRoot, modules: ['src/styles/index.ts'] });
    expect(css).toMatch(
      /\.var-ui-code-block \.hljs-keyword[^{]*\{[^}]*color:\s*var\(--var-ui-color-code-keyword/,
    );
  }, 30_000);
});
