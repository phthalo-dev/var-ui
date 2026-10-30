import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../src/styles';
import { atForcedColors, atMoreContrast } from '../src/theme/conditions';
import { focusRing } from '../src/internal/focusRing';
import { forced } from '../src/internal/forcedColors';
import { border, borderSide } from '../src/internal/border';
import { select } from '../src/components/select';
import { calendar } from '../src/components/calendar';
import { dateInput } from '../src/components/dateInput';

describe('forced-colors and contrast helpers', () => {
  it('atForcedColors and atMoreContrast wrap a single media block', () => {
    expect(atForcedColors({ outline: '1px solid Highlight' })).toEqual({
      '@media (forced-colors: active)': { outline: '1px solid Highlight' },
    });
    expect(atMoreContrast({ borderColor: 'CanvasText' })).toEqual({
      '@media (prefers-contrast: more)': { borderColor: 'CanvasText' },
    });
  });

  it('forced fragments use system colors only', () => {
    const values = Object.values(forced).flatMap((fragment) => Object.values(fragment));
    const systemOrToken =
      /^(Canvas|CanvasText|Highlight|HighlightText|GrayText|none|solid|2px|var\()/;
    for (const value of values) expect(String(value)).toMatch(systemOrToken);
    expect(forced.swatch).toEqual({ forcedColorAdjust: 'none' });
  });

  it('focusRing stays an outline, which forced-colors mode keeps (box-shadow is dropped)', () => {
    expect(focusRing.outline).toMatch(/^2px solid /);
    expect(Object.keys(focusRing)).toEqual(['outline', 'outlineOffset']);
  });
});

describe('shared field chrome survives forced colors', () => {
  it('emits forced-colors rules for dropdown items, date segments and calendar cells', () => {
    select({});
    calendar({});
    dateInput({});
    const css = getRegisteredCss();
    const forcedRules = css
      .split('\n')
      .filter((line) => line.includes('@media (forced-colors: active)'));
    expect(forcedRules.length).toBeGreaterThan(0);
    const joined = forcedRules.join('\n');
    expect(joined).toMatch(/\.var-ui-select__item[^{]*\[data-selected\]/);
    expect(joined).toMatch(/\.var-ui-calendar__cell[^{]*\[data-selected\]/);
    expect(joined).toMatch(/background-color:\s*Highlight/);
    expect(joined).toMatch(/color:\s*HighlightText/);
  });
});

describe('border helpers', () => {
  it('border() returns longhands with token defaults', () => {
    expect(border()).toEqual({
      borderWidth: 'var(--var-ui-borderWidth-default)',
      borderStyle: 'solid',
      borderColor: 'var(--var-ui-color-border-default)',
    });
    expect(border('red', '3px')).toEqual({
      borderWidth: '3px',
      borderStyle: 'solid',
      borderColor: 'red',
    });
  });

  it('borderSide() uses logical longhands only', () => {
    expect(borderSide('inline-start', 'red')).toEqual({
      borderInlineStartWidth: 'var(--var-ui-borderWidth-default)',
      borderInlineStartStyle: 'solid',
      borderInlineStartColor: 'red',
    });
    expect(Object.keys(borderSide('block-end'))).toEqual([
      'borderBlockEndWidth',
      'borderBlockEndStyle',
      'borderBlockEndColor',
    ]);
  });
});
