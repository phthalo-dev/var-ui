import { describe, it, expect } from 'vite-plus/test';
import { contrastRatio } from 'typestyles/color-scale';
import {
  baseColorPalettes,
  PALETTE_ACCESSIBLE_STEP_GAP,
  paletteStepsAreAccessible,
} from '../../src/tokens/defaults/color/palette';
import { PALETTE_FAMILIES, PALETTE_STEPS } from '../../src/tokens/schema/color/palette';

const WCAG_AA = 4.5;

function collectContrastByGap(): Record<number, { min: number; max: number }> {
  const byGap: Record<number, { min: number; max: number }> = {};

  for (const family of PALETTE_FAMILIES) {
    const ramp = baseColorPalettes[family];
    for (let i = 0; i < PALETTE_STEPS.length; i++) {
      for (let j = i + 1; j < PALETTE_STEPS.length; j++) {
        const lighter = PALETTE_STEPS[i];
        const darker = PALETTE_STEPS[j];
        const gap = Number(darker) - Number(lighter);
        const ratio = contrastRatio(ramp[lighter], ramp[darker]);
        const entry = byGap[gap] ?? { min: ratio, max: ratio };
        entry.min = Math.min(entry.min, ratio);
        entry.max = Math.max(entry.max, ratio);
        byGap[gap] = entry;
      }
    }
  }

  return byGap;
}

describe('palette ramp contrast', () => {
  it('step pairs with gap > 8 meet WCAG AA (4.5:1)', () => {
    const failures: string[] = [];

    for (const family of PALETTE_FAMILIES) {
      const ramp = baseColorPalettes[family];
      for (let i = 0; i < PALETTE_STEPS.length; i++) {
        for (let j = i + 1; j < PALETTE_STEPS.length; j++) {
          const lighter = PALETTE_STEPS[i];
          const darker = PALETTE_STEPS[j];
          const gap = Number(darker) - Number(lighter);
          if (gap <= PALETTE_ACCESSIBLE_STEP_GAP) continue;

          const ratio = contrastRatio(ramp[lighter], ramp[darker]);
          if (ratio < WCAG_AA) {
            failures.push(`${family} ${lighter}/${darker} gap=${gap} ratio=${ratio.toFixed(2)}`);
          }
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it('paletteStepsAreAccessible matches the step-gap rule', () => {
    expect(paletteStepsAreAccessible('0', '9')).toBe(true); // gap 9
    expect(paletteStepsAreAccessible('1', '9')).toBe(false); // gap 8 — not guaranteed
    expect(paletteStepsAreAccessible('0', '10')).toBe(true); // gap 10
    expect(paletteStepsAreAccessible('0', '8')).toBe(false); // gap 8
  });

  it('documents contrast guarantees by step gap', () => {
    const byGap = collectContrastByGap();
    for (const gap of [8, 9, 10]) {
      expect(byGap[gap].min).toBeGreaterThanOrEqual(WCAG_AA);
    }
    expect(byGap[6].min).toBeLessThan(WCAG_AA);

    for (let gap = 1; gap <= 10; gap++) {
      expect(byGap[gap]).toBeDefined();
    }
  });
});

describe('text.tertiary (#189)', () => {
  // `tertiary` is `color-mix(in oklch, secondary 85%, surface)`; OKLCH mixes interpolate L, C and
  // h linearly, so compute the same mix of the default values here and check it against the
  // surfaces quiet text sits on.
  const mix = (a: string, b: string, p: number) => {
    const parse = (c: string) => {
      const [l, ch, h] = c
        .replace(/^oklch\(|\)$/g, '')
        .split(/\s+/)
        .map((v) => (v.endsWith('%') ? Number.parseFloat(v) / 100 : Number(v)));
      return [l!, ch!, h!];
    };
    const [l1, c1, h1] = parse(a);
    const [l2, c2, h2] = parse(b);
    return `oklch(${l1 * p + l2 * (1 - p)} ${c1 * p + c2 * (1 - p)} ${h1 * p + h2 * (1 - p)})`;
  };
  const stone = baseColorPalettes.stone;
  const white = 'oklch(1 0 0)';
  const cases = {
    light: { secondary: stone['7'], surface: white, subtle: stone['1'] },
    dark: {
      secondary: 'oklch(0.74 0.012 65)',
      surface: 'oklch(0.2 0.007 60)',
      subtle: 'oklch(0.235 0.008 60)',
    },
  };

  for (const [mode, c] of Object.entries(cases)) {
    it(`meets WCAG AA on surface and subtle in ${mode} mode`, () => {
      const tertiary = mix(c.secondary, c.surface, 0.85);
      expect(contrastRatio(tertiary, c.surface)).toBeGreaterThanOrEqual(WCAG_AA);
      expect(contrastRatio(tertiary, c.subtle)).toBeGreaterThanOrEqual(WCAG_AA);
      // …and is a real step below secondary.
      expect(contrastRatio(tertiary, c.surface)).toBeLessThan(
        contrastRatio(c.secondary, c.surface),
      );
    });
  }
});

describe('color.hue (#144)', () => {
  const stone = baseColorPalettes.stone;
  const light = { surface: '#ffffff', subtle: stone['1'] };
  const dark = { surface: 'oklch(0.2 0.007 60)', subtle: 'oklch(0.235 0.008 60)' };

  it('every named hue is readable as text (AA) on surface and subtle in both modes', () => {
    const failures: string[] = [];
    for (const family of PALETTE_FAMILIES) {
      const ramp = baseColorPalettes[family];
      for (const [mode, color, bgs] of [
        ['light', ramp['7'], light],
        ['dark', ramp['4'], dark],
      ] as const) {
        for (const [bg, value] of Object.entries(bgs)) {
          const ratio = contrastRatio(color, value);
          if (ratio < WCAG_AA) failures.push(`${family} ${mode} on ${bg}: ${ratio.toFixed(2)}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });
});
