import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { menu } from '../../src/components/menu';
import { defaultTheme } from '../../src/theme/register-default';
import { designTokens as t } from '../../src/tokens';

/**
 * Color channels the popover must carry itself. React portals
 * `.var-ui-menu__popover` to `document.body`, outside `.var-ui-menu`, where
 * registered `@property` colors otherwise stay at their transparent initial
 * value. Items inside the popover inherit these from that slot.
 */
const POPOVER_COLOR_VARS = [
  ['popoverBackground', t.color.background.surface.var],
  ['popoverBorder', t.color.border.default.var],
  ['itemForeground', t.color.text.primary.var],
  ['itemFocusedBackground', t.color.background.subtle.var],
  ['itemDisabledForeground', t.color.text.secondary.var],
  ['sectionHeaderForeground', t.color.text.secondary.var],
  ['separatorColor', t.color.border.default.var],
  ['dangerForeground', t.color.tone.danger.foreground.var],
] as const;

function declarationsFor(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:^|[}\\n])\\s*${escaped}(?![\\w-])\\s*\\{([^}]*)\\}`, 'g');
  return [...css.matchAll(re)].map((match) => match[1] ?? '').join('\n');
}

describe('menu recipe', () => {
  it('emits color var defaults on the host and the popover, and keeps anchor vars on the host', () => {
    menu();
    const css = getRegisteredCss();
    const host = declarationsFor(css, '.var-ui-menu');
    const popover = declarationsFor(css, '.var-ui-menu__popover');

    expect(host).toBeTruthy();
    expect(popover).toBeTruthy();
    for (const [key, value] of POPOVER_COLOR_VARS) {
      const declaration = `${menu.vars[key].name}: ${value}`;
      expect(host).toContain(declaration);
      expect(popover).toContain(declaration);
    }

    expect(host).toContain(`${menu.vars.anchorX.name}: 0px`);
    expect(host).toContain(`${menu.vars.anchorY.name}: 0px`);
    expect(popover).not.toContain(menu.vars.anchorX.name);
    expect(popover).not.toContain(menu.vars.anchorY.name);
  });

  it('emits a theme override for a slotted color var on the host and the popover', () => {
    menu();
    defaultTheme.override({
      name: 'menu-popover-vars',
      components: {
        menu: {
          vars: {
            popoverBackground: 'var(--color-app)',
            anchorX: '4px',
          },
        },
      },
    });

    const css = getRegisteredCss();
    const host = declarationsFor(css, '.theme-var-ui-menu-popover-vars .var-ui-menu');
    const popover = declarationsFor(css, '.theme-var-ui-menu-popover-vars .var-ui-menu__popover');

    expect(host).toContain(`${menu.vars.popoverBackground.name}: var(--color-app)`);
    expect(host).toContain(`${menu.vars.anchorX.name}: 4px`);
    expect(popover).toContain(`${menu.vars.popoverBackground.name}: var(--color-app)`);
    expect(popover).not.toContain(menu.vars.anchorX.name);
  });
});
