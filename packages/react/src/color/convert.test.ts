import { describe, expect, it } from 'vite-plus/test';
import { hexToHsv, hsvToHex, normalizeHex, parseHex, rgbToHex, rgbToHsv } from './convert';

describe('color convert', () => {
  it('normalizes short hex', () => {
    expect(normalizeHex('#f00')).toBe('#ff0000');
    expect(normalizeHex('f00')).toBe('#ff0000');
  });

  it('round-trips rgb ↔ hsv ↔ hex', () => {
    const rgb = { r: 99, g: 102, b: 241, a: 1 };
    const hex = rgbToHex(rgb);
    const hsv = rgbToHsv(rgb);
    expect(hsvToHex(hsv)).toBe(hex);
    expect(hexToHsv(hex).h).toBeCloseTo(hsv.h, 0);
  });

  it('parses 8-digit hex alpha', () => {
    expect(parseHex('#ff000080')?.a).toBeCloseTo(0.5, 2);
  });
});
