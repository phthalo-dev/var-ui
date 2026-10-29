#!/usr/bin/env node
/**
 * Assert every emitted JS file in packages/react/dist (and packages/icons/dist)
 * starts with the 'use client' directive, so the packages work when imported
 * from Next.js app-router server components.
 *
 * Usage: node scripts/check-use-client.mjs [distDir ...]
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const dirs = args.length ? args : [join(root, 'packages/react/dist')];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) out.push(...walk(p));
    else if (/\.(mjs|js|cjs)$/.test(name.name)) out.push(p);
  }
  return out;
}

const DIRECTIVE = /^(['"])use client\1;?\s*(\r?\n|$)/;
let bad = 0;
let total = 0;
for (const dir of dirs) {
  if (!existsSync(dir)) {
    console.error(`check-use-client: ${dir} not found (build first)`);
    process.exit(1);
  }
  for (const file of walk(dir)) {
    total++;
    if (!DIRECTIVE.test(readFileSync(file, 'utf8'))) {
      bad++;
      console.error(`missing 'use client': ${relative(root, file)}`);
    }
  }
}
if (total === 0) {
  console.error('check-use-client: no JS files found');
  process.exit(1);
}
if (bad) process.exit(1);
console.log(`check-use-client: ${total} files OK`);
