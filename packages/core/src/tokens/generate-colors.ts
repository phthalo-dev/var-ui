import { color } from 'typestyles/color';
import { contrastRatio, generateRamp, parseColor } from 'typestyles/color-scale';
import { darkSyntaxValues, lightSyntaxValues } from './defaults/color';
import { paletteHue } from './defaults/color/palette';
import { buildToneFace, createToneFace } from './tone-face';
import type { ColorTokenPatch, DesignTokens } from './types';

export type NeutralStyle = 'neutral' | 'cool' | 'warm';
export type ColorContrast = 'standard' | 'high';

export type GenerateColorsInput = {
  accent: string;
  neutralStyle?: NeutralStyle;
  contrast?: ColorContrast;
};

/** Mode-aware semantic color tree for `createDesignTheme` / `Theme.override` `tokens.color`. */
export type GenerateColorsResult = ColorTokenPatch;

/**
 * Calibration notes (`#0064E0`, standard contrast, neutral style):
 * - Light `tone.accent.foreground` lands near palette `sky-7`; dark accent mirrors to ~`blue-4`.
 * - Hand-authored defaults use palette neutrals and soft elevation shadows — generated
 *   neutrals are ramp-based OKLCH from the accent hue.
 * - Dark `tone.danger.background` / `tone.success.background` use ramp step 7 (not mirrored)
 *   to keep `foregroundOnBackground` above 4.5:1.
 */
const ACCENT_CHROMA_MIN = 0.08;
const NEUTRAL_CHROMA = 0.015;
const SEMANTIC_CHROMA = {
  danger: 0.21,
  success: 0.19,
  warning: 0.17,
  info: 0.22,
} as const;

type Ramp = readonly string[];

const LIGHT_SLOTS = {
  background: {
    app: 1,
    surface: 1,
    subtle: 2,
    elevated: 1,
    popover: 1,
    muted: 2,
    secondary: 2,
    tertiary: 3,
  },
  text: { primary: 10, secondary: 7 },
  border: { default: 4, strong: 5, focus: 5, subtle: 2 },
  tone: {
    accent: { foreground: 7, background: 7, linkHover: 8 },
    danger: { foreground: 7, background: 8 },
    success: { foreground: 7, background: 8 },
    warning: { foreground: 7, background: 8 },
    info: { foreground: 7, background: 7 },
  },
} as const;

function rampAt(ramp: Ramp, step: number): string {
  return ramp[step - 1];
}

function mirrorStep(step: number): number {
  return 11 - step;
}

function mode(light: string, dark: string) {
  return { light, dark };
}

function resolveNeutralHue(style: NeutralStyle, accentHue: number): number {
  if (style === 'cool') return 250;
  if (style === 'warm') return 70;
  return accentHue;
}

function resolveLightnessRange(contrast: ColorContrast): [number, number] {
  return contrast === 'high' ? [12, 99] : [22, 97];
}

function toneAnchors(
  neutral: Ramp,
  accent: Ramp,
  danger: Ramp,
  success: Ramp,
  warning: Ramp,
  info: Ramp,
  modeName: 'light' | 'dark',
) {
  const m = modeName === 'light' ? (step: number) => step : mirrorStep;
  const slots = LIGHT_SLOTS.tone;
  const onFilledFallback = rampAt(neutral, 10);

  return {
    accent: {
      foreground: rampAt(accent, m(slots.accent.foreground)),
      background: rampAt(accent, m(slots.accent.background)),
      onFilledFallback,
    },
    danger: {
      foreground: rampAt(danger, m(slots.danger.foreground)),
      background:
        modeName === 'light' ? rampAt(danger, slots.danger.background) : rampAt(danger, 7),
      onFilledFallback,
    },
    success: {
      foreground: rampAt(success, m(slots.success.foreground)),
      background:
        modeName === 'light' ? rampAt(success, slots.success.background) : rampAt(success, 7),
      onFilledFallback,
    },
    warning: {
      foreground: rampAt(warning, m(slots.warning.foreground)),
      background: rampAt(warning, m(slots.warning.background)),
      onFilledFallback,
    },
    info: {
      foreground: rampAt(info, m(slots.info.foreground)),
      background: rampAt(info, m(slots.info.background)),
      onFilledFallback,
    },
  };
}

