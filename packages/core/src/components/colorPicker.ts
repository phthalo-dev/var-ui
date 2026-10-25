import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from './focusRing';
import { controlSize } from '../shared/variantAxes';

/**
 * HSV color picker panel: saturation/value area, hue slider, optional alpha
 * slider, and preset swatches. Pair with `ColorPicker` in React.
 */
export const colorPicker = typestyles.recipe({
  name: 'color-picker',
  layer: 'components',
  slots: [
    'root',
    'saturation',
    'saturationThumb',
    'hue',
    'hueThumb',
    'alpha',
    'alphaThumb',
    'alphaGradient',
    'swatches',
    'swatch',
  ],
  variants: {
    swatchColumns: variant.enum(['seven', 'ten'], { default: 'seven' }),
  },
  vars: {
    panelHeight: { ...atProperty.length, value: '10rem' },
    sliderHeight: { ...atProperty.length, value: '0.75rem' },
    thumbSize: { ...atProperty.length, value: '0.875rem' },
    border: { ...atProperty.color, value: t.color.border.default.var },
    thumbBorder: { ...atProperty.color, value: t.color.background.surface.var },
    thumbShadow: { value: t.shadow.sm.var, syntax: '*', initial: 'none' },
    swatchSize: { ...atProperty.length, value: '1.25rem' },
    swatchSelectedRing: { ...atProperty.color, value: t.color.border.focus.var },
    checkerLight: { ...atProperty.color, value: t.color.background.subtle.var },
    checkerDark: { ...atProperty.color, value: t.color.border.subtle.var },
    hueColor: { ...atProperty.color, value: '#ff0000' },
    saturationThumbX: { ...atProperty.percentage, value: '0%' },
    saturationThumbY: { ...atProperty.percentage, value: '100%' },
    thumbColor: { ...atProperty.color, value: '#ff0000' },
    hueThumbX: { ...atProperty.percentage, value: '0%' },
    alphaColor: { ...atProperty.color, value: '#ff0000' },
    alphaThumbX: { ...atProperty.percentage, value: '100%' },
    swatchColor: { ...atProperty.color, value: 'transparent' },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'grid',
          gap: t.space[3].var,
          width: '100%',
          minWidth: '220px',
        },
        saturation: {
          position: 'relative',
          width: '100%',
          height: vars.panelHeight.var,
          borderRadius: t.radius.md.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.border.var,
          cursor: 'crosshair',
          touchAction: 'none',
          overflow: 'hidden',
          backgroundColor: vars.hueColor.var,
          backgroundImage:
            'linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)',
        },
        saturationThumb: {
          position: 'absolute',
          left: vars.saturationThumbX.var,
          top: vars.saturationThumbY.var,
          backgroundColor: vars.thumbColor.var,
          width: vars.thumbSize.var,
          height: vars.thumbSize.var,
          marginInlineStart: `calc(${vars.thumbSize.var} / -2)`,
          marginTop: `calc(${vars.thumbSize.var} / -2)`,
          borderRadius: t.radius.full.var,
          borderWidth: t.borderWidth.thick.var,
          borderStyle: 'solid',
          borderColor: vars.thumbBorder.var,
          boxShadow: vars.thumbShadow.var,
          pointerEvents: 'none',
          boxSizing: 'border-box',
        },
        hue: {
          position: 'relative',
          width: '100%',
          height: vars.sliderHeight.var,
          borderRadius: t.radius.full.var,
          cursor: 'pointer',
          touchAction: 'none',
          backgroundImage:
            'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
        },
        hueThumb: {
          position: 'absolute',
          top: '50%',
          width: vars.thumbSize.var,
          height: vars.thumbSize.var,
          marginInlineStart: `calc(${vars.thumbSize.var} / -2)`,
          marginTop: `calc(${vars.thumbSize.var} / -2)`,
          borderRadius: t.radius.full.var,
          borderWidth: t.borderWidth.thick.var,
          borderStyle: 'solid',
          borderColor: vars.thumbBorder.var,
          boxShadow: vars.thumbShadow.var,
          pointerEvents: 'none',
          boxSizing: 'border-box',
          left: vars.hueThumbX.var,
          backgroundColor: t.color.background.surface.var,
        },
        alpha: {
          position: 'relative',
          width: '100%',
          height: vars.sliderHeight.var,
          borderRadius: t.radius.full.var,
          cursor: 'pointer',
          touchAction: 'none',
          backgroundColor: vars.checkerLight.var,
          backgroundImage: `linear-gradient(45deg, ${vars.checkerDark.var} 25%, transparent 25%, transparent 75%, ${vars.checkerDark.var} 75%, ${vars.checkerDark.var}), linear-gradient(45deg, ${vars.checkerDark.var} 25%, transparent 25%, transparent 75%, ${vars.checkerDark.var} 75%, ${vars.checkerDark.var})`,
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 4px 4px',
          overflow: 'hidden',
        },
        alphaGradient: {
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          backgroundImage: `linear-gradient(to right, transparent, ${vars.alphaColor.var})`,
        },
        alphaThumb: {
          position: 'absolute',
          top: '50%',
          width: vars.thumbSize.var,
          height: vars.thumbSize.var,
          marginInlineStart: `calc(${vars.thumbSize.var} / -2)`,
          marginTop: `calc(${vars.thumbSize.var} / -2)`,
          borderRadius: t.radius.full.var,
          borderWidth: t.borderWidth.thick.var,
          borderStyle: 'solid',
          borderColor: vars.thumbBorder.var,
          boxShadow: vars.thumbShadow.var,
          pointerEvents: 'none',
          boxSizing: 'border-box',
          left: vars.alphaThumbX.var,
          backgroundColor: t.color.background.surface.var,
        },
        swatches: {
          display: 'grid',
          gap: t.space[1].var,
        },
        swatch: {
          width: vars.swatchSize.var,
          height: vars.swatchSize.var,
          borderRadius: t.radius.sm.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.border.var,
          padding: 0,
          cursor: 'pointer',
          boxSizing: 'border-box',
          backgroundColor: vars.swatchColor.var,
          '&[data-selected]': {
            outline: `2px solid ${vars.swatchSelectedRing.var}`,
            outlineOffset: '1px',
          },
          '&:focus-visible': {
            ...focusRing,
          },
        },
      },
      variants: {
        swatchColumns: {
          seven: { swatches: { gridTemplateColumns: 'repeat(7, 1fr)' } },
          ten: { swatches: { gridTemplateColumns: 'repeat(10, 1fr)' } },
        },
      },
    };
  },
});

/**
 * Standalone color swatch chip — display or selection affordance.
 */
export const colorSwatch = typestyles.recipe({
  name: 'color-swatch',
  layer: 'components',
  slots: ['root'],
  variants: {
    size: controlSize,
  },
  vars: {
    size: { ...atProperty.length, value: '1.5rem' },
    border: { ...atProperty.color, value: t.color.border.default.var },
    selectedRing: { ...atProperty.color, value: t.color.border.focus.var },
    color: { ...atProperty.color, value: 'transparent' },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'inline-block',
          width: vars.size.var,
          height: vars.size.var,
          borderRadius: t.radius.sm.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.border.var,
          backgroundColor: vars.color.var,
          boxSizing: 'border-box',
          '&[data-selected]': {
            outline: `2px solid ${vars.selectedRing.var}`,
            outlineOffset: '1px',
          },
        },
      },
      variants: {
        size: {
          sm: { root: { [vars.size.name]: '1rem' } },
          md: {},
          lg: { root: { [vars.size.name]: '2rem' } },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type ColorPickerVariantProps = RecipeVariants<typeof colorPicker>;

/** Visual props derived from the schema. */
export type ColorSwatchVariantProps = RecipeVariants<typeof colorSwatch>;
