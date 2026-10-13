#!/usr/bin/env node
/**
 * Generate package.json export maps for unbundled @var-ui/core and @var-ui/react dist.
 *
 * Usage: node scripts/generate-subpath-exports.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { coreReservedExports } from './core-reserved-exports.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** @returns {string[]} paths relative to `dir` without `.mjs` (e.g. `button`, `chat/chatComposer`). */
function listMjsFiles(dir, relativeDir = '') {
  if (!existsSync(dir)) return [];
  const entries = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const rel = relativeDir ? `${relativeDir}/${name}` : name;
    const stat = statSync(path);
    if (stat.isDirectory()) {
      entries.push(...listMjsFiles(path, rel));
      continue;
    }
    if (!name.endsWith('.mjs')) continue;
    // Skip rolldown chunk files (hash suffix): `foo-Bar123.mjs`
    if (/[-_][A-Za-z0-9]{6,}\.mjs$/.test(name)) continue;
    entries.push(rel.replace(/\.mjs$/, ''));
  }
  return entries.sort();
}

function pascalToKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function addExport(exports, key, distRel) {
  if (exports[key]) return;
  exports[key] = {
    types: `./dist/${distRel}.d.mts`,
    import: `./dist/${distRel}.mjs`,
  };
}

function generateCoreExports() {
  const pkgPath = join(root, 'packages/core/package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const distDir = join(root, 'packages/core/dist');
  const exports = { ...coreReservedExports() };

  for (const recipe of listMjsFiles(join(distDir, 'components'))) {
    // Components barrel is not a public subpath.
    if (recipe === 'index') continue;
    const distRel = `components/${recipe}`;
    addExport(exports, `./components/${recipe}`, distRel);
    // `./styles` is reserved for the typestyles extraction entry (`src/styles.ts`).
    if (recipe !== 'styles') {
      addExport(exports, `./${recipe}`, distRel);
    }
  }

  // Re-apply reserved entry points so recipe short names cannot shadow them.
  Object.assign(exports, coreReservedExports());

  pkg.exports = exports;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`Updated core exports (${Object.keys(exports).length} subpaths)`);
}

function generateReactExports() {
  const pkgPath = join(root, 'packages/react/package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const componentsDir = join(root, 'packages/react/dist/components');
  const exports = {
    '.': { types: './dist/index.d.mts', import: './dist/index.mjs' },
  };

  const skip = new Set(['utils', 'index']);

  for (const file of listMjsFiles(componentsDir)) {
    const parts = file.split('/');
    const base = parts.at(-1);
    if (!base || skip.has(base)) continue;
    const distRel = `components/${file}`;
    addExport(exports, `./components/${file}`, distRel);
    addExport(exports, `./${pascalToKebab(base)}`, distRel);
    addExport(exports, `./${base}`, distRel);
  }

  pkg.exports = exports;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`Updated react exports (${Object.keys(exports).length} subpaths)`);
}

const targets = process.argv.slice(2);
const runCore = targets.length === 0 || targets.includes('core');
const runReact = targets.length === 0 || targets.includes('react');

if (runCore) generateCoreExports();
if (runReact) generateReactExports();
