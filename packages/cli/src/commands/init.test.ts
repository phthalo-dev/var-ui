import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import type { Catalog, ComponentRecord, GuideRecord } from '../types';
import {
  AGENTS_END,
  AGENTS_START,
  applyAgentsBlock,
  initAgentsDocs,
  renderAgentsBlock,
} from './init';

function component(
  partial: Pick<ComponentRecord, 'slug' | 'name' | 'category' | 'description'>,
): ComponentRecord {
  return {
    importLine: `import { ${partial.name} } from '@var-ui/react';`,
    packages: ['react', 'core'],
    docsPath: `/components/${partial.slug}`,
    markdown: `# ${partial.name}\n`,
    examples: [],
    props: [],
    ...partial,
  };
}

function guide(partial: Pick<GuideRecord, 'id' | 'title' | 'description'>): GuideRecord {
  return {
    docsPath: `/docs/${partial.id}`,
    markdown: `# ${partial.title}\n`,
    ...partial,
  };
}

function miniCatalog(): Catalog {
  return {
    version: '0.1.0',
    components: [
      component({
        slug: 'button',
        name: 'Button',
        category: 'action',
        description: 'Triggers an action or event.',
      }),
      component({
        slug: 'banner',
        name: 'Banner',
        category: 'feedback',
        description: 'Highlights a message',
      }),
    ],
    guides: [
      guide({
        id: 'getting-started',
        title: 'Getting started',
        description: 'Install var-ui',
      }),
    ],
  };
}

const temps: string[] = [];

function tmpDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'var-ui-init-'));
  temps.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of temps.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('renderAgentsBlock', () => {
  it('includes markers, static copy, and Button (`button`) in registry order', () => {
    const block = renderAgentsBlock(miniCatalog());
    expect(block.startsWith(AGENTS_START)).toBe(true);
    expect(block.endsWith(AGENTS_END)).toBe(true);
    expect(block).toContain('# Var UI');
    expect(block).toContain(
      'Prefer `@var-ui/react` components and `@var-ui/core` tokens. Do not invent raw `<div>` chrome or magic hex colors.',
    );
    expect(block).toContain(
      'Install `@var-ui/react`, `@var-ui/core`, and optionally `@var-ui/icons`. Peers: `react`, `react-dom`, `react-aria-components`, `react-aria` (one copy, the version `react-aria-components` uses). Import `@var-ui/core/styles.css` once in the app. Do not add `typestyles` or `@typestyles/vite` unless extracting custom CSS.',
    );
    expect(block).not.toContain('Vite plugin `@typestyles/vite`');
    expect(block).toContain(
      'CLI: `npx @var-ui/cli component <Name>`, `npx @var-ui/cli search <query>`, `npx @var-ui/cli tokens <query>` (CSS variable names), `npx @var-ui/cli docs getting-started`. Bare `npx var-ui` is unreliable.',
    );
    expect(block).toContain('Button (`button`)');
    expect(block).toContain('- Button (`button`) — Triggers an action or event.');
    expect(block).toContain('- Banner (`banner`) — Highlights a message');
    expect(block.indexOf('- Button (`button`)')).toBeLessThan(block.indexOf('- Banner (`banner`)'));
  });
});

describe('applyAgentsBlock', () => {
  const block = `${AGENTS_START}\nnew\n${AGENTS_END}`;

  it('returns the block for null or empty existing content', () => {
    expect(applyAgentsBlock(null, block)).toBe(block);
    expect(applyAgentsBlock('', block)).toBe(block);
  });

  it('replaces an existing marked range', () => {
    const existing = `header\n${AGENTS_START}\nold\n${AGENTS_END}\nfooter`;
    expect(applyAgentsBlock(existing, block)).toBe(`header\n${block}\nfooter`);
  });

  it('appends after a blank line when markers are missing', () => {
    expect(applyAgentsBlock('keep me', block)).toBe(`keep me\n\n${block}`);
  });

  it('throws when only one marker is present', () => {
    expect(() => applyAgentsBlock(`${AGENTS_START}\norphan`, block)).toThrow(
      /incomplete var-ui agents block/i,
    );
    expect(() => applyAgentsBlock(`keep\n${AGENTS_END}`, block)).toThrow(
      /incomplete var-ui agents block/i,
    );
  });
});

describe('initAgentsDocs', () => {
  const catalog = miniCatalog();

  it('creates AGENTS.md when missing', () => {
    const cwd = tmpDir();
    initAgentsDocs(cwd, catalog);
    const written = fs.readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8');
    expect(written).toBe(renderAgentsBlock(catalog));
  });

  it('does not duplicate markers on a second run', () => {
    const cwd = tmpDir();
    initAgentsDocs(cwd, catalog);
    initAgentsDocs(cwd, catalog);
    const written = fs.readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8');
    expect(written.split(AGENTS_START)).toHaveLength(2);
    expect(written.split(AGENTS_END)).toHaveLength(2);
    expect(written).toBe(renderAgentsBlock(catalog));
  });

  it('appends the block to an existing file without markers', () => {
    const cwd = tmpDir();
    const agentsPath = path.join(cwd, 'AGENTS.md');
    fs.writeFileSync(agentsPath, '# Existing\n', 'utf8');
    initAgentsDocs(cwd, catalog);
    const written = fs.readFileSync(agentsPath, 'utf8');
    expect(written.startsWith('# Existing\n\n')).toBe(true);
    expect(written.endsWith(renderAgentsBlock(catalog))).toBe(true);
  });

  it('updates CLAUDE.md only when it is already present', () => {
    const withoutClaude = tmpDir();
    initAgentsDocs(withoutClaude, catalog);
    expect(fs.existsSync(path.join(withoutClaude, 'CLAUDE.md'))).toBe(false);

    const withClaude = tmpDir();
    fs.writeFileSync(path.join(withClaude, 'CLAUDE.md'), '# Claude\n', 'utf8');
    initAgentsDocs(withClaude, catalog);
    const claude = fs.readFileSync(path.join(withClaude, 'CLAUDE.md'), 'utf8');
    expect(claude.startsWith('# Claude\n\n')).toBe(true);
    expect(claude).toContain(AGENTS_START);
    expect(fs.existsSync(path.join(withClaude, 'AGENTS.md'))).toBe(true);
  });

  it('rethrows the node:fs error when write fails', () => {
    const cwd = path.join(os.tmpdir(), `var-ui-init-missing-${process.pid}-${Date.now()}`);
    let thrown: unknown;
    try {
      initAgentsDocs(cwd, catalog);
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toMatchObject({ code: 'ENOENT' });
    expect(String(thrown)).toContain(path.join(cwd, 'AGENTS.md'));
  });
});
