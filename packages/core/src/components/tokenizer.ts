import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './fieldChrome';

export const tokenizer = typestyles.recipe(
  'tokenizer',
  (c) => {
    const v = c.vars({
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