function mapModeAwareColors(
  neutral: Ramp,
  accent: Ramp,
  danger: Ramp,
  success: Ramp,
  warning: Ramp,
  info: Ramp,
): ColorTokenPatch {
  const slots = LIGHT_SLOTS;
  const m = mirrorStep;
  const lightTone = toneAnchors(neutral, accent, danger, success, warning, info, 'light');
  const darkTone = toneAnchors(neutral, accent, danger, success, warning, info, 'dark');

  return {
    background: {
      app: mode(rampAt(neutral, slots.background.app), rampAt(neutral, m(slots.background.app))),
      surface: mode(
        rampAt(neutral, slots.background.surface),
        rampAt(neutral, m(slots.background.surface)),
      ),
      subtle: mode(
        rampAt(neutral, slots.background.subtle),
        rampAt(neutral, m(slots.background.subtle)),
      ),
      elevated: mode(
        rampAt(neutral, slots.background.elevated),
        rampAt(neutral, m(slots.background.elevated)),
      ),
      popover: mode(
        rampAt(neutral, slots.background.popover),
        rampAt(neutral, m(slots.background.popover)),
      ),
      muted: mode(
        rampAt(neutral, slots.background.muted),
        rampAt(neutral, m(slots.background.muted)),
      ),
      secondary: mode(
        rampAt(neutral, slots.background.secondary),
        rampAt(neutral, m(slots.background.secondary)),
      ),
      tertiary: mode(
        rampAt(neutral, slots.background.tertiary),
        rampAt(neutral, m(slots.background.tertiary)),
      ),
    },
    text: {
      primary: mode(rampAt(neutral, slots.text.primary), rampAt(neutral, m(slots.text.primary))),
      secondary: mode(
        rampAt(neutral, slots.text.secondary),
        rampAt(neutral, m(slots.text.secondary)),
      ),
    },
    tone: {
      accent: createToneFace({ light: lightTone.accent, dark: darkTone.accent }),
      danger: createToneFace({ light: lightTone.danger, dark: darkTone.danger }),
      success: createToneFace({ light: lightTone.success, dark: darkTone.success }),
      warning: createToneFace({ light: lightTone.warning, dark: darkTone.warning }),
      info: createToneFace({ light: lightTone.info, dark: darkTone.info }),
    },
    border: {
      default: mode(
        rampAt(neutral, slots.border.default),
        rampAt(neutral, m(slots.border.default)),
      ),
      strong: mode(rampAt(neutral, slots.border.strong), rampAt(neutral, m(slots.border.strong))),
      focus: mode(rampAt(accent, slots.border.focus), rampAt(accent, m(slots.border.focus))),
      subtle: mode(rampAt(neutral, slots.border.subtle), rampAt(neutral, m(slots.border.subtle))),
    },
    overlay: {
      default: mode(
        color.alpha(rampAt(neutral, 10), 0.55, 'oklch'),
        color.alpha(rampAt(neutral, m(10)), 0.7, 'oklch'),
      ),
      panel: mode(
        rampAt(neutral, slots.background.elevated),
        rampAt(neutral, m(slots.background.elevated)),
      ),
    },
    link: {
      default: mode(lightTone.accent.foreground, darkTone.accent.foreground),
      hover: mode(
        rampAt(accent, slots.tone.accent.linkHover),
        rampAt(accent, m(slots.tone.accent.linkHover)),
      ),
    },
    code: {
      base: mode(lightSyntaxValues.base, darkSyntaxValues.base),
      keyword: mode(lightSyntaxValues.keyword, darkSyntaxValues.keyword),
      title: mode(lightSyntaxValues.title, darkSyntaxValues.title),
      attr: mode(lightSyntaxValues.attr, darkSyntaxValues.attr),
      string: mode(lightSyntaxValues.string, darkSyntaxValues.string),
      builtIn: mode(lightSyntaxValues.builtIn, darkSyntaxValues.builtIn),
      comment: mode(lightSyntaxValues.comment, darkSyntaxValues.comment),
      name: mode(lightSyntaxValues.name, darkSyntaxValues.name),
      section: mode(lightSyntaxValues.section, darkSyntaxValues.section),
      bullet: mode(lightSyntaxValues.bullet, darkSyntaxValues.bullet),
      addition: mode(lightSyntaxValues.addition, darkSyntaxValues.addition),
      additionBackground: mode(
        lightSyntaxValues.additionBackground,
        darkSyntaxValues.additionBackground,
      ),
      deletion: mode(lightSyntaxValues.deletion, darkSyntaxValues.deletion),
      deletionBackground: mode(
        lightSyntaxValues.deletionBackground,
        darkSyntaxValues.deletionBackground,
      ),
    },
  };
}

