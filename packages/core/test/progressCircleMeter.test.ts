import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../src/styles';
import { getMeterTone, meter } from '../src/components/meter';
import { progressCircle } from '../src/components/progressCircle';

/** The rule blocks of every selector containing `needle`, including inside at-rules. */
function rulesFor(css: string, needle: string): string[] {
  return css.split('}').filter((chunk) => chunk.includes(needle));
}

describe('progressCircle', () => {
  it('stops the indeterminate spin under reduced motion', () => {
    progressCircle({ indeterminate: true });
    const css = getRegisteredCss();
    const blocks = css.match(
      /@media[^{]*prefers-reduced-motion[^{]*\{[^@]*?progress-circle[^}]*\}/g,
    );
    expect(blocks?.some((b) => /animation:\s*none/.test(b))).toBe(true);
  });

  it('keeps the ring visible with system colors in forced-colors mode', () => {
    progressCircle({});
    const css = getRegisteredCss();
    const forcedBlocks =
      css.match(/@media[^{]*forced-colors: active[^{]*\{[^@]*?progress-circle[^}]*\}/g) ?? [];
    const joined = forcedBlocks.join('\n');
    expect(joined).toMatch(/stroke:\s*Highlight/);
    expect(joined).toMatch(/stroke:\s*GrayText/);
  });

  it('sizes the dash from the progress variable and mirrors in RTL', () => {
    progressCircle({});
    const css = getRegisteredCss();
    expect(rulesFor(css, '__fill').join('')).toMatch(
      /stroke-dasharray:\s*calc\(var\(--var-ui-progress-circle-progress\) \* 100\) 100/,
    );
    expect(css).toMatch(/\[dir="rtl"\][^{]*progress-circle__ring[^{]*\{[^}]*scaleX\(-1\)/);
  });
});

describe('meter', () => {
  it('has a forced-colors fill and track', () => {
    meter({});
    const css = getRegisteredCss();
    const forcedBlocks =
      css.match(/@media[^{]*forced-colors: active[^{]*\{[^@]*?var-ui-meter__[^}]*\}/g) ?? [];
    expect(forcedBlocks.join('\n')).toMatch(/Highlight/);
  });

  it('derives tones like <meter>', () => {
    expect(getMeterTone({ value: 80, low: 30, high: 70, optimum: 0 })).toBe('danger');
  });
});
