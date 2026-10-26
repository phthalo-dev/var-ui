import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { appShell } from '../../src/components/appShell';

describe('appShell height', () => {
  it('stretch fills the parent and stays inside it', () => {
    appShell({ height: 'stretch' });
    const css = getRegisteredCss();
    const rule = css.match(/\.var-ui-app-shell\[data-height="stretch"\] \{[^}]+\}/)?.[0];
    expect(rule).toBeDefined();
    expect(rule).toContain('height: 100%');
    expect(rule).toContain('min-height: 0');
    expect(rule).toContain('max-height: 100%');
    expect(rule).toContain('overflow: hidden');
    expect(rule).not.toContain('100dvh');
  });

  it('stretches the side slot and its direct child to the column', () => {
    appShell();
    const css = getRegisteredCss();
    const slot = css.match(/\.var-ui-app-shell__sideNav \{[^}]+\}/)?.[0];
    expect(slot).toContain('height: 100%');
    expect(slot).toContain('align-self: stretch');
    expect(css).toContain(
      '.var-ui-app-shell__sideNav > * { flex: 1 1 auto; min-height: 0; height: 100%; }',
    );
  });
});