type ContrastPair = readonly [label: string, foreground: string, background: string];

function scalarTokenValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object' && 'var' in value) {
    const tokenVar = (value as { var: unknown }).var;
    if (typeof tokenVar === 'string') return tokenVar;
  }
  return '';
}

function asColorString(value: DesignTokens['color']['text']['primary']): string {
  return scalarTokenValue(value);
}

function validateContrast(
  modeName: 'light' | 'dark',
  anchors: ReturnType<typeof toneAnchors>,
  backgroundApp: string,
  textPrimary: string,
  textSecondary: string,
  threshold: number,
): void {
  if (process.env.NODE_ENV === 'production') return;

  const accent = buildToneFace(anchors.accent);
  const danger = buildToneFace(anchors.danger);

  const pairs: ContrastPair[] = [
    ['text.primary / background.app', asColorString(textPrimary), asColorString(backgroundApp)],
    ['text.secondary / background.app', asColorString(textSecondary), asColorString(backgroundApp)],
    [
      'tone.accent.foregroundOnBackground / tone.accent.background',
      asColorString(accent.foregroundOnBackground),
      asColorString(accent.background),
    ],
    [
      'tone.danger.foregroundOnBackground / tone.danger.background',
      asColorString(danger.foregroundOnBackground),
      asColorString(danger.background),
    ],
  ];

  for (const [label, foreground, background] of pairs) {
    if (contrastRatio(foreground, background) < threshold) {
      console.warn(
        `[design-system] generateColors (${modeName}): contrast below ${threshold} for ${label}.`,
      );
    }
  }
}

export function generateColors(input: GenerateColorsInput): GenerateColorsResult {
  const neutralStyle = input.neutralStyle ?? 'neutral';
  const contrast = input.contrast ?? 'standard';
  const lightnessRange = resolveLightnessRange(contrast);
  const contrastThreshold = contrast === 'high' ? 7 : 4.5;

  const accentOklch = parseColor(input.accent);
  const neutralHue = resolveNeutralHue(neutralStyle, accentOklch.h);
  const accentChroma = Math.max(accentOklch.c, ACCENT_CHROMA_MIN);

  const rampOpts = { lightnessRange } as const;
  const neutralRamp = generateRamp({ hue: neutralHue, chroma: NEUTRAL_CHROMA, ...rampOpts });
  const accentRamp = generateRamp({ hue: accentOklch.h, chroma: accentChroma, ...rampOpts });
  const dangerRamp = generateRamp({
    hue: paletteHue.red,
    chroma: SEMANTIC_CHROMA.danger,
    ...rampOpts,
  });
  const successRamp = generateRamp({
    hue: paletteHue.green,
    chroma: SEMANTIC_CHROMA.success,
    ...rampOpts,
  });
  const warningRamp = generateRamp({
    hue: paletteHue.amber,
    chroma: SEMANTIC_CHROMA.warning,
    ...rampOpts,
  });
  const infoRamp = generateRamp({
    hue: paletteHue.blue,
    chroma: SEMANTIC_CHROMA.info,
    ...rampOpts,
  });

  const lightTone = toneAnchors(
    neutralRamp,
    accentRamp,
    dangerRamp,
    successRamp,
    warningRamp,
    infoRamp,
    'light',
  );
  const darkTone = toneAnchors(
    neutralRamp,
    accentRamp,
    dangerRamp,
    successRamp,
    warningRamp,
    infoRamp,
    'dark',
  );

  validateContrast(
    'light',
    lightTone,
    rampAt(neutralRamp, LIGHT_SLOTS.background.app),
    rampAt(neutralRamp, LIGHT_SLOTS.text.primary),
    rampAt(neutralRamp, LIGHT_SLOTS.text.secondary),
    contrastThreshold,
  );
  validateContrast(
    'dark',
    darkTone,
    rampAt(neutralRamp, mirrorStep(LIGHT_SLOTS.background.app)),
    rampAt(neutralRamp, mirrorStep(LIGHT_SLOTS.text.primary)),
    rampAt(neutralRamp, mirrorStep(LIGHT_SLOTS.text.secondary)),
    contrastThreshold,
  );

  return mapModeAwareColors(
    neutralRamp,
    accentRamp,
    dangerRamp,
    successRamp,
    warningRamp,
    infoRamp,
  );
}
