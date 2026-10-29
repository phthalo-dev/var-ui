#!/usr/bin/env node
/**
 * Generate the @var-ui/core package.json export map from its unbundled dist.
 * @var-ui/react gets an explicit `./components/<Name>` list: only modules re-exported by
 * `packages/react/src/components/index.ts` (and `chat/index.ts`), so helper files such as
 * `menuContent` or `racClassName` are not publicly addressable.
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
  const internalComponentModules = new Set(['controlSize', 'fieldChrome', 'focusRing']);

  for (const recipe of listMjsFiles(join(distDir, 'components'))) {
    // Components barrel is not a public subpath.
    if (recipe === 'index' || internalComponentModules.has(recipe)) continue;
    addExport(exports, `./components/${recipe}`, `components/${recipe}`);
  }

  // Non-recipe runtime helpers that components import directly (so they never need the barrel,
  // which registers every recipe). Keys mirror the source path so tsconfig `paths` resolve them.
  for (const helper of ['tokens/declare', 'icons/iconNames']) {
    addExport(exports, `./${helper}`, helper);
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
  const srcDir = join(root, 'packages/react/src/components');
  const exports = {
    '.': { types: './dist/index.d.mts', import: './dist/index.mjs' },
  };

  /** Component modules named in a barrel (`from './Button'`), keyed by path prefix. */
  const fromBarrel = (barrel, prefix) => {
    const text = readFileSync(barrel, 'utf8');
    const names = new Set();
    for (const m of text.matchAll(/from '\.\/([A-Z][A-Za-z0-9]*)'/g)) names.add(m[1]);
    return [...names].sort().map((n) => `${prefix}${n}`);
  };

  const modules = [
    ...fromBarrel(join(srcDir, 'index.ts'), ''),
    ...fromBarrel(join(srcDir, 'chat/index.ts'), 'chat/'),
  ];
  for (const mod of modules) {
    if (!existsSync(join(srcDir, `${mod}.tsx`)) && !existsSync(join(srcDir, `${mod}.ts`))) continue;
    addExport(exports, `./components/${mod}`, `components/${mod}`);
  }

  pkg.exports = exports;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`Updated react exports (${Object.keys(exports).length} subpaths)`);
}

const targets = process.argv.slice(2);
if (targets.length === 0 || targets.includes('core')) generateCoreExports();
if (targets.length === 0 || targets.includes('react')) generateReactExports();
