import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { AGENTS_END, AGENTS_START } from './commands/init';
import { runCli, type CliIo } from './run-cli';
import type { Catalog } from './types';

const catalog = JSON.parse(
  fs.readFileSync(fileURLToPath(new URL('./__fixtures__/catalog.json', import.meta.url)), 'utf8'),
) as Catalog;

const temps: string[] = [];

function tmpDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'var-ui-cli-'));
  temps.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of temps.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

function capture() {
  let stdout = '';
  let stderr = '';
  let exitCode: number | undefined;
  const io: CliIo = {
    stdout: {
      write(chunk: string) {
        stdout += chunk;
      },
    },
    stderr: {
      write(chunk: string) {
        stderr += chunk;
      },
    },
    exit(code: number) {
      exitCode = code;
    },
  };
  return {
    io,
    get stdout() {
      return stdout;
    },
    get stderr() {
      return stderr;
    },
    get exitCode() {
      return exitCode;
    },
  };
}

function run(argv: string[], cwd?: string) {
  const cap = capture();
  runCli(argv, cap.io, { catalog, cwd });
  return cap;
}

describe('runCli', () => {
  it('prints help and exits 0', () => {
    const cap = run([]);
    expect(cap.exitCode).toBe(0);
    expect(cap.stdout).toContain('init');
    expect(cap.stdout).toContain('component');
    expect(cap.stdout).toContain('search');
    expect(cap.stdout).toContain('docs');
    expect(cap.stdout).toContain('--json');
    expect(cap.stdout).toContain('--list');
  });

  it('prints unknown command plus help on stderr and exits 1', () => {
    const cap = run(['nope']);
    expect(cap.exitCode).toBe(1);
    expect(cap.stderr).toContain('Unknown command.');
    expect(cap.stderr).toContain('init');
    expect(cap.stderr).toContain('component');
  });

  it('lists components including Button with a human category', () => {
    const cap = run(['component', '--list']);
    expect(cap.exitCode).toBe(0);
    expect(cap.stdout).toContain('Button');
    expect(cap.stdout).toContain('Button\tbutton\tAction\tTriggers an action or event.');
    expect(cap.stdout).toContain('Banner\tbanner\tFeedback\tHighlights a message');
  });

  it('prints Button for component Button and component button', () => {
    for (const query of ['Button', 'button']) {
      const cap = run(['component', query]);
      expect(cap.exitCode).toBe(0);
      expect(cap.stdout).toContain('# Button');
      expect(cap.stdout).toContain("import { Button } from '@var-ui/react';");
      expect(cap.stdout).toContain('<Button>Click me</Button>');
      expect(cap.stdout.split('<Button>Click me</Button>')).toHaveLength(2);
    }
  });

  it('prints a single H1 when component markdown already starts with # after whitespace', () => {
    const padded: Catalog = {
      ...catalog,
      components: catalog.components.map((record) =>
        record.slug === 'button' ? { ...record, markdown: '\n\n# Button\n\nbody' } : record,
      ),
    };
    const cap = capture();
    runCli(['component', 'Button'], cap.io, { catalog: padded });
    expect(cap.exitCode).toBe(0);
    expect(cap.stdout.match(/# Button/g)).toEqual(['# Button']);
    expect(cap.stdout).toContain('body');
  });

  it('trims the component query before lookup', () => {
    const cap = run(['component', '  Button  ']);
    expect(cap.exitCode).toBe(0);
    expect(cap.stdout).toContain("import { Button } from '@var-ui/react';");
  });

  it('prints the unknown component message and exits 1', () => {
    const cap = run(['component', 'Foo']);
    expect(cap.exitCode).toBe(1);
    expect(cap.stderr).toBe('Unknown component "Foo". Run `var-ui component --list`.\n');
  });

  it('treats a missing or whitespace component query as unknown ""', () => {
    const missing = run(['component']);
    expect(missing.exitCode).toBe(1);
    expect(missing.stderr).toBe('Unknown component "". Run `var-ui component --list`.\n');

    const blank = run(['component', '   ']);
    expect(blank.exitCode).toBe(1);
    expect(blank.stderr).toBe('Unknown component "". Run `var-ui component --list`.\n');
  });

  it('prints parseable JSON with slug for component --json', () => {
    const cap = run(['component', 'Button', '--json']);
    expect(cap.exitCode).toBe(0);
    const parsed = JSON.parse(cap.stdout) as { slug: string; name: string };
    expect(parsed.slug).toBe('button');
    expect(parsed.name).toBe('Button');
  });

  it('prints a ranked search hit for button', () => {
    const cap = run(['search', 'button']);
    expect(cap.exitCode).toBe(0);
    expect(cap.stdout).toContain('component Button (button)');
  });

  it('rejects an empty search query', () => {
    const cap = run(['search']);
    expect(cap.exitCode).toBe(1);
    expect(cap.stderr).toContain('search requires a query');
  });

  it('prints the getting-started guide for docs getting-started', () => {
    const cap = run(['docs', 'getting-started']);
    expect(cap.exitCode).toBe(0);
    expect(cap.stdout).toContain('Getting started');
    expect(cap.stdout).toContain('Install var-ui.');
  });

  it('writes AGENTS.md markers for init in a temp cwd', () => {
    const cwd = tmpDir();
    const cap = run(['init'], cwd);
    expect(cap.exitCode).toBe(0);
    expect(cap.stdout).toContain('Wrote Var UI agent docs.');
    const written = fs.readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8');
    expect(written).toContain(AGENTS_START);
    expect(written).toContain(AGENTS_END);
    expect(written).toContain('Button (`button`)');
  });

  it('warns on stderr when the catalog predates the installed @var-ui/react', () => {
    const project = tmpDir();
    const pkgDir = path.join(project, 'node_modules', '@var-ui', 'react');
    fs.mkdirSync(pkgDir, { recursive: true });
    fs.writeFileSync(
      path.join(pkgDir, 'package.json'),
      JSON.stringify({ name: '@var-ui/react', version: '9.9.9' }),
    );
    const stale: Catalog = {
      ...catalog,
      meta: {
        generatedAt: '2026-11-13T00:00:00.000Z',
        packages: { react: '0.10.0', core: '0.10.0', icons: '0.10.0', astro: '0.10.0' },
      },
    };
    const cap = capture();
    runCli(['component', 'Button'], cap.io, { catalog: stale, cwd: project });
    expect(cap.exitCode).toBe(0);
    expect(cap.stderr).toContain('warning: this @var-ui/cli catalog was generated against');
    // stdout stays clean for --json consumers.
    expect(cap.stdout).toContain('# Button');
  });

  it('does not warn when catalog and installed versions match', () => {
    const project = tmpDir();
    const pkgDir = path.join(project, 'node_modules', '@var-ui', 'react');
    fs.mkdirSync(pkgDir, { recursive: true });
    fs.writeFileSync(
      path.join(pkgDir, 'package.json'),
      JSON.stringify({ name: '@var-ui/react', version: '0.10.0' }),
    );
    const fresh: Catalog = {
      ...catalog,
      meta: {
        generatedAt: '2026-11-13T00:00:00.000Z',
        packages: { react: '0.10.0', core: '0.10.0', icons: '0.10.0', astro: '0.10.0' },
      },
    };
    const cap = capture();
    runCli(['component', 'Button'], cap.io, { catalog: fresh, cwd: project });
    expect(cap.exitCode).toBe(0);
    expect(cap.stderr).toBe('');
  });
});
