import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../../src/styles';
import { combobox } from '../../src/components/combobox';
import { dateInput } from '../../src/components/dateInput';
import { hoverCard } from '../../src/components/hoverCard';
import { menu } from '../../src/components/menu';
import { multiSelector } from '../../src/components/multiSelector';
import { popover } from '../../src/components/popover';
import { select } from '../../src/components/select';
import { toast } from '../../src/components/toast';
import { tokenizer } from '../../src/components/tokenizer';
import { tooltip } from '../../src/components/tooltip';
import {
  anchored,
  anchoredMatchWidth,
  popupPlacements,
  popupPositionArea,
  popupTryFallbacks,
} from '../../src/shared/anchored';

const rules = (css: string, ...needles: string[]) =>
  css.split('\n').filter((line) => needles.every((n) => line.includes(n)));

describe('anchored placement vocabulary', () => {
  it('maps side + align to logical position-area values', () => {
    expect(popupPositionArea('bottom', 'start')).toBe('block-end span-inline-end');
    expect(popupPositionArea('bottom', 'end')).toBe('block-end span-inline-start');
    expect(popupPositionArea('bottom', 'center')).toBe('block-end');
    expect(popupPositionArea('top', 'start')).toBe('block-start span-inline-end');
    expect(popupPositionArea('start', 'start')).toBe('inline-start span-block-end');
    expect(popupPositionArea('end', 'center')).toBe('inline-end');
    expect(popupPositionArea('end', 'end')).toBe('inline-end span-block-start');
  });

  it('flips along the placement axis first', () => {
    expect(popupTryFallbacks('bottom').startsWith('flip-block')).toBe(true);
    expect(popupTryFallbacks('start').startsWith('flip-inline')).toBe(true);
  });

  it('lists the 16 public placements', () => {
    expect(popupPlacements).toHaveLength(16);
    expect(popupPlacements).toContain('bottom');
    expect(popupPlacements).toContain('top start');
    expect(popupPlacements).toContain('end center');
  });

  it('matches the trigger width through anchor-size', () => {
    expect(anchoredMatchWidth()).toMatchObject({ width: 'anchor-size(width)' });
    expect(anchoredMatchWidth('min')).not.toHaveProperty('width');
  });
});

describe('anchored recipes', () => {
  it('anchors popover, menu, tooltip and hover card popups and animates them on :popover-open', () => {
    popover();
    menu();
    tooltip();
    hoverCard();
    const css = getRegisteredCss();
    for (const cls of [
      '.var-ui-popover',
      '.var-ui-menu__popover',
      '.var-ui-tooltip',
      '.var-ui-hover-card',
    ]) {
      const [base] = rules(css, `${cls} {`, 'position: fixed');
      expect(base, cls).toBeTruthy();
      expect(base).toContain('inset: auto');
      expect(base).toMatch(/max-height: min\(var\(--var-ui-popup-max-height/);
      expect(base).toContain('position-area:');
      expect(base).toContain('position-try-fallbacks:');
      expect(base).not.toContain('max-height: 100%');
      expect(base).toMatch(/transition: [^;]*overlay [^;]*allow-discrete[^;]*display/);
      expect(rules(css, `${cls}:popover-open {`, 'opacity: 1')).toHaveLength(1);
      expect(rules(css, '@starting-style', `${cls}:popover-open`)).toHaveLength(1);
      expect(rules(css, cls).join('\n'), cls).not.toContain('z-index');
      expect(rules(css, cls).join('\n'), cls).not.toContain('data-starting-style');
    }
  });

  it('emits a rule per placement, with offset margin on the facing side and RTL origins', () => {
    popover();
    const css = getRegisteredCss();
    const sel = (p: string) => `.var-ui-popover[data-placement="${p}"] {`;
    expect(rules(css, sel('bottom'), 'position-area: block-end span-inline-end')).toHaveLength(1);
    expect(
      rules(css, sel('bottom end'), 'position-area: block-end span-inline-start'),
    ).toHaveLength(1);
    expect(rules(css, sel('end center'), 'position-area: inline-end')).toHaveLength(1);
    const [top] = rules(css, sel('top start'));
    expect(top).toContain('margin: 0');
    expect(top).toContain('margin-block-end: var(--var-ui-popup-offset, var(--var-ui-space-2))');
    expect(top).toContain('transform-origin: bottom left');
    expect(
      rules(css, `[dir="rtl"] .var-ui-popover[data-placement="top start"] {`, 'bottom right'),
    ).toHaveLength(1);
    expect(popupPlacements.every((p) => css.includes(`[data-placement="${p}"]`))).toBe(true);
  });

  it('tooltip and hover card default to a centered top placement', () => {
    tooltip();
    const css = getRegisteredCss();
    expect(rules(css, '.var-ui-tooltip {', 'position-area: block-start;')).toHaveLength(1);
    expect(
      rules(css, '.var-ui-tooltip[data-placement="bottom"] {', 'position-area: block-end;'),
    ).toHaveLength(1);
  });

  it('select-like popups match the trigger width and keep their size cap', () => {
    select();
    combobox();
    multiSelector();
    tokenizer();
    dateInput();
    const css = getRegisteredCss();
    for (const cls of ['select', 'combobox', 'multiSelector']) {
      const [base] = rules(css, `.var-ui-${cls}__popover {`, 'position: fixed');
      expect(base, cls).toContain('width: anchor-size(width)');
      expect(base, cls).toContain('--var-ui-popup-max-height, 16rem');
      expect(base, cls).not.toContain('z-index');
    }
    expect(
      rules(css, '.var-ui-tokenizer__popover {', 'min-width: anchor-size(width)'),
    ).toHaveLength(1);
    expect(rules(css, '.var-ui-dateInput__popover {', 'position: fixed')).toHaveLength(1);
  });

  it('toast region is a manual popover reset with no z-index', () => {
    toast();
    const css = getRegisteredCss();
    const own = rules(css, '.var-ui-toast__region');
    expect(own.join('\n')).not.toContain('z-index');
    expect(rules(css, '.var-ui-toast__region {', 'inset: auto', 'margin: 0')).toHaveLength(1);
    expect(
      rules(css, '.var-ui-toast__region:popover-open', 'display: flex').length,
    ).toBeGreaterThan(0);
    expect(rules(css, '@starting-style', ':popover-open')).not.toHaveLength(0);
  });

  it('the helper owns the :popover-open key', () => {
    expect(anchored()).toHaveProperty(['&:popover-open']);
  });
});
