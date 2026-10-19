import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './fieldChrome';

/**
 * File picker field: dashed dropzone (click or drag-and-drop) around field
 * chrome shared with textField/numberInput. The React wrapper owns file
 * validation and drag state; this recipe only styles the resulting DOM
 * states (`data-drag-over`, `data-disabled`).
 */
export const fileInput = typestyles.recipe(
  'file-input',
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
      dropzoneBackground: {
        ...atProperty.color,
        value: t.color.background.surface.var,
      },
      dropzoneBorder: {
        ...atProperty.color,
        value: t.color.border.default.var,
      },
      placeholderColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
      fileNameColor: {
        ...atProperty.color,
        value: t.color.text.primary.var,
      },
      iconColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
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
        'dropzone',
        'placeholderText',
        'fileNameText',
        'icon',
        'clearButton',
        'hiddenInput',
      ],
      ...chrome,
      root: {
        ...chrome.root,
        minWidth: '240px',
      },
      dropzone: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.space[2].var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'dashed',
        borderColor: v.dropzoneBorder.var,
        borderRadius: t.radius.md.var,
        padding: `${t.space[6].var} ${t.space[4].var}`,
        backgroundColor: v.dropzoneBackground.var,
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'background-color 140ms ease, border-color 140ms ease',
        '&[data-drag-over]': {
          [v.dropzoneBorder.name]: t.color.tone.accent.foreground.var,
          [v.dropzoneBackground.name]: t.color.tone.accent.subtleBackground.var,
        },
        '&[data-disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      placeholderText: {
        fontSize: t.fontSize.sm.var,
        color: v.placeholderColor.var,
      },
      fileNameText: {
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.medium.var,
        color: v.fileNameColor.var,
      },
      icon: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        color: v.iconColor.var,
      },
      clearButton: {
        appearance: 'none',
        border: 'none',
        borderRadius: t.radius.sm.var,
        backgroundColor: 'transparent',
        color: v.iconColor.var,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: t.space[1].var,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: t.color.background.subtle.var,
        },
      },
      hiddenInput: {
        position: 'absolute',
        width: '1px',
        height: '1px',
        margin: '-1px',
        padding: 0,
        border: 0,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
      },
    };
  },
  { layer: 'components' },
);
