import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { atForcedColors } from '../theme/conditions';
import { designTokens as t } from '../tokens';
import { fieldChrome } from '../internal/fieldChrome';
import { focusRing } from '../internal/focusRing';
import { transitionOf } from '../internal/motion';
import { controlSize } from '../shared/variantAxes';
import { semanticTone, toneValues, toneWithDefault, type Tone } from '../shared/semanticTone';

const itemSize = {
  sm: t.size.icon.md.var,
  md: t.size.icon.lg.var,
  lg: `calc(${t.size.icon.lg.var} * 1.25)`,
} as const;

/**
 * Star (or custom icon) rating: `max` native radio inputs, visually replaced by icons.
 *
 * DOM: `root` (field wrapper) > `label`, `group` (`role="radiogroup"` or, read-only,
 * `role="img"`) > `item` (a `<label>` or `<span>`) > `input` + `empty` icon + `fill` clip >
 * `icon`; then `description`, `error`.
 *
 * Fill state: each `item` carries `data-filled` when its value is at or below the rating, and
 * a partially filled star (read-only fractions) sets the `fill` var to a percentage. Hover
 * preview is pure CSS: the hovered item and its preceding siblings fill, the following ones
 * empty, in document order, so RTL needs no mirroring.
 */
export const rating = typestyles.recipe({
  name: 'rating',
  layer: 'components',
  slots: [
    'root',
    'label',
    'description',
    'error',
    'group',
    'item',
    'input',
    'empty',
    'fill',
    'icon',
  ],
  variants: {
    size: controlSize,
    tone: toneWithDefault('accent'),
  },
  vars: {
    filledColor: { ...atProperty.color, value: t.color.tone.accent.foreground.var },
    emptyColor: { ...atProperty.color, value: t.color.border.strong.var },
    labelColor: { ...atProperty.color, value: t.color.text.primary.var },
    descriptionColor: { ...atProperty.color, value: t.color.text.secondary.var },
    errorColor: { ...atProperty.color, value: t.color.tone.danger.foreground.var },
    itemSize: { ...atProperty.length, value: itemSize.md },
    /** Share of one item that is filled (set per item; read-only fractions use values between). */
    fill: { ...atProperty.percentage, value: '0%' },
  },
  styles: ({ vars }) => {
    const chrome = fieldChrome({
      label: vars.labelColor.var,
      description: vars.descriptionColor.var,
      error: vars.errorColor.var,
    });
    return {
      base: {
        ...chrome,
        root: { ...chrome.root, width: 'fit-content' },
        group: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space.xxs.var,
          width: 'fit-content',
          margin: 0,
          padding: 0,
          border: 'none',
          '&[data-disabled]': { opacity: t.opacity.disabled.var, cursor: 'not-allowed' },
        },
        item: {
          position: 'relative',
          display: 'inline-flex',
          flexShrink: 0,
          width: vars.itemSize.var,
          height: vars.itemSize.var,
          borderRadius: t.radius.sm.var,
          color: vars.emptyColor.var,
          cursor: 'pointer',
          [vars.fill.name]: '0%',
          '&[data-filled]': { [vars.fill.name]: '100%' },
          '&:has(> input:focus-visible)': { ...focusRing },
          // Hover preview (document order, so it mirrors in RTL): this item and the ones before it
          // fill, the ones after it empty. Read-only and disabled items take no pointer events.
          '&:hover, &:has(~ :hover)': { [vars.fill.name]: '100%' },
          ':hover ~ &': { [vars.fill.name]: '0%' },
          '&[data-readonly], &[data-disabled]': { cursor: 'default', pointerEvents: 'none' },
          '&[data-disabled]': { cursor: 'not-allowed' },
          ...atForcedColors({ color: 'CanvasText' }),
        },
        input: {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          margin: 0,
          opacity: 0,
          cursor: 'inherit',
          appearance: 'none',
        },
        empty: {
          display: 'inline-flex',
          width: '100%',
          height: '100%',
          '& svg': { width: '100%', height: '100%' },
        },
        fill: {
          position: 'absolute',
          insetBlock: 0,
          insetInlineStart: 0,
          width: vars.fill.var,
          overflow: 'hidden',
          pointerEvents: 'none',
          color: vars.filledColor.var,
          transition: transitionOf('width', 'fast'),
          ...atForcedColors({ color: 'Highlight' }),
        },
        icon: {
          display: 'inline-flex',
          width: vars.itemSize.var,
          height: vars.itemSize.var,
          '& svg': { width: '100%', height: '100%', fill: 'currentColor' },
        },
      },
      variants: {
        size: {
          sm: { root: { [vars.itemSize.name]: itemSize.sm } },
          md: { root: { [vars.itemSize.name]: itemSize.md } },
          lg: { root: { [vars.itemSize.name]: itemSize.lg } },
        },
        tone: Object.fromEntries(
          toneValues.map((key) => [
            key,
            {
              root: {
                [vars.filledColor.name]:
                  key === 'neutral' ? t.color.text.secondary.var : semanticTone[key].foreground,
              },
            },
          ]),
        ) as Record<Tone, { root: Record<string, string> }>,
      },
    };
  },
});

export type RatingVariantProps = RecipeVariants<typeof rating>;
