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
    // Skip rolldown chunk files (hash suffix): `foo-Bar123.mjs`.
    // Require a digit so kebab-case modules like `segmented-control.mjs` stay.
    if (/[-_](?=[A-Za-z0-9]*\d)[A-Za-z0-9]{6,}\.mjs$/.test(name)) continue;
    entries.push(rel.replace(/\.mjs$/, ''));
  }
  return entries.sort();
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

  for (const file of listMjsFiles(join(distDir, 'shared'))) {
    if (file === 'index') continue;
    addExport(exports, `./shared/${file}`, `shared/${file}`);
  }

  // Recipe-authoring helpers. They stay importable inside the package; they are not entry points.
  const internalComponentModules = new Set([
    'breakpoints',
    'controlFocus',
    'controlSize',
    'fieldChrome',
    'layoutShellVars',
  ]);

  for (const recipe of listMjsFiles(join(distDir, 'components'))) {
    // Components barrel is not a public subpath.
    if (recipe === 'index' || internalComponentModules.has(recipe)) continue;
    addExport(exports, `./components/${recipe}`, `components/${recipe}`);
  }

  // Reserved entries win over any component path with the same key.
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
    addExport(exports, `./components/${file}`, `components/${file}`);
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
