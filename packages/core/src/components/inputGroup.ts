import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlSizeVariants, controlSurfaceSize } from './controlSize';
import { fieldChrome } from './field';

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
export const inputGroup = typestyles.recipe(
  'input-group',
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
      inputBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      inputBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      inputForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      placeholderColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      textBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      textForeground: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
    });
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
    });
    return {
      slots: ['root', 'label', 'description', 'error', 'group', 'input', 'text'],
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
          borderColor: v.inputBorder.var,
          fontSize: 'inherit',
          backgroundColor: v.inputBackground.var,
          color: v.inputForeground.var,
          '&:focus': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '1px',
            [v.inputBorder.name]: t.color.border.focus.var,
          },
          '&::placeholder': {
            color: v.placeholderColor.var,
          },
          '&:disabled': {
            cursor: 'not-allowed',
          },
        },
        text: {
          display: 'flex',
          alignItems: 'center',
          paddingInline: t.space[2].var,
          backgroundColor: v.textBackground.var,
          color: v.textForeground.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.inputBorder.var,
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
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
