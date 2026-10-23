import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { menu } from '../../src/components/menu';

/**
 * Color channels the popover must carry itself. React portals
 * `.var-ui-menu__popover` to `document.body`, outside `.var-ui-menu`, where
 * registered `@property` colors otherwise stay at their transparent initial
 * value.
 */
const POPOVER_COLOR_VARS = [
  ['--var-ui-menu-popoverbackground', 'var(--var-ui-color-background-surface)'],
  ['--var-ui-menu-popoverborder', 'var(--var-ui-color-border-default)'],
  ['--var-ui-menu-itemforeground', 'var(--var-ui-color-text-primary)'],
  ['--var-ui-menu-itemfocusedbackground', 'var(--var-ui-color-background-subtle)'],
  ['--var-ui-menu-itemdisabledforeground', 'var(--var-ui-color-text-secondary)'],
  ['--var-ui-menu-sectionheaderforeground', 'var(--var-ui-color-text-secondary)'],
  ['--var-ui-menu-separatorcolor', 'var(--var-ui-color-border-default)'],
  ['--var-ui-menu-dangerforeground', 'var(--var-ui-color-tone-danger-foreground)'],
] as const;

function popoverBlock(css: string): string | undefined {
  return css.match(/\.var-ui-menu__popover \{[^}]*\}/)?.[0];
}

describe('menu recipe', () => {
  it('declares color vars on the popover so portaled menus are not transparent', () => {
    menu();
    const block = popoverBlock(getRegisteredCss());

    expect(block).toBeTruthy();
    for (const [name, value] of POPOVER_COLOR_VARS) {
      expect(block).toContain(`${name}: ${value}`);
    }
  });

  it('inherits those color vars from the menu root when the popover is nested inside it', () => {
    menu();
    const nested = getRegisteredCss().match(/\.var-ui-menu \.var-ui-menu__popover \{[^}]*\}/)?.[0];

    expect(nested).toBeTruthy();
    for (const [name] of POPOVER_COLOR_VARS) {
      expect(nested).toContain(`${name}: inherit`);
    }
  });
});
