import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../src/styles';
import { menu } from '../src/components/menu';
import { divider } from '../src/components/divider';
import { commandPalette } from '../src/components/commandPalette';

describe('p4 sweep 2: forced colors and motion literals', () => {
  it('menu, divider and command palette emit forced-colors rules', () => {
    menu();
    divider();
    commandPalette();
    const css = getRegisteredCss();
    for (const name of ['menu', 'divider', 'command-palette']) {
      const lines = css.split('\n').filter((l) => l.includes(name) && l.includes('forced-colors'));
      expect(lines.length, name).toBeGreaterThan(0);
    }
  });
});
