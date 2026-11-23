import { fontFaceKey } from './register-font-face';
import type { DefineFontsInput, DefineFontsResult, FontFaceDefinition } from './types';

const FONT_SLOTS = ['body', 'display', 'mono'] as const;

function fontStack(families: string[], fallback: string): string {
  return [...families.map((family) => JSON.stringify(family)), fallback].join(', ');
}

/**
 * Builds `fontFamily` tokens and the `@font-face` list for a font pairing. A slot's `face`
 * may be one face or several (e.g. upright + italic files of one family); slots that share
 * a family (body and display both Allo) register each face once. `metricFallback` adds a
 * metric-matched local face to the stack between the webfont and the generic fallback.
 */
export function defineFonts(input: DefineFontsInput): DefineFontsResult {
  const fonts: FontFaceDefinition[] = [];
  const seen = new Set<string>();
  const fontFamily: DefineFontsResult['tokens']['fontFamily'] = {};

  for (const slot of FONT_SLOTS) {
    const config = input[slot];
    if (!config) continue;
    const faces = [
      ...(Array.isArray(config.face) ? config.face : [config.face]),
      ...(config.metricFallback ? [config.metricFallback] : []),
    ];
    for (const face of faces) {
      const key = fontFaceKey(face);
      if (seen.has(key)) continue;
      seen.add(key);
      fonts.push(face);
    }
    const families = [faces[0]!.family];
    if (config.metricFallback) families.push(config.metricFallback.family);
    fontFamily[slot] = fontStack(families, config.fallback);
  }

  return { fonts, tokens: { fontFamily } };
}
