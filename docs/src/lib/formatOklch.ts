/**
 * Formats a resolved CSS color as `oklch(L C H)` so token readouts share one notation whatever
 * the theme authored or the browser resolved: `#hex`, `rgb()` and `color(srgb …)` (what a
 * computed `color-mix(in srgb …)` serialises to) are converted, `oklch()` is tidied, and anything
 * else, such as an unresolved `color-mix()` or a keyword, is returned as is.
 */
export function formatOklch(value: string): string {
  const color = value.trim();
  const oklch =
    /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(\/\s*[\d.]+%?)?\s*\)$/i.exec(color);
  if (oklch) {
    const lightness = oklch[1]!.endsWith('%') ? parseFloat(oklch[1]!) / 100 : parseFloat(oklch[1]!);
    return format(lightness, parseFloat(oklch[2]!), parseFloat(oklch[3]!), oklch[4]);
  }
  const rgb = parseRgb(color);
  if (!rgb) return color;
  const [l, a, b] = srgbToOklab(rgb.r, rgb.g, rgb.b);
  const chroma = Math.hypot(a, b);
  const hue = chroma < 0.0005 ? 0 : (Math.atan2(b, a) * 180) / Math.PI;
  return format(l, chroma, (hue + 360) % 360, rgb.alpha);
}

function format(l: number, c: number, h: number, alpha?: string): string {
  const trim = (n: number, digits: number) => String(Number(n.toFixed(digits)));
  const tail = alpha ? ` ${alpha.replace(/\s+/g, ' ').trim()}` : '';
  return `oklch(${trim(l, 3)} ${trim(c, 3)} ${trim(h, 0)}${tail})`;
}

function parseRgb(color: string): { r: number; g: number; b: number; alpha?: string } | null {
  const hex = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(color);
  if (hex) {
    const digits =
      hex[1]!.length === 3 ? hex[1]!.split('').map((d) => d + d) : hex[1]!.match(/../g)!;
    const [r, g, b] = digits.map((d) => parseInt(d, 16));
    return { r: r!, g: g!, b: b! };
  }
  const match =
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*([\d.]+%?))?\s*\)$/i.exec(color);
  if (match) return { r: +match[1]!, g: +match[2]!, b: +match[3]!, alpha: alphaOf(match[4]) };
  const srgb =
    /^color\(\s*srgb\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/i.exec(
      color,
    );
  if (!srgb) return null;
  return {
    r: +srgb[1]! * 255,
    g: +srgb[2]! * 255,
    b: +srgb[3]! * 255,
    alpha: alphaOf(srgb[4]),
  };
}

function alphaOf(alpha: string | undefined): string | undefined {
  return alpha && alpha !== '1' && alpha !== '100%' ? `/ ${alpha}` : undefined;
}

/** sRGB 0–255 → OKLab (Björn Ottosson's reference matrices). */
function srgbToOklab(r8: number, g8: number, b8: number): [number, number, number] {
  const linear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = [linear(r8), linear(g8), linear(b8)];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
