import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const tokenizer = typestyles.recipe(
  'tokenizer',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      descriptionColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      errorColor: {
        value: t.color.tone.danger.foreground.var,
        syntax: '<color>',
      },
      groupBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      groupBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      inputForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      popoverBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      popoverBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      itemFocusedBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      tokenBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      tokenForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      tokenRemoveHoverBackground: {
        value: t.color.background.elevated.var,
        syntax: '<color>',
      },
    });
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
    });
    return {
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
        borderColor: v.groupBorder.var,
        borderRadius: t.radius.md.var,
        padding: t.space[2].var,
        backgroundColor: v.groupBackground.var,
        '&[data-focus-within]': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '1px',
          [v.groupBorder.name]: t.color.border.focus.var,
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
        backgroundColor: v.tokenBackground.var,
        color: v.tokenForeground.var,
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
          backgroundColor: v.tokenRemoveHoverBackground.var,
        },
      },
      input: {
        border: 'none',
        background: 'transparent',
        outline: 'none',
        flex: 1,
        minWidth: '4rem',
        fontSize: t.fontSize.md.var,
        color: v.inputForeground.var,
      },
      popover: {
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.popoverBorder.var,
        borderRadius: t.radius.md.var,
        backgroundColor: v.popoverBackground.var,
        boxShadow: t.shadow.md.var,
        padding: t.space[1].var,
      },
      item: {
        fontSize: t.fontSize.md.var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        borderRadius: t.radius.sm.var,
        cursor: 'pointer',
        '&[data-focused]': {
          backgroundColor: v.itemFocusedBackground.var,
        },
      },
    };
  },
  { layer: 'components' },
);
