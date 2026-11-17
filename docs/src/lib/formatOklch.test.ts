import { describe, expect, test } from 'vite-plus/test';
import { formatOklch } from './formatOklch';

describe('formatOklch', () => {
  test('converts rgb() and hex to oklch', () => {
    expect(formatOklch('rgb(255, 255, 255)')).toBe('oklch(1 0 0)');
    expect(formatOklch('rgb(0, 0, 0)')).toBe('oklch(0 0 0)');
    expect(formatOklch('rgb(103, 232, 249)')).toMatch(/^oklch\(0\.86\d? 0\.1[0-9]* 2\d\d\)$/);
    expect(formatOklch('#ff0000')).toBe('oklch(0.628 0.258 29)');
  });

  test('tidies oklch() and leaves other values alone', () => {
    expect(formatOklch('oklch(0.4660 0.1440 175)')).toBe('oklch(0.466 0.144 175)');
    expect(formatOklch('oklch(46.6% 0.144 175deg)')).toBe('oklch(0.466 0.144 175)');
    expect(formatOklch('color-mix(in oklch, red 50%, blue)')).toBe(
      'color-mix(in oklch, red 50%, blue)',
    );
  });

  test('converts color(srgb …), the computed form of color-mix(in srgb …)', () => {
    expect(formatOklch('color(srgb 1 0 0)')).toBe('oklch(0.628 0.258 29)');
    expect(formatOklch('color(srgb 1 1 1)')).toBe('oklch(1 0 0)');
    expect(formatOklch('color(srgb 0.6068 0.3958 0.3992)')).toMatch(/^oklch\(0\.\d+ 0\.\d+ \d+\)$/);
    expect(formatOklch('color(srgb 0 0 0 / 0.5)')).toBe('oklch(0 0 0 / 0.5)');
  });

  test('keeps a translucent rgba() alpha', () => {
    expect(formatOklch('rgba(0, 0, 0, 0.25)')).toBe('oklch(0 0 0 / 0.25)');
  });
});
