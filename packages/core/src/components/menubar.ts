import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { forced } from '../internal/forcedColors';
import { controlSizeVariants, controlSurfaceSize } from '../internal/controlSize';
import { atForcedColors } from '../theme/conditions';
import { controlSize } from '../shared/variantAxes';

/**
 * A horizontal bar of menu triggers (File, Edit, View...). `root` is the `role="menubar"`
 * element; `trigger` is each top-level `<button role="menuitem">`. The popups are ordinary
 * `menu` recipe popovers. The open trigger is styled through `[data-open]` / `[aria-expanded]`;
 * logical properties and flex layout mirror in RTL.
 */
export const menubar = typestyles.recipe({
  name: 'menubar',
  layer: 'components',
  slots: ['root', 'trigger'],
  variants: {
    size: controlSize,
  },
  vars: {
    foreground: { ...atProperty.color, value: t.color.text.primary.var },
    hoverBackground: { ...atProperty.color, value: t.color.background.subtle.var },
    openBackground: { ...atProperty.color, value: t.color.background.subtle.var },
  },
  styles: ({ vars }) => ({
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space.xxs.var,
        boxSizing: 'border-box',
      },
      trigger: {
        appearance: 'none',
        borderWidth: 0,
        borderStyle: 'none',
        background: 'transparent',
        margin: 0,
        font: 'inherit',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: t.radius.sm.var,
        color: vars.foreground.var,
        fontWeight: t.fontWeight.medium.var,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: t.transition.controlSurface.var,
        '&:hover:not([disabled])': {
          backgroundColor: vars.hoverBackground.var,
        },
        '&:focus-visible': {
          ...focusRing,
        },
        '&[aria-expanded="true"], &[data-open]': {
          backgroundColor: vars.openBackground.var,
          ...atForcedColors({ ...forced.selected, ...forced.focus }),
        },
        '&[disabled]': {
          opacity: t.opacity.disabled.var,
          cursor: 'not-allowed',
          ...atForcedColors(forced.disabled),
        },
      },
    },
    variants: {
      size: controlSizeVariants((size) => {
        const surface = controlSurfaceSize(size, { inset: 'compact' });
        return { trigger: surface };
      }),
    },
  }),
});

/** Visual props derived from the schema. */
export type MenubarVariantProps = RecipeVariants<typeof menubar>;
