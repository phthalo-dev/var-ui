import { typestyles } from '../runtime';
import type { FontFaceDefinition } from './types';

const registered = new Set<string>();

export function fontFaceKey(face: FontFaceDefinition): string {
  const src = Array.isArray(face.src) ? face.src.join('|') : face.src;
  return [face.family, face.fontWeight ?? '', face.fontStyle ?? '', src].join('\0');
}

export function registerFontFace(face: FontFaceDefinition): void {
  const key = fontFaceKey(face);
  if (registered.has(key)) return;
  registered.add(key);

  typestyles.global.fontFace(face.family, {
    src: face.src,
    fontWeight: face.fontWeight,
    fontStyle: face.fontStyle,
    fontDisplay: face.fontDisplay,
    unicodeRange: face.unicodeRange,
    sizeAdjust: face.sizeAdjust,
    ascentOverride: face.ascentOverride,
    descentOverride: face.descentOverride,
    lineGapOverride: face.lineGapOverride,
  });
}

/** Clears dedup registry — for tests only. */
export function resetRegisteredFontFaces(): void {
  registered.clear();
}
