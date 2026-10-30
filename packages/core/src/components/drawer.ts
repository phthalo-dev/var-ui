import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { borderSide } from '../internal/border';
import { focusRing } from '../internal/focusRing';
import { overlayIosAbsoluteBackdrop, overlayPresenceStyles } from '../shared/overlayMotion';
import { layerZIndex } from './layerVars';
import { controlSize } from '../shared/variantAxes';

/**
 * General-purpose slide-in panel built on RAC Modal. Supports start/end/bottom
 * placement and sm/md/lg widths. Pair with the React `Drawer` compound component.
 */
export const drawer = typestyles.recipe({
  name: 'drawer',
  layer: 'components',
  slots: ['overlay', 'panel', 'header', 'title', 'body', 'closeButton'],
  variants: { size: controlSize },
  vars: {
    overlayBackground: {
      ...atProperty.color,
      value: t.color.overlay.default.var,
    },
    panelBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    panelBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    panelWidth: {
      ...atProperty.length,
      value: '400px',
    },
    panelHeight: {
      ...atProperty.length,
      value: '50vh',
    },
    headerColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    closeButtonColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        overlay: {
          ...overlayPresenceStyles(),
          ...overlayIosAbsoluteBackdrop,
          position: 'fixed',
          inset: 0,
          ...layerZIndex(t.zIndex.modal.var),
          backgroundColor: vars.overlayBackground.var,
        },
        panel: {
          ...overlayPresenceStyles({ scale: false }),
          position: 'fixed',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: vars.panelBackground.var,
          boxShadow: t.shadow.lg.var,
          outline: 'none',
          maxWidth: '100vw',
          maxHeight: '100vh',
          '&[data-placement="start"]': {
            top: 0,
            bottom: 0,
            insetInlineStart: 0,
            width: `min(${vars.panelWidth.var}, 92vw)`,
            ...borderSide('inline-end', vars.panelBorder.var),
          },
          '&[data-placement="end"]': {
            top: 0,
            bottom: 0,
            insetInlineEnd: 0,
            width: `min(${vars.panelWidth.var}, 92vw)`,
            ...borderSide('inline-start', vars.panelBorder.var),
          },
          '&[data-placement="bottom"]': {
            insetInline: 0,
            bottom: 0,
            height: `min(${vars.panelHeight.var}, 92vh)`,
            ...borderSide('block-start', vars.panelBorder.var),
            borderStartStartRadius: t.radius.lg.var,
            borderStartEndRadius: t.radius.lg.var,
          },
        },
        header: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space[3].var,
          padding: t.space[4].var,
          ...borderSide('block-end', vars.panelBorder.var),
          color: vars.headerColor.var,
          flexShrink: 0,
        },
        title: {
          fontSize: t.fontSize.lg.var,
          fontWeight: t.fontWeight.semibold.var,
          margin: 0,
          minWidth: 0,
        },
        body: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: t.space[4].var,
        },
        closeButton: {
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          color: vars.closeButtonColor.var,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: t.space[1].var,
          marginInlineEnd: `calc(${t.space[1].var} * -1)`,
          borderRadius: t.radius.sm.var,
          flexShrink: 0,
          '&:hover': {
            backgroundColor: t.color.background.subtle.var,
            color: vars.headerColor.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
        },
      },
      variants: {
        size: {
          sm: { panel: { [vars.panelWidth.name]: '320px', [vars.panelHeight.name]: '40vh' } },
          md: {},
          lg: { panel: { [vars.panelWidth.name]: '560px', [vars.panelHeight.name]: '70vh' } },
        },
      },
    };
  },
});

export type DrawerVariantProps = RecipeVariants<typeof drawer>;
