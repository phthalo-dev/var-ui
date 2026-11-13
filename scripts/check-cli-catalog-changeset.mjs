#!/usr/bin/env node
/**
 * Fail when a pending changeset changes the packages the CLI's docs catalog is
 * generated from, but no changeset is pending for @var-ui/cli itself.
 *
 * The CLI ships a docs catalog that is generated at build time from the docs
 * content and the @var-ui/* source. If @var-ui/core, react, icons or astro
 * release without the CLI, `npx @var-ui/cli` serves stale docs (issue #129),
 * so every catalog-affecting release must also release the CLI.
 *
 * Usage: node scripts/check-cli-catalog-changeset.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const changesetDir = join(repoRoot, '.changeset');

// Packages whose source the catalog is generated from.
const CATALOG_PACKAGES = new Set(['core', 'react', 'icons', 'astro']);

const pending = new Set();
for (const file of readdirSync(changesetDir)) {
  if (!file.endsWith('.md') || file === 'README.md') {
    continue;
  }
  const source = readFileSync(join(changesetDir, file), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontmatter) {
    continue;
  }
  for (const match of frontmatter.matchAll(/^[ \t]*'?@var-ui\/([\w-]+)'?[ \t]*:/gm)) {
    pending.add(match[1]);
  }
}

const touched = [...pending].filter((name) => CATALOG_PACKAGES.has(name));
if (touched.length === 0) {
  console.log('check-cli-catalog-changeset: no catalog-affecting changesets pending');
  process.exit(0);
}

if (pending.has('cli')) {
  console.log(`check-cli-catalog-changeset: OK (${touched.join(', ')} + cli pending)`);
  process.exit(0);
}

console.error(
  [
    'check-cli-catalog-changeset: pending changesets for @var-ui/{' + touched.join(', ') + '}',
    'but none for @var-ui/cli.',
    '',
    'The CLI ships a docs catalog generated from the @var-ui/* packages, so it must be',
    'republished whenever they change. Run `pnpm changeset` and add a "@var-ui/cli: patch"',
    'bump to your changeset (a summary line mentioning the catalog is helpful).',
  ].join('\n'),
);
process.exit(1);
