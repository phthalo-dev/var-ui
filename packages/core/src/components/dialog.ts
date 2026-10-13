import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { overlayIosAbsoluteBackdrop, overlayPresenceStyles } from './overlayPresence';

export const dialog = typestyles.recipe(
  'dialog',
  (c) => {
    const v = c.vars({
      overlayBackground: {
        value: t.color.overlay.default.var,
        syntax: '<color>',
      },
      modalBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      modalBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      descriptionColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
    });
    return {
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
      base: {
        overlay: {
          ...overlayPresenceStyles(),
          ...overlayIosAbsoluteBackdrop,
          position: 'fixed',
          inset: 0,
          backgroundColor: v.overlayBackground.var,
          display: 'grid',
          placeItems: 'center',
          padding: t.space[4].var,
        },
        modal: {
          ...overlayPresenceStyles({ scale: true }),
          width: 'min(480px, 100%)',
          backgroundColor: v.modalBackground.var,
          borderRadius: t.radius.lg.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.modalBorder.var,
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
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '1px',
          },
        },
        description: {
          margin: 0,
          fontSize: t.fontSize.sm.var,
          color: v.descriptionColor.var,
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
      defaultVariants: { role: 'dialog' },
    };
  },
  { layer: 'components' },
);
