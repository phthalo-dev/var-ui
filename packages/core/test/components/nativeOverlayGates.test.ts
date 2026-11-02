import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../../src/styles';
import { combobox } from '../../src/components/combobox';
import { commandPalette } from '../../src/components/commandPalette';
import { dateInput } from '../../src/components/dateInput';
import { dateRangeInput } from '../../src/components/dateRangeInput';
import { dateTimeInput } from '../../src/components/dateTimeInput';
import { dialog } from '../../src/components/dialog';
import { drawer } from '../../src/components/drawer';
import { hoverCard } from '../../src/components/hoverCard';
import { layoutPanel } from '../../src/components/layout';
import { menu } from '../../src/components/menu';
import { mobileNav } from '../../src/components/mobileNav';
import { multiSelector } from '../../src/components/multiSelector';
import { popover } from '../../src/components/popover';
import { select } from '../../src/components/select';
import { toast } from '../../src/components/toast';
import { tokenizer } from '../../src/components/tokenizer';
import { tooltip } from '../../src/components/tooltip';

/**
 * Gate (P6 design C2): overlays live in the browser top layer (`<dialog>` and `[popover]`), which
 * orders by insertion and ignores `z-index`. A `z-index` on an overlay recipe is dead weight at
 * best and a stacking bug in a non-top-layer fallback at worst, so none may come back.
 *
 * Allowlist: none. Whole recipes are checked (every slot) for the overlay families below; for the
 * form fields that own a popup (select, combobox, ...) only the `popover` slot is checked, because
 * the field chrome itself is in-flow and may use the in-flow `raised`/`lifted` tiers.
 */
const WHOLE_RECIPE = [
  ['dialog', dialog],
  ['drawer', drawer],
  ['popover', popover],
  ['tooltip', tooltip],
  ['hover-card', hoverCard],
  ['menu', menu],
  ['mobile-nav', mobileNav],
  ['toast', toast],
  ['command-palette', commandPalette],
  ['layout-panel', layoutPanel],
] as unknown as ReadonlyArray<readonly [string, () => unknown]>;

/** Field recipes whose `popover` slot is a top-layer popup. */
const POPUP_SLOT_ONLY = [
  ['select', select],
  ['combobox', combobox],
  ['multiSelector', multiSelector],
  ['tokenizer', tokenizer],
  ['dateInput', dateInput],
  ['dateRangeInput', dateRangeInput],
  ['dateTimeInput', dateTimeInput],
] as unknown as ReadonlyArray<readonly [string, () => unknown]>;

const escape = (name: string) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Rules whose selector matches `selector`, including declarations on later lines of the same block.
 * A line split would miss `z-index` when the emitter pretty-prints it under the selector.
 */
function rulesMatching(css: string, selector: RegExp): string[] {
  const hits: string[] = [];
  let depth = 0;
  let segmentStart = 0;
  let i = 0;
  while (i < css.length) {
    const ch = css[i];
    if (ch === '{') {
      const prelude = css.slice(segmentStart, i);
      let nested = depth + 1;
      let j = i + 1;
      while (j < css.length && nested > depth) {
        if (css[j] === '{') nested++;
        else if (css[j] === '}') nested--;
        j++;
      }
      if (selector.test(prelude)) {
        hits.push(css.slice(segmentStart, j));
        segmentStart = j;
        i = j;
        continue;
      }
      depth += 1;
      segmentStart = i + 1;
      i += 1;
      continue;
    }
    if (ch === '}') {
      depth = Math.max(0, depth - 1);
      segmentStart = i + 1;
    }
    i += 1;
  }
  return hits;
}

describe('rulesMatching', () => {
  it('keeps a z-index declared on the line after the selector', () => {
    const css = '.var-ui-dialog {\n  z-index: 2;\n}\n.var-ui-button { color: red; }';
    const rules = rulesMatching(css, /\.var-ui-dialog(?![A-Za-z0-9-])/);
    expect(rules).toHaveLength(1);
    expect(rules[0]).toMatch(/z-index/);
    expect(rules[0]).not.toMatch(/var-ui-button/);
  });
});

describe('overlay recipes emit no z-index (top layer orders by insertion)', () => {
  it('covers every component recipe that spreads anchored popup styles', () => {
    const checked = new Set([...WHOLE_RECIPE, ...POPUP_SLOT_ONLY].map(([name]) => name));
    const dir = join(dirname(fileURLToPath(import.meta.url)), '../../src/components');
    const missing: string[] = [];
    for (const entry of readdirSync(dir)) {
      if (!entry.endsWith('.ts')) continue;
      const text = readFileSync(join(dir, entry), 'utf8');
      for (const part of text.split('typestyles.recipe(').slice(1)) {
        if (!part.includes('anchored(') && !part.includes('dropdownPopoverChrome(')) continue;
        const name = part.match(/\bname:\s*['"]([^'"]+)['"]/)?.[1];
        if (!name || !checked.has(name)) missing.push(`${entry}: ${name ?? '(no name)'}`);
      }
    }
    expect(missing, 'add the recipe to WHOLE_RECIPE or POPUP_SLOT_ONLY').toEqual([]);
  });

  it.each(WHOLE_RECIPE)('%s', (name, recipe) => {
    recipe();
    const own = new RegExp(`\\.var-ui-${escape(name)}(?![A-Za-z0-9-])`);
    const rules = rulesMatching(getRegisteredCss(), own);
    expect(rules.length, `${name} emitted no CSS`).toBeGreaterThan(0);
    expect(
      rules.filter((rule) => /z-index/i.test(rule)),
      name,
    ).toEqual([]);
  });

  it.each(POPUP_SLOT_ONLY)('%s popup slot', (name, recipe) => {
    recipe();
    const popup = new RegExp(`\\.var-ui-${escape(name)}__popover(?![A-Za-z0-9-])`);
    const rules = rulesMatching(getRegisteredCss(), popup);
    expect(rules.length, `${name}__popover emitted no CSS`).toBeGreaterThan(0);
    expect(
      rules.filter((rule) => /z-index/i.test(rule)),
      name,
    ).toEqual([]);
  });
});
