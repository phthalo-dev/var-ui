import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vite-plus/test';
import { extractAllStylingHooks } from './extract-styling-hooks';

/**
 * Contract for people who write plain CSS: every `data-*` attribute the React and Astro sources
 * (and the shared core markup) put on the DOM is either documented or internal.
 *
 * - Documented: it appears in a component's generated "Styling hooks" table (a recipe variant
 *   axis or a state attribute the recipe's CSS selects on), or in the Plain CSS guide.
 * - Internal: it starts with `data-var-ui-` (Astro client-script wiring and config).
 *
 * There is no allowlist. A new attribute has to be styled by a recipe, written up in the Plain CSS
 * guide, or prefixed `data-var-ui-`.
 */

const repoRoot = resolve(import.meta.dirname, '../../..');
const INTERNAL_PREFIX = 'data-var-ui-';

function sourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      // `src/test/` holds test infrastructure, not shipped markup.
      if (entry !== 'test') files.push(...sourceFiles(path));
    } else if (/\.(tsx?|astro)$/.test(entry) && !/\.(test|type-test)\./.test(entry)) {
      files.push(path);
    }
  }
  return files;
}

/** Drop comments so prose such as "data-driven columns" is not read as an attribute. */
function stripComments(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');
}

/** Attribute name -> files that mention it. */
function mentionedAttributes(): Map<string, string[]> {
  const files = [
    ...sourceFiles(join(repoRoot, 'packages/react/src')),
    ...sourceFiles(join(repoRoot, 'packages/astro/src')),
    // Core modules that build markup both bindings render.
    join(repoRoot, 'packages/core/src/components/codeBlockMarkup.ts'),
  ];
  const found = new Map<string, string[]>();
  for (const file of files) {
    const text = stripComments(readFileSync(file, 'utf8'));
    for (const match of text.matchAll(/(?<![A-Za-z0-9_-])data-[a-z][a-z0-9-]*/g)) {
      // A trailing hyphen is a template-literal prefix (`data-var-ui-top-nav-${zone}`).
      if (match[0].endsWith('-')) continue;
      const list = found.get(match[0]) ?? [];
      const rel = file.slice(repoRoot.length + 1);
      if (!list.includes(rel)) list.push(rel);
      found.set(match[0], list);
    }
  }
  return found;
}

/** `data-*` attributes written in code spans in the Plain CSS guide. */
function guideAttributes(): Set<string> {
  const guide = readFileSync(join(repoRoot, 'docs/content/theming/plain-css.mdx'), 'utf8');
  const names = new Set<string>();
  for (const span of guide.matchAll(/`([^`\n]+)`/g)) {
    for (const match of span[1]!.matchAll(/data-[a-z][a-z0-9-]*/g)) names.add(match[0]);
  }
  return names;
}

let documented: Set<string>;
const mentioned = mentionedAttributes();

beforeAll(async () => {
  documented = guideAttributes();
  for (const doc of Object.values(await extractAllStylingHooks())) {
    for (const axis of doc.axes) documented.add(axis.attribute);
    for (const state of doc.states) documented.add(state.attribute);
  }
}, 60_000);

describe('data-* attribute contract (React + Astro sources, shared core markup)', () => {
  it('every attribute is documented or prefixed data-var-ui-', () => {
    const undocumented = [...mentioned]
      .filter(([name]) => !name.startsWith(INTERNAL_PREFIX) && !documented.has(name))
      .map(([name, files]) => `${name}  (${files.join(', ')})`)
      .sort();
    expect(
      undocumented,
      'style it in a recipe, document it in theming/plain-css.mdx, or prefix it data-var-ui-',
    ).toEqual([]);
  });

  it('does not emit retired alert hooks', () => {
    for (const name of [
      'data-alert',
      'data-alert-tone',
      'data-alert-appearance',
      'data-alert-icon',
      'data-alert-content',
    ]) {
      expect(mentioned.has(name), name).toBe(false);
    }
  });
});
