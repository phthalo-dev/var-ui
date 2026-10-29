import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { fieldChrome } from '../internal/fieldChrome';

export const tokenizer = typestyles.recipe({
  name: 'tokenizer',
  layer: 'components',
  slots: [
    'root',
    'label',
    'description',
    'error',
    'group',
    'tokenList',
    'token',
    'tokenLabel',
    'tokenRemoveButton',
    'input',
    'popover',
    'item',
  ],
  vars: {
    labelColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    descriptionColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    errorColor: {
      ...atProperty.color,
      value: t.color.tone.danger.foreground.var,
    },
    groupBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    groupBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    inputForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    popoverBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    popoverBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    itemFocusedBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    tokenBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    tokenForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    tokenRemoveHoverBackground: {
      ...atProperty.color,
      value: t.color.background.elevated.var,
    },
  },
  styles: ({ vars }) => {
    const chrome = fieldChrome({
      label: vars.labelColor.var,
      description: vars.descriptionColor.var,
      error: vars.errorColor.var,
    });
    return {
      base: {
        root: {
          ...chrome.root,
          minWidth: '240px',
        },
        label: chrome.label,
        description: chrome.description,
        error: chrome.error,
        group: {
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: t.space[1].var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.groupBorder.var,
          borderRadius: t.radius.md.var,
          padding: t.space[2].var,
          backgroundColor: vars.groupBackground.var,
          '&[data-focus-within]': {
            ...focusRing,
            [vars.groupBorder.name]: t.color.border.focus.var,
          },
          '&[data-disabled]': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        },
        tokenList: {
          display: 'contents',
        },
        token: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[1].var,
          padding: `${t.space[1].var} ${t.space[2].var}`,
          borderRadius: t.radius.full.var,
          backgroundColor: vars.tokenBackground.var,
          color: vars.tokenForeground.var,
          fontSize: t.fontSize.sm.var,
        },
        tokenLabel: {},
        tokenRemoveButton: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: '50%',
          color: 'inherit',
          '&[data-hovered]': {
            backgroundColor: vars.tokenRemoveHoverBackground.var,
          },
        },
        input: {
          border: 'none',
          background: 'transparent',
          outline: 'none',
          flex: 1,
          minWidth: '4rem',
          fontSize: t.fontSize.md.var,
          color: vars.inputForeground.var,
        },
        popover: {
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.popoverBorder.var,
          borderRadius: t.radius.md.var,
          backgroundColor: vars.popoverBackground.var,
          boxShadow: t.shadow.md.var,
          padding: t.space[1].var,
        },
        item: {
          fontSize: t.fontSize.md.var,
          padding: `${t.space[2].var} ${t.space[3].var}`,
          borderRadius: t.radius.sm.var,
          cursor: 'pointer',
          '&[data-focused]': {
            backgroundColor: vars.itemFocusedBackground.var,
          },
        },
      },
    };
  },
});
