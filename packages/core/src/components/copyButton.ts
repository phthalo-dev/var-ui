import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from './focusRing';

/**
 * Standalone copy-to-clipboard button chrome. Extracted from `codeBlock` so
 * apps can pair it with `useCopy` outside code blocks (share links, API keys).
 */
export const copyButton = typestyles.recipe({
  name: 'copy-button',
  layer: 'components',
  slots: ['button', 'buttonIdle', 'buttonCopied', 'buttonError'],
  vars: {
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
  },
  styles: ({ vars }) => {
    return {
      base: {
        button: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[1].var,
          padding: `${t.space[1].var} ${t.space[2].var}`,
          borderRadius: t.radius.sm.var,
          border: 'none',
          backgroundColor: 'transparent',
          color: vars.color.var,
          fontSize: t.fontSize.sm.var,
          fontFamily: t.fontFamily.body.var,
          cursor: 'pointer',
          transition: 'background-color 140ms ease, color 140ms ease',
          '&:hover': {
            backgroundColor: vars.hoverBackground.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
        },
        buttonIdle: {},
        buttonCopied: {
          color: vars.successColor.var,
        },
        buttonError: {
          color: vars.errorColor.var,
        },
      },
    };
  },
});
