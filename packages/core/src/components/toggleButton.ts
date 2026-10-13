import { typestyles } from '../runtime';
import { duration } from '../tokens/defaults/duration';
import { easing } from '../tokens/defaults/easing';
import { designTokens as t } from '../tokens';
import { controlSizeVariants, controlSurfaceSize } from './controlSize';

/** Single toggle button and segmented-control item styling. */
export const toggleButton = typestyles.recipe(
  'toggle-button',
  (c) => {
    const v = c.vars({
      border: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      background: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      foreground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      selectedBackground: {
        value: t.color.tone.accent.background.var,
        syntax: '<color>',
      },
      selectedForeground: {
        value: t.color.tone.accent.foregroundOnBackground.var,
        syntax: '<color>',
      },
    });
    return {
      base: {
        appearance: 'none',
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.border.var,
        borderRadius: t.radius.md.var,
        backgroundColor: v.background.var,
        color: v.foreground.var,
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.medium.var,
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.space[2].var,
        transition: 'background-color 140ms ease, border-color 140ms ease',
        '&:hover': {
          backgroundColor: t.color.background.subtle.var,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
        },
        '&[data-selected]': {
          [v.background.name]: v.selectedBackground.var,
          [v.border.name]: v.selectedBackground.var,
          [v.foreground.name]: v.selectedForeground.var,
          '&:hover': {
            [v.background.name]: t.color.link.hover.var,
            [v.border.name]: t.color.link.hover.var,
          },
        },
      },
      variants: {
        size: controlSizeVariants((size) => controlSurfaceSize(size)),
        segmented: {
          true: {
            height: '100%',
            minHeight: 0,
            paddingBlock: 0,
            border: 'none',
            borderRadius: t.radius.full.var,
            backgroundColor: 'transparent',
            [v.foreground.name]: t.color.text.secondary.var,
            fontWeight: t.fontWeight.normal.var,
            boxShadow: 'none',
            transition: `color ${duration.fast} ${easing.standard}`,
            '&:hover': {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            },
            '&[data-selected], &[aria-pressed="true"]': {
              [v.background.name]: 'transparent',
              [v.border.name]: 'transparent',
              [v.foreground.name]: t.color.text.primary.var,
              fontWeight: t.fontWeight.semibold.var,
              boxShadow: 'none',
              '&:hover': {
                [v.background.name]: 'transparent',
                [v.border.name]: 'transparent',
              },
            },
          },
          false: {},
        },
      },
      defaultVariants: { size: 'md', segmented: 'false' },
    };
  },
  { layer: 'components' },
);
