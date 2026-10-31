// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

/**
 * Grep gates (P6 design C2): overlays are native `<dialog>` / `[popover]` elements rendered in
 * place. The things the old react-aria portal/layer stack needed must not come back.
 *
 * Scanned: every non-test source file of `packages/react/src` (tests, `*.browser.test.*` and the
 * `src/test/` harness are skipped, they may assert on the absence of these names).
 */

const here = dirname(fileURLToPath(import.meta.url));
const reactSrc = here;
const astroSrc = join(here, '../../astro/src');

/**
 * Allowlist 1, the one react-aria adapter. `internal/NativePopover.tsx` is the only file that may
 * read RAC overlay contexts and import RAC overlay components (it re-exports `DialogTrigger` as
 * `NativePopoverTrigger` for the one popup, `ColorInput`, whose trigger is not a RAC field). It
 * also names `portalContainer` once, to portal popup content into its own `[popover]` shell via
 * react-aria's `Overlay`, and mentions `UNSTABLE_portalContainer` in a comment describing what it
 * replaces. Nothing else is allowlisted.
 */
const ADAPTER = 'internal/NativePopover.tsx';

/** Components of 'react-aria-components' that render overlays; only the adapter may import them. */
const BANNED_RAC_IMPORTS = [
  'Popover',
  'Modal',
  'ModalOverlay',
  'Tooltip',
  'TooltipTrigger',
  'DialogTrigger',
  'OverlayArrow',
];

/**
 * Allowlist 2: names banned everywhere in React source (outside the adapter for the portal ones).
 * `z-index`/`zIndex`: the top layer orders by insertion and ignores them; in-flow lifts live in
 * core recipes, not in React. No exceptions.
 */
const BANNED_TEXT: Array<[label: string, pattern: RegExp, allowIn?: string[]]> = [
  ['UNSTABLE_portalContainer', /UNSTABLE_portalContainer/, [ADAPTER]],
  ['portalContainer', /portalContainer/, [ADAPTER]],
  ['useLayer', /\buseLayer\b/],
  ['LayerProvider', /\bLayerProvider\b/],
  ['z-index', /z-index/i],
  ['zIndex', /\bzIndex\b/],
];

function sourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (entry !== 'test' && entry !== 'node_modules' && entry !== 'generated')
        files.push(...sourceFiles(path));
    } else if (/\.(tsx?|astro)$/.test(entry) && !/\.(test|type-test|browser\.test)\./.test(entry)) {
      files.push(path);
    }
  }
  return files;
}

const reactFiles = sourceFiles(reactSrc).map((file) => ({
  rel: relative(reactSrc, file).replace(/\\/g, '/'),
  text: readFileSync(file, 'utf8'),
}));

/** Names imported or re-exported from 'react-aria-components' (`type` and `as` stripped). */
function racNames(text: string): string[] {
  const names: string[] = [];
  const statement =
    /\b(?:import|export)\s+(?:type\s+)?\{([^}]*)\}\s*from\s*['"]react-aria-components['"]/g;
  for (const match of text.matchAll(statement)) {
    for (const part of match[1]!.split(',')) {
      const name = part
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0]!
        .trim();
      if (name) names.push(name);
    }
  }
  return names;
}

describe('native overlay gates (packages/react/src)', () => {
  it('scans a sensible set of files', () => {
    expect(reactFiles.length).toBeGreaterThan(100);
    expect(reactFiles.some((f) => f.rel === ADAPTER)).toBe(true);
    expect(reactFiles.some((f) => f.rel.endsWith('.test.tsx'))).toBe(false);
  });

  it.each(BANNED_TEXT)('no %s', (label, pattern, allowIn = []) => {
    const hits = reactFiles
      .filter((f) => !allowIn.includes(f.rel) && pattern.test(f.text))
      .map((f) => f.rel);
    expect(hits, `${label} found; overlays are native and render in place`).toEqual([]);
  });

  it('imports no react-aria-components overlay component outside the adapter', () => {
    const hits = reactFiles
      .filter((f) => f.rel !== ADAPTER)
      .flatMap((f) =>
        racNames(f.text)
          .filter((name) => BANNED_RAC_IMPORTS.includes(name))
          .map((name) => `${f.rel}: ${name}`),
      );
    expect(hits, 'use Dialog/Popover/Tooltip/... from var-ui, or NativePopover').toEqual([]);
  });

  it('racNames understands multi-line, type and aliased imports', () => {
    const sample = `import {\n  Button,\n  type PopoverProps,\n  Popover as RacPopover,\n} from 'react-aria-components';`;
    expect(racNames(sample)).toEqual(['Button', 'PopoverProps', 'Popover']);
  });
});

describe('native overlay gates (packages/astro/src)', () => {
  it('has no portal container or layer API', () => {
    const hits = sourceFiles(astroSrc)
      .filter((file) =>
        /portalContainer|\bLayerProvider\b|\buseLayer\b/.test(readFileSync(file, 'utf8')),
      )
      .map((file) => relative(astroSrc, file));
    expect(hits).toEqual([]);
  });
});
