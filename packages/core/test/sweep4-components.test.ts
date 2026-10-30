import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../src/styles';
import { switchStyles } from '../src/components/switch';
import { statusDot } from '../src/components/statusDot';
import { tabs } from '../src/components/tabs';
import { tooltip } from '../src/components/tooltip';
import { table } from '../src/components/table';
import { toc } from '../src/components/toc';
import { toggleButton } from '../src/components/toggleButton';
import { tree } from '../src/components/tree';

describe('sweep 4 recipes', () => {
  it('invoke every touched recipe', () => {
    switchStyles({});
    statusDot({ pulse: true });
    tabs({});
    tooltip({});
    table({ dividers: 'grid', stickyHeader: true });
    toc({});
    toggleButton({});
    tree({});
    const css = getRegisteredCss();
    const forcedRules = css.split('\n').filter((l) => l.includes('@media (forced-colors: active)'));
    expect(forcedRules.length).toBeGreaterThan(0);
    expect(css).toMatch(/switch[^{]*\{[^}]*Highlight/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });

  it('does not use time literals for switch/toggle/tree transitions', () => {
    const css = getRegisteredCss();
    expect(css).not.toMatch(/transition:[^;]*\b(140ms|0\.15s)\b/);
  });
});
