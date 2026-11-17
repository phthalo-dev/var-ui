// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { buildDocsThemeStyles } from '../../../packages/docs/src/integrations/theme-css-extract';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('buildDocsThemeStyles', () => {
  it('writes lazy theme CSS without the base stylesheet font faces', async () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'var-docs-themes-'));
    tempDirs.push(outDir);

    await buildDocsThemeStyles({
      root: docsRoot,
      outDir,
      typestylesEntry: 'typestyles-entry.ts',
      presets: [
        {
          id: 'forest',
          label: 'Forest',
          className: 'theme-var-ui-forest',
          lazyCss: true,
          entry: 'typestyles-themes/forest.ts',
        },
      ],
    });

    const css = fs.readFileSync(path.join(outDir, 'forest.css'), 'utf8');
    expect(css).toContain('font-family: "Newsreader"');
    expect(css).toContain('.theme-var-ui-forest');
    expect(css).not.toContain('font-family: "JetBrains Mono"');
  }, 30_000);
});
