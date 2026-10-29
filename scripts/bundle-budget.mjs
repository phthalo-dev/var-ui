#!/usr/bin/env node
/**
 * Assert bundle-size budgets for var-ui consumer fixture apps.
 *
 * Usage:
 *   node scripts/bundle-budget.mjs            # check against baselines.json
 *   node scripts/bundle-budget.mjs --update   # refresh baselines from current dist/
 */
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const updateBaselines = process.argv.includes('--update');

/** @type {Record<string, { path: string; mode?: 'regression' | 'target'; jsMaxKb?: number; cssMaxKb?: number; cssMinKb?: number }>} */
const FIXTURES = {
  'button-only': {
    path: 'examples/bundle-fixtures/button-only',
    mode: 'regression',
    jsMaxKb: 600,
    cssMaxKb: 250,
    cssMinKb: 100,
  },
  'form-kit': {
    path: 'examples/bundle-fixtures/form-kit',
    mode: 'regression',
    jsMaxKb: 800,
    cssMaxKb: 250,
    cssMinKb: 100,
  },
  'date-kit': {
    path: 'examples/bundle-fixtures/date-kit',
    mode: 'regression',
    jsMaxKb: 900,
    cssMaxKb: 250,
    cssMinKb: 100,
  },
  gallery: {
    path: 'examples/vite-app',
    mode: 'regression',
    jsMaxKb: 2000,
    cssMaxKb: 600,
    cssMinKb: 250,
  },
};

const REGRESSION_TOLERANCE = 0.05;
const BASELINES_PATH = join(root, 'examples/bundle-fixtures/baselines.json');

const REQUIRED_CSS = ['.var-ui-button', 'theme-var-ui-default'];

/** Recipes that should not ship in minimal fixtures (tree-shaking signal). */
const FORBIDDEN_JS_MARKERS = {
  'button-only': ['var-ui-calendar', 'var-ui-command-palette', 'var-ui-file-tree'],
};

/** CSS that must not appear in minimal fixtures: unused components cost no CSS. */
const FORBIDDEN_CSS_MARKERS = {
  'button-only': ['.var-ui-calendar', '.var-ui-command-palette', '.var-ui-file-tree'],
  'form-kit': ['.var-ui-calendar', '.var-ui-command-palette', '.var-ui-file-tree'],
  'date-kit': ['.var-ui-command-palette', '.var-ui-file-tree'],
};

function readDirFiles(dir, ext) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(ext))
    .map((name) => join(dir, name));
}

function collectJsFiles(distDir) {
  const files = [];
  const assetsDir = join(distDir, 'assets');
  files.push(...readDirFiles(distDir, '.js'));
  files.push(...readDirFiles(assetsDir, '.js'));
  return [...new Set(files)];
}

function isRuntimeInjectionDisabled(jsSource) {
  if (jsSource.includes('TYPESTYLES_RUNTIME_DISABLED')) return true;
  // Minified guard: `var <id>=!0` where !0 is true → injection skipped via `if(<id>||`
  // Fully constant-folded form: with `__TYPESTYLES_RUNTIME_DISABLED__` defined, the bundler drops
  // the flag itself and the flush function only forwards pending rules to the SSR buffer (no DOM
  // injection). This is what small bundles look like once unused recipes are tree-shaken.
  if (/\.pendingRules=\[\],\w+\.ssrBuffer&&\w+\.ssrBuffer\.push\(\.\.\.\w+\)\}/.test(jsSource)) {
    return true;
  }
  for (const match of jsSource.matchAll(/var ([a-zA-Z_$][\w$]*)=!0/g)) {
    const flag = match[1];
    if (jsSource.includes(`if(${flag}||`)) return true;
  }
  return false;
}

