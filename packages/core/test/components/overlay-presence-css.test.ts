import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../../src/styles';
import { hoverCard } from '../../src/components/hoverCard';
import { menu } from '../../src/components/menu';
import { popover } from '../../src/components/popover';
import { tooltip } from '../../src/components/tooltip';

describe('overlay presence recipe CSS', () => {
  it('emits starting, ending, and reduced-motion styles for overlay recipes', () => {
    hoverCard();
    menu();
    popover();
    tooltip();

    const css = getRegisteredCss();
    const animatedClasses = [
      'var-ui-hover-card',
      'var-ui-menu__popover',
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
});
