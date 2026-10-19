import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { overlayIosAbsoluteBackdrop, overlayPresenceStyles } from './overlayPresence';
import { controlSize } from './variantAxes';

/**
 * General-purpose slide-in panel built on RAC Modal. Supports start/end/bottom
 * placement and sm/md/lg widths. Pair with the React `Drawer` compound component.
 */
export const drawer = typestyles.recipe(
  'drawer',
  {
    slots: ['overlay', 'panel', 'header', 'title', 'body', 'closeButton'],
    variants: { size: controlSize },
  },
  (c) => {
    const v = c.vars({
      overlayBackground: {
        value: t.color.overlay.default.var,
        syntax: '<color>',
      },
      panelBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      panelBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      panelWidth: {
        value: '400px',
        syntax: '<length>',
      },
      panelHeight: {
        value: '50vh',
        syntax: '<length>',
      },
      headerColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      closeButtonColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
    });
    return {
      base: {
        overlay: {
          ...overlayPresenceStyles(),
          ...overlayIosAbsoluteBackdrop,
          position: 'fixed',
          inset: 0,
          backgroundColor: v.overlayBackground.var,
        },
        panel: {
          ...overlayPresenceStyles({ scale: false }),
          position: 'fixed',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: v.panelBackground.var,
          boxShadow: t.shadow.lg.var,
          outline: 'none',
          maxWidth: '100vw',
          maxHeight: '100vh',
          '&[data-placement="start"]': {
            top: 0,
            bottom: 0,
            insetInlineStart: 0,
            width: `min(${v.panelWidth.var}, 92vw)`,
            borderInlineEndWidth: t.borderWidth.default.var,
            borderInlineEndStyle: 'solid',
            borderInlineEndColor: v.panelBorder.var,
          },
          '&[data-placement="end"]': {
            top: 0,
            bottom: 0,
            insetInlineEnd: 0,
            width: `min(${v.panelWidth.var}, 92vw)`,
            borderInlineStartWidth: t.borderWidth.default.var,
            borderInlineStartStyle: 'solid',
            borderInlineStartColor: v.panelBorder.var,
          },
          '&[data-placement="bottom"]': {
            insetInline: 0,
            bottom: 0,
            height: `min(${v.panelHeight.var}, 92vh)`,
            borderBlockStartWidth: t.borderWidth.default.var,
            borderBlockStartStyle: 'solid',
            borderBlockStartColor: v.panelBorder.var,
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
          borderBottomWidth: t.borderWidth.default.var,
          borderBottomStyle: 'solid',
          borderBottomColor: v.panelBorder.var,
          color: v.headerColor.var,
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
          color: v.closeButtonColor.var,
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
            color: v.headerColor.var,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '1px',
          },
        },
      },
      variants: {
        size: {
          sm: { panel: { [v.panelWidth.name]: '320px', [v.panelHeight.name]: '40vh' } },
          md: {},
          lg: { panel: { [v.panelWidth.name]: '560px', [v.panelHeight.name]: '70vh' } },
        },
      },
    };
  },
  { layer: 'components' },
);

export type DrawerRecipeProps = NonNullable<Parameters<typeof drawer>[0]>;
export type DrawerSize = NonNullable<DrawerRecipeProps['size']>;

export type DrawerVariantProps = {
  size?: DrawerSize;
};

export const drawerVariantPropDocs = [
  { name: 'size', type: 'DrawerSize', required: false },
] as const satisfies ReadonlyArray<{
  name: keyof DrawerVariantProps;
  type: string;
  required: false;
}>;
