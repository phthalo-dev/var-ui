import { variant, type VariantOptions } from 'typestyles';
import { designTokens as t } from '../tokens';
import { TONE_KEYS } from '../tokens/schema/color/tone';
import { PALETTE_FAMILIES, type PaletteFamily } from '../tokens/schema/color/palette';

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
export type ToneAppearance = 'solid' | 'outline' | 'subtle' | 'ghost';

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

export function solidHoverColor(background: string): string {
  return `color-mix(in oklch, ${background} 88%, black)`;
}

export function subtleBackgroundColor(foreground: string): string {
  return `color-mix(in srgb, ${foreground} ${subtleMix.surface}, ${t.color.background.surface.var})`;
}

export function subtleBorderColor(foreground: string): string {
  return `color-mix(in srgb, ${foreground} ${subtleMix.border}, ${t.color.border.default.var})`;
}

/** Darken an existing subtle wash — mirrors solid hover (mix toward black). */
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
const surfaceAppearanceValues = ['subtle', 'solid', 'outline'] as const;

export const surfaceAppearance = variant.enum(surfaceAppearanceValues, {
  default: 'subtle',
});

export type SurfaceAppearance = VariantOptions<typeof surfaceAppearance>;

/** Same options as `surfaceAppearance`, with a component-specific default (status-dot: `solid`). */
export function surfaceAppearanceWithDefault<const Default extends SurfaceAppearance>(
  defaultAppearance: Default,
) {
  return variant.enum(surfaceAppearanceValues, { default: defaultAppearance });
}

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
    // Ink fill pulled slightly toward the surface: deep charcoal in light mode, and a soft
    // warm off-white (not a glaring pure-white block) in dark mode.
    [v.solidBg.name]:
      `color-mix(in oklab, ${t.color.text.primary.var} 86%, ${t.color.background.surface.var})`,
    [v.solidFg.name]: t.color.background.surface.var,
  };
}

/** Channel assignments for any shared tone, including `neutral`. */
export function toneChannelAssignments(v: SemanticChannelRefs, key: Tone) {
  if (key === 'neutral') return neutralChannelAssignments(v);
  return semanticChannelAssignments(v, key);
}

/**
 * The warm neutral hover chip the top nav uses: `navItem.hoverBackground` firmed with a touch of
 * ink (alone it all but vanishes on white; an ink wash over `transparent` loses the palette hue).
 */
export const neutralHoverChip = `color-mix(in oklch, ${t.color.navItem.hoverBackground.var}, ${t.color.text.primary.var} 4%)`;

/**
 * Tone channels for controls (button). The ghost hover/open fill is derived from the tone's
 * `semantic` channel in {@link controlAppearancePaint}; neutral ghost controls swap it for the
 * warm nav chip ({@link neutralHoverChip}) with {@link neutralGhostHoverPaint}.
 */
export function controlToneAssignments(v: ControlChannelRefs, key: Tone) {
  return toneChannelAssignments(v, key);
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
    case 'solid':
      return {
        [v.border.name]: v.solidBg.var,
        [v.background.name]: v.solidBg.var,
        [v.foreground.name]: v.solidFg.var,
        [hoverWhenEnabled]: {
          [v.background.name]: solidHoverColor(v.solidBg.var),
          [v.border.name]: solidHoverColor(v.solidBg.var),
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
        // A ghost trigger keeps its hover fill while its popup is open.
        '&[aria-expanded="true"]': {
          [v.background.name]: subtleBackgroundColor(v.semantic.var),
        },
      };
  }
}

/**
 * Neutral ghost controls hover and open in the same warm chip as nav items
 * ({@link neutralHoverChip}), so an icon button beside the top nav matches it instead of taking a
 * grey ink mix. Use as the `style` of a `tone: neutral` × `appearance: ghost` compound variant.
 */
export function neutralGhostHoverPaint(v: Pick<TonePaintRefs, 'background'>) {
  return {
    [hoverWhenEnabled]: { [v.background.name]: neutralHoverChip },
    '&[aria-expanded="true"]': { [v.background.name]: neutralHoverChip },
  };
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
    case 'solid':
      return {
        [v.border.name]: ch.background,
        [v.background.name]: ch.background,
        [v.foreground.name]: ch.foregroundOnBackground,
        [hoverWhenEnabled]: {
          [v.background.name]: solidHoverColor(ch.background),
          [v.border.name]: solidHoverColor(ch.background),
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

/**
 * Identity color axis: every base palette name (`blue`, `red`, `sage`, …). For roles, kinds and
 * labels, not status. `none` (the default) leaves `tone` in charge.
 */
export const hueColor = variant.enum(['none', ...PALETTE_FAMILIES], { default: 'none' });

export type HueColor = PaletteFamily;

/** One style entry per hue (`none` paints nothing). */
export function mapHue<Style>(
  paint: (key: HueColor) => Style,
): Record<HueColor | 'none', Style | Record<string, never>> {
  return {
    none: {},
    ...(Object.fromEntries(PALETTE_FAMILIES.map((key) => [key, paint(key)])) as Record<
      HueColor,
      Style
    >),
  };
}

/** Channels for a named hue: ink and fill are the hue, solid text is the surface. */
export function hueChannelAssignments(v: SemanticChannelRefs, key: HueColor) {
  const hue = t.color.hue[key].var;
  return {
    [v.semantic.name]: hue,
    [v.solidBg.name]: hue,
    [v.solidFg.name]: t.color.background.surface.var,
  };
}
