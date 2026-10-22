import { describe, it, expect, expectTypeOf } from 'vite-plus/test';
import { getComponentMeta } from 'typestyles';
import type { OverrideConfigFor } from '../src/theme';
import * as components from '../src/components';
import { typestyles } from '../src/runtime';
import { button } from '../src/components/button';
import { card } from '../src/components/card';
import { badge } from '../src/components/badge';
import { menu } from '../src/components/menu';
import { tabs } from '../src/components/tabs';
import { createDesignTheme } from '../src/theme/create-theme';

describe('themeable recipe registry', () => {
  it('includes every exported recipe function from components/', () => {
    const themeable = typestyles.getThemeableComponents();

    const recipeExports = Object.entries(components).filter(
      ([name, value]) =>
        typeof value === 'function' &&
        ![
          'layoutContentWidthAssignment',
          'layoutShellPaddingAssignments',
          'resolveScrollAreaFade',
        ].includes(name) &&
        !name.endsWith('Chrome') &&
        !name.startsWith('create'),
    );

    const missing: string[] = [];
    for (const [, value] of recipeExports) {
      const meta = getComponentMeta(value as object);
      if (!meta?.namespace) continue;
      const registered = themeable.get(meta.namespace);
      if (registered !== value) missing.push(meta.namespace);
    }

    expect(missing, `Themeable registry missing namespaces: ${missing.join(', ')}`).toEqual([]);
  });

  it('infers dimensioned button override shape with CSS + variant keys', () => {
    type ButtonOverride = OverrideConfigFor<typeof button>;

    const ok: ButtonOverride = {
      base: { borderRadius: '999px' },
      variants: {
        tone: {
          accent: { textTransform: 'uppercase' },
        },
      },
    };
    void ok;

    const badDimension: ButtonOverride = {
      variants: {
        // @ts-expect-error unknown variant dimension
        notADimension: { primary: { color: 'red' } },
      },
    };
    void badDimension;

    const customProp: ButtonOverride = {
      base: {
        borderRadius: '999px',
        '--brand-ring': '0 0 0 3px blue',
      },
    };
    void customProp;

    expectTypeOf(ok).toHaveProperty('base');
  });

  it('infers slotted card override with slot keys', () => {
    type CardOverride = OverrideConfigFor<typeof card>;
    const ok: CardOverride = {
      base: {
        root: { borderRadius: '16px' },
        title: { fontWeight: 700 },
      },
    };
    void ok;
  });

  it('accepts badge tone overrides on the flat recipe', () => {
    type BadgeOverride = OverrideConfigFor<typeof badge>;
    const ok: BadgeOverride = {
      base: { borderRadius: '999px' },
    };
    void ok;
  });

  it('infers tabs vars from the recipe ref tree', () => {
    type TabsOverride = OverrideConfigFor<typeof tabs>;
    const ok: TabsOverride = {
      vars: { railColor: 'red' },
    };
    void ok;
  });

  it('infers menu popover overrides', () => {
    type MenuOverride = OverrideConfigFor<typeof menu>;
    const ok: MenuOverride = {
      base: {
        popover: { minWidth: '16rem' },
      },
    };
    void ok;
  });

  it('types components on createDesignTheme from recipe namespaces', () => {
    createDesignTheme({
      name: 'typed',
      components: {
        button: {
          styles: ({ tokens: t }) => ({
            base: { boxShadow: t.shadow.md.var, borderRadius: t.radius.lg.var },
            variants: {
              tone: {
                accent: { textTransform: 'uppercase' },
              },
            },
          }),
        },
        card: {
          styles: {
            base: {
              root: { borderRadius: '16px' },
            },
          },
        },
        badge: { styles: { base: { letterSpacing: '0.06em' } } },
      },
    });
  });
});
