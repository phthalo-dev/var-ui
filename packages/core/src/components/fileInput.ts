import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { fieldChrome } from '../internal/fieldChrome';
import { controlSecondaryFontSize, controlSizeVariants } from '../internal/controlSize';
import { controlSize, type ControlSize } from '../shared/variantAxes';

const dropzonePadding: Record<ControlSize, string> = {
  sm: `${t.space.lg.var} ${t.space.sm.var}`,
  md: `${t.space.xl.var} ${t.space.md.var}`,
  lg: `${t.space.xxl.var} ${t.space.lg.var}`,
};

const iconSize: Record<ControlSize, string> = {
  sm: t.size.icon.md.var,
  md: t.size.icon.lg.var,
  lg: t.size.control.xs.var,
};

/**
 * File picker field: dashed dropzone (click or drag-and-drop) around field
 * chrome shared with textField/numberInput. The React wrapper owns file
 * validation and drag state; this recipe only styles the resulting DOM
 * states (`data-drag-over`, `data-disabled`).
 */
export const fileInput = typestyles.recipe({
  name: 'file-input',
  layer: 'components',
  slots: [
    'root',
    'label',
    'description',
    'error',
    'frame',
    'dropzone',
    'placeholderText',
    'fileNameText',
    'icon',
    'clearButton',
    'hiddenInput',
  ],
  variants: { size: controlSize },
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
  },
  styles: ({ vars }) => {
    const chrome = fieldChrome({
      label: vars.labelColor.var,
      description: vars.descriptionColor.var,
      error: vars.errorColor.var,
    });
    return {
      base: {
        label: chrome.label,
        description: chrome.description,
        error: chrome.error,
        root: {
          ...chrome.root,
          minWidth: t.size.field.minWidth.var,
        },
        frame: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        },
        dropzone: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: t.space.xs.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'dashed',
          borderColor: vars.dropzoneBorder.var,
          borderRadius: t.radius.md.var,
          backgroundColor: vars.dropzoneBackground.var,
          cursor: 'pointer',
          textAlign: 'center',
          transition: t.transition.controlSurface.var,
          '&[data-drag-over]': {
            [vars.dropzoneBorder.name]: t.color.tone.accent.foreground.var,
            [vars.dropzoneBackground.name]: t.color.tone.accent.subtleBackground.var,
          },
          '&[data-disabled]': {
            opacity: t.opacity.disabled.var,
            cursor: 'not-allowed',
          },
          '&:focus-visible': {
            ...focusRing,
            [vars.dropzoneBorder.name]: t.color.border.focus.var,
          },
        },
        placeholderText: {
          color: vars.placeholderColor.var,
        },
        fileNameText: {
          fontWeight: t.fontWeight.medium.var,
          color: vars.fileNameColor.var,
        },
        icon: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: vars.iconColor.var,
        },
        clearButton: {
          position: 'absolute',
          insetBlockStart: t.space.xs.var,
          insetInlineEnd: t.space.xs.var,
          appearance: 'none',
          border: 'none',
          borderRadius: t.radius.sm.var,
          backgroundColor: 'transparent',
          color: vars.iconColor.var,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: t.space.xxs.var,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: t.color.background.subtle.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
        },
        hiddenInput: {
          position: 'absolute',
          width: '0.0625rem',
          height: '0.0625rem',
          margin: '-0.0625rem',
          padding: 0,
          border: 0,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
        },
      },
      variants: {
        size: controlSizeVariants((size) => ({
          dropzone: { padding: dropzonePadding[size] },
          placeholderText: { fontSize: controlSecondaryFontSize[size] },
          fileNameText: { fontSize: controlSecondaryFontSize[size] },
          icon: { width: iconSize[size], height: iconSize[size] },
        })),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type FileInputVariantProps = RecipeVariants<typeof fileInput>;
