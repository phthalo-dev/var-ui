import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../../src/styles';
import { combobox } from '../../src/components/combobox';
import { commandPalette } from '../../src/components/commandPalette';
import { dateInput } from '../../src/components/dateInput';
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
] as unknown as ReadonlyArray<readonly [string, () => unknown]>;

const escape = (name: string) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('overlay recipes emit no z-index (top layer orders by insertion)', () => {
  it.each(WHOLE_RECIPE)('%s', (name, recipe) => {
    recipe();
    const own = new RegExp(`\\.var-ui-${escape(name)}(?![A-Za-z0-9-])`);
    const rules = getRegisteredCss()
      .split('\n')
      .filter((line) => own.test(line));
    expect(rules.length, `${name} emitted no CSS`).toBeGreaterThan(0);
    expect(
      rules.filter((line) => /z-index/i.test(line)),
      name,
    ).toEqual([]);
  });

  it.each(POPUP_SLOT_ONLY)('%s popup slot', (name, recipe) => {
    recipe();
    const popup = new RegExp(`\\.var-ui-${escape(name)}__popover(?![A-Za-z0-9-])`);
    const rules = getRegisteredCss()
      .split('\n')
      .filter((line) => popup.test(line));
    expect(rules.length, `${name}__popover emitted no CSS`).toBeGreaterThan(0);
    expect(
      rules.filter((line) => /z-index/i.test(line)),
      name,
    ).toEqual([]);
  });
});