function measureFixture(name, config) {
  const distDir = join(root, config.path, 'dist');
  if (!existsSync(distDir)) {
    throw new Error(`[${name}] Missing dist at ${distDir}. Run bundle fixture builds first.`);
  }

  const jsFiles = collectJsFiles(distDir);
  if (jsFiles.length === 0) {
    throw new Error(`[${name}] No JS output in ${distDir}`);
  }

  let jsBytes = 0;
  let jsSource = '';
  for (const file of jsFiles) {
    const buf = readFileSync(file);
    jsBytes += buf.length;
    jsSource += buf.toString('utf8');
  }

  const cssPath = join(distDir, 'typestyles.css');
  if (!existsSync(cssPath)) {
    throw new Error(`[${name}] Missing ${cssPath}. Is @typestyles/vite configured?`);
  }
  const cssBuf = readFileSync(cssPath);
  const cssBytes = cssBuf.length;
  const cssSource = cssBuf.toString('utf8');

  for (const needle of REQUIRED_CSS) {
    if (!cssSource.includes(needle)) {
      throw new Error(`[${name}] typestyles.css missing required substring: ${needle}`);
    }
  }

  for (const marker of FORBIDDEN_CSS_MARKERS[name] ?? []) {
    if (cssSource.includes(marker)) {
      throw new Error(`[${name}] typestyles.css includes unexpected recipe marker "${marker}"`);
    }
  }

  if (!isRuntimeInjectionDisabled(jsSource)) {
    throw new Error(
      `[${name}] TypeStyles runtime CSS injection does not appear disabled in JS bundle`,
    );
  }

  const forbidden = FORBIDDEN_JS_MARKERS[name];
  if (forbidden) {
    for (const marker of forbidden) {
      if (jsSource.includes(marker)) {
        throw new Error(`[${name}] JS bundle includes unexpected recipe marker "${marker}"`);
      }
    }
  }

  return {
    jsKb: Math.round((jsBytes / 1024) * 10) / 10,
    cssKb: Math.round((cssBytes / 1024) * 10) / 10,
    jsFiles: jsFiles.map((f) => f.replace(root + '/', '')),
  };
}

async function main() {
  /** @type {Record<string, { jsKb: number; cssKb: number; jsFiles?: string[] }>} */
  const measured = {};

  for (const [name, config] of Object.entries(FIXTURES)) {
    const result = measureFixture(name, config);
    measured[name] = result;

    if (config.jsMaxKb != null && result.jsKb > config.jsMaxKb) {
      throw new Error(`[${name}] JS ${result.jsKb} KB exceeds hard ceiling ${config.jsMaxKb} KB`);
    }
    if (config.cssMaxKb != null && result.cssKb > config.cssMaxKb) {
      throw new Error(
        `[${name}] CSS ${result.cssKb} KB exceeds hard ceiling ${config.cssMaxKb} KB`,
      );
    }
    if (config.cssMinKb != null && result.cssKb < config.cssMinKb) {
      throw new Error(
        `[${name}] CSS ${result.cssKb} KB below minimum ${config.cssMinKb} KB — extraction may have dropped styles`,
      );
    }
  }

  if (updateBaselines) {
    const baselines = Object.fromEntries(
      Object.entries(measured).map(([name, m]) => [name, { jsKb: m.jsKb, cssKb: m.cssKb }]),
    );
    writeFileSync(BASELINES_PATH, JSON.stringify(baselines, null, 2) + '\n');
    console.log(`Updated ${BASELINES_PATH}`);
    for (const [name, m] of Object.entries(measured)) {
      console.log(`  ${name}: ${m.jsKb} KB JS, ${m.cssKb} KB CSS`);
    }
    return;
  }

  if (!existsSync(BASELINES_PATH)) {
    throw new Error(`Missing ${BASELINES_PATH}. Run: node scripts/bundle-budget.mjs --update`);
  }

  const baselines = JSON.parse(readFileSync(BASELINES_PATH, 'utf8'));
  const failures = [];

  for (const [name, current] of Object.entries(measured)) {
    const baseline = baselines[name];
    if (!baseline) {
      failures.push(`[${name}] no baseline entry — run --update`);
      continue;
    }

    const jsLimit = baseline.jsKb * (1 + REGRESSION_TOLERANCE);
    const cssLimit = baseline.cssKb * (1 + REGRESSION_TOLERANCE);

    if (current.jsKb > jsLimit) {
      failures.push(
        `[${name}] JS regressed: ${current.jsKb} KB > ${jsLimit.toFixed(1)} KB (baseline ${baseline.jsKb} KB + ${REGRESSION_TOLERANCE * 100}%)`,
      );
    }
    if (current.cssKb > cssLimit) {
      failures.push(
        `[${name}] CSS regressed: ${current.cssKb} KB > ${cssLimit.toFixed(1)} KB (baseline ${baseline.cssKb} KB + ${REGRESSION_TOLERANCE * 100}%)`,
      );
    }

    console.log(
      `✓ ${name}: ${current.jsKb} KB JS, ${current.cssKb} KB CSS (baseline ${baseline.jsKb}/${baseline.cssKb} KB)`,
    );
  }

  if (failures.length > 0) {
    console.error('\nBundle budget failures:\n' + failures.map((f) => `  ${f}`).join('\n'));
    process.exit(1);
  }

  console.log('\nAll bundle budgets passed.');
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
