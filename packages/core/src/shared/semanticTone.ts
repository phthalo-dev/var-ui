import { variant, type VariantOptions } from 'typestyles';
import { designTokens as t } from '../tokens';
import { TONE_KEYS } from '../tokens/schema/color/tone';

/**
 * Every component tone. `neutral` sits outside the color tokens; the rest are
 * `TONE_KEYS`, so a new token tone has to be styled wherever this axis is used.
 * Each name paints that token. There is no `tip` alias.
 */
export const toneValues = ['neutral', ...TONE_KEYS] as const;

/** Shared tone axis. Default is `neutral` (badge, button, chip, status). */
export const tone = variant.enum(toneValues, { default: 'neutral' });

export type Tone = VariantOptions<typeof tone>;

/** Same options as `tone`, with a component-specific default. */
export function toneWithDefault<const Default extends Tone>(defaultTone: Default) {
  return variant.enum(toneValues, { default: defaultTone });
}

/** Chromatic keys. Indexes `t.color.tone`. */
export type SemanticToneKey = Exclude<Tone, 'neutral'>;

/** Cross-component appearance axis (Mantine-style variants mapped to var-ui naming). */
export type ToneAppearance = 'filled' | 'outline' | 'subtle' | 'ghost';

/** Default subtle tint (matches `tone.*.subtleBackground` token generation). */
export const subtleMix = {
  surface: '12%',
  border: '38%',
} as const;

/** Stronger tint for outline hover (appears from transparent). */
export const subtleHoverMix = {
  surface: '18%',
} as const;

/** Hover paint only when the control is not disabled (pairs with button `&[disabled]`). */
const hoverWhenEnabled = '&:hover:not([disabled])';

export function filledHoverColor(background: string): string {
  return `color-mix(in oklch, ${background} 88%, black)`;
}

export function subtleBackgroundColor(foreground: string): string {
  return `color-mix(in srgb, ${foreground} ${subtleMix.surface}, ${t.color.background.surface.var})`;
}

export function subtleBorderColor(foreground: string): string {
  return `color-mix(in srgb, ${foreground} ${subtleMix.border}, ${t.color.border.default.var})`;
}

/** Darken an existing subtle wash — mirrors filled hover (mix toward black). */
export function subtleHoverBackground(foreground: string): string {
  return `color-mix(in oklch, ${subtleBackgroundColor(foreground)} 88%, black)`;
}

/** Tint used when outline/ghost surfaces pick up a subtle fill on hover. */
export function subtleHoverTint(foreground: string): string {
  return `color-mix(in srgb, ${foreground} ${subtleHoverMix.surface}, ${t.color.background.surface.var})`;
}

function isNeutralSemantic(semanticVar: string): boolean {
  return semanticVar === t.color.text.primary.var;
}

function toneChannels(key: SemanticToneKey) {
  const tone = t.color.tone[key];
  return {
    foreground: tone.foreground.var,
    background: tone.background.var,
    foregroundOnBackground: tone.foregroundOnBackground.var,
    subtleBackground: tone.subtleBackground.var,
    border: tone.border.var,
  };
}

export const semanticTone = {
  accent: toneChannels('accent'),
  success: toneChannels('success'),
  warning: toneChannels('warning'),
  danger: toneChannels('danger'),
  info: toneChannels('info'),
} as const;

type SemanticChannelRefs = {
  semantic: { name: string };
  solidBg: { name: string };
  solidFg: { name: string };
};

type ControlChannelRefs = {
  semantic: { name: string; var: string };
  solidBg: { name: string; var: string };
  solidFg: { name: string; var: string };
};

type TonePaintRefs = {
  border: { name: string };
  background: { name: string };
  foreground: { name: string };
};

type ControlPaintRefs = TonePaintRefs & ControlChannelRefs;

type SurfacePaintRefs = {
  semantic: { var: string };
  solidBg: { var: string };
  solidFg: { var: string };
};

/** Surface appearances for alert, badge, chip, banner, and toast. */
export const surfaceAppearance = variant.enum(['subtle', 'solid', 'outline'], {
  default: 'subtle',
});

export type SurfaceAppearance = VariantOptions<typeof surfaceAppearance>;

/** Root custom properties for a component `tone` (solid + inherited semantic for subtle / title). */
export function semanticChannelAssignments(v: SemanticChannelRefs, key: SemanticToneKey) {
  const ch = semanticTone[key];
  return {
    [v.semantic.name]: ch.foreground,
    [v.solidBg.name]: ch.background,
    [v.solidFg.name]: ch.foregroundOnBackground,
  };
}

/** Neutral tone channels for button, badge, and other controls. */
export function neutralChannelAssignments(v: SemanticChannelRefs) {
  return {
    [v.semantic.name]: t.color.text.primary.var,
    [v.solidBg.name]: t.color.text.primary.var,
    [v.solidFg.name]: t.color.background.surface.var,
  };
}

/** Channel assignments for any shared tone, including `neutral`. */
export function toneChannelAssignments(v: SemanticChannelRefs, key: Tone) {
  if (key === 'neutral') return neutralChannelAssignments(v);
  return semanticChannelAssignments(v, key);
}

/** One style entry per shared tone. */
export function mapTone<Style>(paint: (key: Tone) => Style): Record<Tone, Style> {
  return Object.fromEntries(toneValues.map((key) => [key, paint(key)])) as Record<Tone, Style>;
}

/**
 * Applies `appearance` to border/background/foreground using channel vars set by `tone`.
 * Used by button (and any control sharing the same var layout as badge).
 */
