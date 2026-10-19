import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Standalone copy-to-clipboard button chrome. Extracted from `codeBlock` so
 * apps can pair it with `useCopy` outside code blocks (share links, API keys).
 */
export const copyButton = typestyles.recipe(
  'copy-button',
  (c) => {
    const v = c.vars({
      color: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
      hoverBackground: {
        ...atProperty.color,
        value: t.color.background.subtle.var,
      },
      successColor: {
        ...atProperty.color,
        value: t.color.tone.success.foreground.var,
      },
      errorColor: {
        ...atProperty.color,
        value: t.color.tone.danger.foreground.var,
      },
    });
    return {
      slots: ['button', 'buttonIdle', 'buttonCopied', 'buttonError'],
      base: {
        button: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[1].var,
          padding: `${t.space[1].var} ${t.space[2].var}`,
          borderRadius: t.radius.sm.var,
          border: 'none',
          backgroundColor: 'transparent',
          color: v.color.var,
          fontSize: t.fontSize.sm.var,
          fontFamily: t.fontFamily.body.var,
          cursor: 'pointer',
          transition: 'background-color 140ms ease, color 140ms ease',
          '&:hover': {
            backgroundColor: v.hoverBackground.var,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
          },
        },
        buttonIdle: {},
        buttonCopied: {
          color: v.successColor.var,
        },
        buttonError: {
          color: v.errorColor.var,
        },
      },
    };
  },
  { layer: 'components' },
);
