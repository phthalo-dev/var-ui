export type Rgb = { r: number; g: number; b: number };
export type Rgba = Rgb & { a: number };
export type Hsv = { h: number; s: number; v: number; a?: number };

const HEX_SHORT = /^#([0-9a-fA-F]{3})$/;
const HEX = /^#([0-9a-fA-F]{6})$/;
const HEX_ALPHA = /^#([0-9a-fA-F]{8})$/;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Expand `#rgb` → `#rrggbb` and lowercase. Invalid input is returned trimmed. */
export function normalizeHex(value: string): string {
  const trimmed = value.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;

  const short = withHash.match(HEX_SHORT);
  if (short) {
    const [r, g, b] = short[1];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  const full = withHash.match(HEX);
  if (full) return `#${full[1].toLowerCase()}`;

  const alpha = withHash.match(HEX_ALPHA);
  if (alpha) return `#${alpha[1].toLowerCase()}`;

  return withHash;
}

export function isValidHex(value: string): boolean {
  const normalized = normalizeHex(value);
  return HEX.test(normalized) || HEX_ALPHA.test(normalized);
}

export function parseHex(value: string): Rgba | null {
  const normalized = normalizeHex(value);
  const alphaMatch = normalized.match(HEX_ALPHA);
  if (alphaMatch) {
    const hex = alphaMatch[1];
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
      a: Number.parseInt(hex.slice(6, 8), 16) / 255,
    };
  }

  const match = normalized.match(HEX);
  if (!match) return null;
  const hex = match[1];
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
    a: 1,
  };
}

export function rgbToHex(rgb: Rgba, includeAlpha = false): string {
  const toByte = (channel: number) =>
    clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0');
  const base = `#${toByte(rgb.r)}${toByte(rgb.g)}${toByte(rgb.b)}`;
  if (!includeAlpha || rgb.a >= 1) return base;
  return `${base}${toByte(rgb.a * 255)}`;
}

export function rgbToHsv({ r, g, b, a }: Rgba): Hsv {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  return { h, s, v, a };
}

export function hsvToRgb({ h, s, v, a = 1 }: Hsv): Rgba {
  const saturation = clamp(s, 0, 100) / 100;
  const value = clamp(v, 0, 100) / 100;
  const chroma = value * saturation;
  const huePrime = (clamp(h, 0, 360) / 60) % 6;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const m = value - chroma;

  let rn = 0;
  let gn = 0;
  let bn = 0;

  if (huePrime >= 0 && huePrime < 1) [rn, gn, bn] = [chroma, x, 0];
  else if (huePrime < 2) [rn, gn, bn] = [x, chroma, 0];
  else if (huePrime < 3) [rn, gn, bn] = [0, chroma, x];
  else if (huePrime < 4) [rn, gn, bn] = [0, x, chroma];
  else if (huePrime < 5) [rn, gn, bn] = [x, 0, chroma];
  else [rn, gn, bn] = [chroma, 0, x];

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
    a: clamp(a, 0, 1),
  };
}

export function hexToHsv(value: string, fallback = '#228be6'): Hsv {
  return rgbToHsv(parseHex(value) ?? parseHex(fallback)!);
}

export function hsvToHex(hsv: Hsv, includeAlpha = false): string {
  return rgbToHex(hsvToRgb(hsv), includeAlpha);
}

/** CSS `hsl(H, 100%, 50%)` for the active hue — saturation panel base. */
export function hueToPureHex(h: number): string {
  return hsvToHex({ h, s: 100, v: 100, a: 1 });
}
