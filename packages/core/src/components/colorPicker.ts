import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * HSV color picker panel: saturation/value area, hue slider, optional alpha
 * slider, and preset swatches. Pair with `ColorPicker` in React.
 */
export const colorPicker = typestyles.recipe(
  'color-picker',
  (c) => {
    const v = c.vars({
      panelHeight: { value: '10rem', syntax: '<length>' },
      sliderHeight: { value: '0.75rem', syntax: '<length>' },
      thumbSize: { value: '0.875rem', syntax: '<length>' },
      border: { value: t.color.border.default.var, syntax: '<color>' },
      thumbBorder: { value: t.color.background.surface.var, syntax: '<color>' },
      thumbShadow: { value: t.shadow.sm.var, syntax: '*', initial: 'none' },
      swatchSize: { value: '1.25rem', syntax: '<length>' },
      swatchSelectedRing: { value: t.color.border.focus.var, syntax: '<color>' },
      checkerLight: { value: t.color.background.subtle.var, syntax: '<color>' },
      checkerDark: { value: t.color.border.subtle.var, syntax: '<color>' },
    });
    return {
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
          height: v.panelHeight.var,
          borderRadius: t.radius.md.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.border.var,
          cursor: 'crosshair',
          touchAction: 'none',
          overflow: 'hidden',
        },
        saturationThumb: {
          position: 'absolute',
          width: v.thumbSize.var,
          height: v.thumbSize.var,
          marginInlineStart: `calc(${v.thumbSize.var} / -2)`,
          marginTop: `calc(${v.thumbSize.var} / -2)`,
          borderRadius: t.radius.full.var,
          borderWidth: t.borderWidth.thick.var,
          borderStyle: 'solid',
          borderColor: v.thumbBorder.var,
          boxShadow: v.thumbShadow.var,
          pointerEvents: 'none',
          boxSizing: 'border-box',
        },
        hue: {
          position: 'relative',
          width: '100%',
          height: v.sliderHeight.var,
          borderRadius: t.radius.full.var,
          cursor: 'pointer',
          touchAction: 'none',
          backgroundImage:
            'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
        },
        hueThumb: {
          position: 'absolute',
          top: '50%',
          width: v.thumbSize.var,
          height: v.thumbSize.var,
          marginInlineStart: `calc(${v.thumbSize.var} / -2)`,
          marginTop: `calc(${v.thumbSize.var} / -2)`,
          borderRadius: t.radius.full.var,
          borderWidth: t.borderWidth.thick.var,
          borderStyle: 'solid',
          borderColor: v.thumbBorder.var,
          boxShadow: v.thumbShadow.var,
          pointerEvents: 'none',
          boxSizing: 'border-box',
          backgroundColor: t.color.background.surface.var,
        },
        alpha: {
          position: 'relative',
          width: '100%',
          height: v.sliderHeight.var,
          borderRadius: t.radius.full.var,
          cursor: 'pointer',
          touchAction: 'none',
          backgroundColor: v.checkerLight.var,
          backgroundImage: `linear-gradient(45deg, ${v.checkerDark.var} 25%, transparent 25%, transparent 75%, ${v.checkerDark.var} 75%, ${v.checkerDark.var}), linear-gradient(45deg, ${v.checkerDark.var} 25%, transparent 25%, transparent 75%, ${v.checkerDark.var} 75%, ${v.checkerDark.var})`,
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 4px 4px',
          overflow: 'hidden',
        },
        alphaGradient: {
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
        },
        alphaThumb: {
          position: 'absolute',
          top: '50%',
          width: v.thumbSize.var,
          height: v.thumbSize.var,
          marginInlineStart: `calc(${v.thumbSize.var} / -2)`,
          marginTop: `calc(${v.thumbSize.var} / -2)`,
          borderRadius: t.radius.full.var,
          borderWidth: t.borderWidth.thick.var,
          borderStyle: 'solid',
          borderColor: v.thumbBorder.var,
          boxShadow: v.thumbShadow.var,
          pointerEvents: 'none',
          boxSizing: 'border-box',
          backgroundColor: t.color.background.surface.var,
        },
        swatches: {
          display: 'grid',
          gap: t.space[1].var,
        },
        swatch: {
          width: v.swatchSize.var,
          height: v.swatchSize.var,
          borderRadius: t.radius.sm.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.border.var,
          padding: 0,
          cursor: 'pointer',
          boxSizing: 'border-box',
          '&[data-selected]': {
            outline: `2px solid ${v.swatchSelectedRing.var}`,
            outlineOffset: '1px',
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
          },
        },
      },
      variants: {
        swatchColumns: {
          seven: { swatches: { gridTemplateColumns: 'repeat(7, 1fr)' } },
          ten: { swatches: { gridTemplateColumns: 'repeat(10, 1fr)' } },
        },
      },
      defaultVariants: { swatchColumns: 'seven' },
    };
  },
  { layer: 'components' },
);

/**
 * Standalone color swatch chip — display or selection affordance.
 */
export const colorSwatch = typestyles.recipe(
  'color-swatch',
  (c) => {
    const v = c.vars({
      size: { value: '1.5rem', syntax: '<length>' },
      border: { value: t.color.border.default.var, syntax: '<color>' },
      selectedRing: { value: t.color.border.focus.var, syntax: '<color>' },
    });
    return {
      slots: ['root'],
      base: {
        root: {
          display: 'inline-block',
          width: v.size.var,
          height: v.size.var,
          borderRadius: t.radius.sm.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.border.var,
          boxSizing: 'border-box',
          '&[data-selected]': {
            outline: `2px solid ${v.selectedRing.var}`,
            outlineOffset: '1px',
          },
        },
      },
      variants: {
        size: {
          sm: { root: { [v.size.name]: '1rem' } },
          md: {},
          lg: { root: { [v.size.name]: '2rem' } },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
