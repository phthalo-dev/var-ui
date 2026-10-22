import { alpha } from 'typestyles/color';
import { contrastRatio } from 'typestyles/color-scale';
import type { DesignTokens } from './types';

const WHITE = 'oklch(100% 0 0)';

export const TONE_SUBTLE_ALPHA = 0.12;
export const TONE_BORDER_ALPHA = 0.38;

export type ToneFaceInput = {
  foreground: string;
  background: string;
  /** Text on `background` when contrast against white is insufficient. */
  onFilledFallback?: string;
  /** Filled-surface text; computed from `background` when omitted and resolvable. */
  foregroundOnBackground?: string;
};

export type ToneFaceModeInput = {
  light: ToneFaceInput;
  dark: ToneFaceInput;
};

export type ToneFaceValues = DesignTokens['color']['tone']['accent'];

export type ModeAwareToneFaceValues = {
  [K in keyof ToneFaceValues]?: {
    light?: string;
    dark?: string;
  };
};

function isResolvableColor(value: string): boolean {
  return !value.startsWith('var(');
}

/** Resolve accessible text on a filled tone background. */
export function onBackground(background: string, onFilledFallback: string): string {
  return contrastRatio(WHITE, background) >= 4.5 ? WHITE : onFilledFallback;
}

/** Build a single-mode tone face from ramp foreground/background anchors. */
export function buildToneFace(
  input: ToneFaceInput,
  options?: { subtleAlpha?: number; borderAlpha?: number },
): ToneFaceValues {
  const subtleAlpha = options?.subtleAlpha ?? TONE_SUBTLE_ALPHA;
  const borderAlpha = options?.borderAlpha ?? TONE_BORDER_ALPHA;
  const onFilledFallback = input.onFilledFallback ?? input.foreground;
  const foregroundOnBackground =
    input.foregroundOnBackground ??
    (isResolvableColor(input.background)
      ? onBackground(input.background, onFilledFallback)
      : onFilledFallback);

  return {
    background: input.background,
    foreground: input.foreground,
    subtleBackground: alpha(input.foreground, subtleAlpha, 'oklch'),
    border: alpha(input.foreground, borderAlpha, 'oklch'),
    foregroundOnBackground,
  };
}

function scalarTokenValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object' && 'var' in value) {
    const tokenVar = (value as { var: unknown }).var;
    if (typeof tokenVar === 'string') return tokenVar;
  }
  return '';
}

function toneFaceValueToString(value: ToneFaceValues[keyof ToneFaceValues]): string {
  return scalarTokenValue(value);
}

/** Build a mode-aware tone face with `{ light, dark }` on every token. */
export function createToneFace(
  input: ToneFaceModeInput,
  options?: { subtleAlpha?: number; borderAlpha?: number },
): ModeAwareToneFaceValues {
  const light = buildToneFace(input.light, options);
  const dark = buildToneFace(input.dark, options);

  return {
    background: {
      light: toneFaceValueToString(light.background),
      dark: toneFaceValueToString(dark.background),
    },
    foreground: {
      light: toneFaceValueToString(light.foreground),
      dark: toneFaceValueToString(dark.foreground),
    },
    subtleBackground: {
      light: toneFaceValueToString(light.subtleBackground),
      dark: toneFaceValueToString(dark.subtleBackground),
    },
    border: {
      light: toneFaceValueToString(light.border),
      dark: toneFaceValueToString(dark.border),
    },
    foregroundOnBackground: {
      light: toneFaceValueToString(light.foregroundOnBackground),
      dark: toneFaceValueToString(dark.foregroundOnBackground),
    },
  };
}

export type ModeAwareToneTokens = DesignTokens['color']['tone'];