export function controlAppearancePaint(v: ControlPaintRefs, appearance: ToneAppearance) {
  switch (appearance) {
    case 'filled':
      return {
        [v.border.name]: v.solidBg.var,
        [v.background.name]: v.solidBg.var,
        [v.foreground.name]: v.solidFg.var,
        [hoverWhenEnabled]: {
          [v.background.name]: filledHoverColor(v.solidBg.var),
          [v.border.name]: filledHoverColor(v.solidBg.var),
        },
      };
    case 'outline':
      return {
        [v.border.name]: subtleBorderColor(v.semantic.var),
        [v.background.name]: 'transparent',
        [v.foreground.name]: v.semantic.var,
        [hoverWhenEnabled]: {
          [v.background.name]: subtleHoverTint(v.semantic.var),
          [v.border.name]: v.semantic.var,
        },
      };
    case 'subtle':
      if (isNeutralSemantic(v.semantic.var)) {
        return {
          [v.border.name]: t.color.border.default.var,
          [v.background.name]: t.color.background.surface.var,
          [v.foreground.name]: v.semantic.var,
          [hoverWhenEnabled]: {
            [v.border.name]: t.color.border.strong.var,
          },
        };
      }
      return {
        [v.border.name]: subtleBorderColor(v.semantic.var),
        [v.background.name]: subtleBackgroundColor(v.semantic.var),
        [v.foreground.name]: v.semantic.var,
        [hoverWhenEnabled]: {
          [v.border.name]: v.semantic.var,
        },
      };
    case 'ghost':
      return {
        [v.border.name]: 'transparent',
        [v.background.name]: 'transparent',
        [v.foreground.name]: v.semantic.var,
        [hoverWhenEnabled]: {
          [v.background.name]: subtleBackgroundColor(v.semantic.var),
        },
      };
  }
}

/** Resolve tokenized subtle background from a tone foreground channel var. */
function toneSubtleBackgroundFor(foregroundVar: string): string {
  for (const key of Object.keys(semanticTone) as SemanticToneKey[]) {
    const ch = semanticTone[key];
    if (ch.foreground === foregroundVar) return ch.subtleBackground;
  }
  return subtleBackgroundColor(foregroundVar);
}

/** Resolve tokenized border from a tone foreground channel var. */
function toneBorderFor(foregroundVar: string): string {
  for (const key of Object.keys(semanticTone) as SemanticToneKey[]) {
    const ch = semanticTone[key];
    if (ch.foreground === foregroundVar) return ch.border;
  }
  return foregroundVar;
}

/**
 * Central tone × appearance resolver for bordered controls (button, badge, etc.).
 * Assigns border/background/foreground custom properties and hover recipes.
 */
export function tonePaint(v: TonePaintRefs, key: SemanticToneKey, appearance: ToneAppearance) {
  const ch = semanticTone[key];
  switch (appearance) {
    case 'filled':
      return {
        [v.border.name]: ch.background,
        [v.background.name]: ch.background,
        [v.foreground.name]: ch.foregroundOnBackground,
        [hoverWhenEnabled]: {
          [v.background.name]: filledHoverColor(ch.background),
          [v.border.name]: filledHoverColor(ch.background),
        },
      };
    case 'outline':
      return {
        [v.border.name]: ch.foreground,
        [v.background.name]: 'transparent',
        [v.foreground.name]: ch.foreground,
        [hoverWhenEnabled]: {
          [v.background.name]: ch.subtleBackground,
          [v.border.name]: ch.foreground,
        },
      };
    case 'subtle':
      return {
        [v.border.name]: subtleBorderColor(ch.foreground),
        [v.background.name]: subtleBackgroundColor(ch.foreground),
        [v.foreground.name]: ch.foreground,
        [hoverWhenEnabled]: {
          [v.border.name]: ch.foreground,
        },
      };
    case 'ghost':
      return {
        [v.border.name]: 'transparent',
        [v.background.name]: 'transparent',
        [v.foreground.name]: ch.foreground,
        [hoverWhenEnabled]: {
          [v.background.name]: subtleBackgroundColor(ch.foreground),
        },
      };
  }
}

/** Multi-slot surface paint for alert/banner/toast `appearance` (reads vars set by `tone`). */
export function appearanceSurface(
  v: SurfacePaintRefs,
  appearance: SurfaceAppearance,
  options?: { includeBorder?: boolean },
) {
  const includeBorder = options?.includeBorder ?? true;
  if (appearance === 'solid') {
    return {
      backgroundColor: v.solidBg.var,
      color: v.solidFg.var,
      ...(includeBorder
        ? {
            borderWidth: t.borderWidth.default.var,
            borderStyle: 'solid',
            borderColor: v.solidBg.var,
          }
        : {}),
    };
  }
  if (appearance === 'outline') {
    return {
      backgroundColor: 'transparent',
      color: t.color.text.primary.var,
      ...(includeBorder
        ? {
            borderWidth: t.borderWidth.default.var,
            borderStyle: 'solid',
            borderColor: v.semantic.var,
          }
        : {
            borderBlockWidth: t.borderWidth.default.var,
            borderBlockStyle: 'solid',
            borderBlockColor: v.semantic.var,
          }),
    };
  }
  const subtleBg = toneSubtleBackgroundFor(v.semantic.var);
  const subtleBorder = toneBorderFor(v.semantic.var);
  return {
    backgroundColor: subtleBg,
    color: t.color.text.primary.var,
    ...(includeBorder
      ? {
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: subtleBorder,
        }
      : {
          borderBlockWidth: t.borderWidth.default.var,
          borderBlockStyle: 'solid',
          borderBlockColor: subtleBorder,
        }),
  };
}
