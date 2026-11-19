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

describe('color.categorical (#144)', () => {
  const darkSurface = 'oklch(0.2 0.007 60)';
  const hues = ['blue', 'orange', 'teal', 'pink', 'grass', 'violet', 'amber', 'red'] as const;

  it('every category reads as a mark (≥ 3:1) on the surface in both modes', () => {
    for (const hue of hues) {
      const ramp = baseColorPalettes[hue];
      expect(contrastRatio(ramp['6'], '#ffffff'), `${hue} light`).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(ramp['5'], darkSurface), `${hue} dark`).toBeGreaterThanOrEqual(3);
    }
  });
});
