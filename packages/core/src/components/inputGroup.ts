import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { controlSizeVariants, controlSurfaceSize } from '../internal/controlSize';
import { fieldChrome } from '../internal/fieldChrome';
import { controlSize } from '../shared/variantAxes';
import { atProperty, type RecipeVariants } from 'typestyles';

/**
 * Connected-border group for bare `<input>`s and text addons (e.g. a
 * currency symbol or unit label glued to an input's edge).
 *
 * Unlike `textField`/`numberInput`, this recipe intentionally owns its own
 * field chrome rather than delegating to those components — v1 scope wraps
 * plain `<input>` elements and `InputGroupText` addons, not full field
 * components. Direct children of `group` share the buttonGroup border-joining
 * technique: interior borders overlap by 1px and only the first/last child
 * keep the container's outer corner radius.
 */
export const inputGroup = typestyles.recipe({
  name: 'input-group',
  layer: 'components',
  slots: ['root', 'label', 'description', 'error', 'group', 'input', 'text'],
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
    inputBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    inputBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    inputForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    placeholderColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    textBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    textForeground: {
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
        root: {
          ...chrome.root,
          minWidth: '240px',
        },
        label: chrome.label,
        description: chrome.description,
        error: chrome.error,
        group: {
          display: 'inline-flex',
          alignItems: 'stretch',
          '& > *': {
            borderRadius: 0,
            position: 'relative',
          },
          '& > * + *': {
            marginInlineStart: '-1px',
          },
          '& > *:first-child': {
            borderStartStartRadius: t.radius.md.var,
            borderEndStartRadius: t.radius.md.var,
          },
          '& > *:last-child': {
            borderStartEndRadius: t.radius.md.var,
            borderEndEndRadius: t.radius.md.var,
          },
          '& > *:focus-within, & > *:hover': {
            zIndex: 1,
          },
          '&[data-disabled]': {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        },
        input: {
          flex: 1,
          minWidth: 0,
          boxSizing: 'border-box',
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.inputBorder.var,
          fontSize: 'inherit',
          backgroundColor: vars.inputBackground.var,
          color: vars.inputForeground.var,
          '&:focus': {
            ...focusRing,
            [vars.inputBorder.name]: t.color.border.focus.var,
          },
          '&::placeholder': {
            color: vars.placeholderColor.var,
          },
          '&:disabled': {
            cursor: 'not-allowed',
          },
        },
        text: {
          display: 'flex',
          alignItems: 'center',
          paddingInline: t.space[2].var,
          backgroundColor: vars.textBackground.var,
          color: vars.textForeground.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.inputBorder.var,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        },
      },
      variants: {
        size: controlSizeVariants((size) => ({
          group: controlSurfaceSize(size, { inset: 'compact' }),
          input: {
            height: '100%',
            paddingBlock: 0,
            paddingInline: 0,
          },
          text: {
            fontSize: controlSurfaceSize(size).fontSize,
          },
        })),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type InputGroupVariantProps = RecipeVariants<typeof inputGroup>;
