import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { formatComponent } from '../commands/component';
import { buildCatalog, defaultRepoPaths, findRepoRoot } from './build-catalog';

describe('catalog completeness', () => {
  it('every registry slug has MDX and every Demo id has snippets', async () => {
    const repoRoot = findRepoRoot(process.cwd());
    const { version } = JSON.parse(
      readFileSync(join(repoRoot, 'packages/cli/package.json'), 'utf8'),
    ) as {
      version: string;
    };
    const catalog = await buildCatalog(defaultRepoPaths(repoRoot), version);
    expect(catalog.components.length).toBeGreaterThan(50);
    expect(catalog.guides.some((guide) => guide.id === 'getting-started')).toBe(true);

    const guideIds = catalog.guides.map((guide) => guide.id);
    expect(new Set(guideIds).size).toBe(guideIds.length);
    expect(guideIds).toContain('docs/index');
    expect(guideIds).toContain('theming/index');
    expect(guideIds).not.toContain('index');

    const button = catalog.components.find((record) => record.slug === 'button');
    expect(button).toBeDefined();
    expect(button!.props.length).toBeGreaterThan(0);
    expect(button!.props.some((prop) => prop.name === 'tone')).toBe(true);
    expect(button!.markdown).toContain('| Name | Type |');
    expect(button!.markdown).toContain('| tone |');

    const formatted = formatComponent(button!, false);
    expect(formatted.startsWith("# Button\n\nimport { Button } from '@var-ui/react';\n\n")).toBe(
      true,
    );
    expect(formatted).toContain('| tone |');
    expect(formatted).toContain(
      "```tsx\nimport { Button } from '@var-ui/react';\n\n<Button>Click me</Button>\n```",
    );
  }, 120_000);
});
