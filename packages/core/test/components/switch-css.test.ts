import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { switchStyles } from '../../src/components/switch';

describe('switch track CSS', () => {
  it('keeps the 40px track from shrinking under a wide label', () => {
    switchStyles();
    const css = getRegisteredCss();
    const track = css.match(/\.var-ui-switch__track\s*\{([^}]*)\}/);

    expect(track?.[1]).toMatch(/width:\s*40px/);
    expect(track?.[1]).toMatch(/flex-shrink:\s*0/);
  });
});
