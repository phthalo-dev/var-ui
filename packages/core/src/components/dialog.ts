import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { overlayIosAbsoluteBackdrop, overlayPresenceStyles } from '../shared/overlayMotion';
import { layerZIndex } from './layerVars';

export const dialog = typestyles.recipe({
  name: 'dialog',
  layer: 'components',
  slots: [
    'overlay',
    'modal',
    'content',
    'header',
    'heading',
    'description',
    'closeButton',
    'actions',
  ],
  variants: {
    role: variant.enum(['dialog', 'alertdialog'], { default: 'dialog' }),
  },
  vars: {
    overlayBackground: {
      ...atProperty.color,
      value: t.color.overlay.default.var,
    },
    modalBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    modalBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    descriptionColor: {
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
          display: 'grid',
          placeItems: 'center',
          padding: t.space[4].var,
        },
        modal: {
          ...overlayPresenceStyles({ scale: true }),
          width: 'min(480px, 100%)',
          backgroundColor: vars.modalBackground.var,
          borderRadius: t.radius.lg.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.modalBorder.var,
          boxShadow: t.shadow.md.var,
          padding: t.space[4].var,
        },
        content: {
          display: 'grid',
          gap: t.space[3].var,
        },
        header: {
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: t.space[3].var,
        },
        heading: {
          fontSize: '18px',
          fontWeight: t.fontWeight.semibold.var,
          margin: 0,
        },
        closeButton: {
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          color: t.color.text.secondary.var,
          cursor: 'pointer',
          display: 'inline-flex',
          padding: t.space[1].var,
          marginRight: `calc(${t.space[1].var} * -1)`,
          borderRadius: t.radius.sm.var,
          '&:hover': {
            backgroundColor: t.color.background.subtle.var,
            color: t.color.text.primary.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
        },
        description: {
          margin: 0,
          fontSize: t.fontSize.sm.var,
          color: vars.descriptionColor.var,
        },
        actions: {
          display: 'flex',
          justifyContent: 'flex-end',
          gap: t.space[2].var,
          marginTop: t.space[2].var,
        },
      },
      variants: {
        role: {
          dialog: {},
          alertdialog: {
            modal: {
              borderColor: t.color.border.strong.var,
            },
          },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type DialogVariantProps = RecipeVariants<typeof dialog>;
