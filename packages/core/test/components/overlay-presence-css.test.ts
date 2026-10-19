import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../../src/styles';
import { dialog } from '../../src/components/dialog';
import { drawer } from '../../src/components/drawer';
import { hoverCard } from '../../src/components/hoverCard';
import { menu } from '../../src/components/menu';
import { overlay } from '../../src/components/overlay';
import { popover } from '../../src/components/popover';
import { tooltip } from '../../src/components/tooltip';

describe('overlay presence recipe CSS', () => {
  it('emits starting, ending, and reduced-motion styles for overlay recipes', () => {
    dialog();
    drawer();
    hoverCard();
    menu();
    overlay();
    popover();
    tooltip();

    const css = getRegisteredCss();
    const animatedClasses = [
      'var-ui-dialog__overlay',
      'var-ui-dialog__modal',
      'var-ui-drawer__overlay',
      'var-ui-drawer__panel',
      'var-ui-hover-card',
      'var-ui-menu__popover',
      'var-ui-overlay__backdrop',
      'var-ui-popover',
      'var-ui-tooltip',
    ];

    for (const className of animatedClasses) {
      expect(css).toContain(`.${className}[data-starting-style]`);
      expect(css).toContain(`.${className}[data-ending-style]`);
    }
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('.var-ui-menu__popover[data-placement="bottom-start"]');
    expect(css).toContain('.var-ui-menu__popover[data-placement="top-end"]');
  });

  it('keeps the iOS dialog overlay centered in the visual viewport', () => {
    dialog();
    const css = getRegisteredCss();

    expect(css).toMatch(
      /@supports \(-webkit-touch-callout: none\)[\s\S]*\.var-ui-dialog__overlay[\s\S]*position: absolute[\s\S]*height: 100dvh/,
    );
  });
});
