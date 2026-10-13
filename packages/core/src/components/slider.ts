import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const slider = typestyles.recipe(
  'slider',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      trackBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      fillBackground: {
        value: t.color.tone.accent.foreground.var,
        syntax: '<color>',
      },
      thumbBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      thumbBorder: {
        value: t.color.tone.accent.foreground.var,
        syntax: '<color>',
      },
      outputColor: {
        value: t.color.text.secondary.var,
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
      trackHeight: {
        value: t.space[1].var,
        syntax: '<length>',
      },
      thumbSize: {
        value: t.size.icon.md.var,
        syntax: '<length>',
      },
      controlHeight: {
        value: t.size.icon.lg.var,
        syntax: '<length>',
      },
      thumbBorderWidth: {
        value: t.borderWidth.thick.var,
        syntax: '<length>',
      },
      focusOutlineWidth: {
        value: t.borderWidth.thick.var,
        syntax: '<length>',
      },
      focusOutlineOffset: {
        value: t.space[1].var,
        syntax: '<length>',
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
        'control',
        'track',
        'fill',
        'thumb',
        'output',
      ],
      root: {
        ...chrome.root,
        minWidth: `calc(15 * ${t.space[4].var})`,
      },
      label: {
        ...chrome.label,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: t.space[2].var,
      },
      description: chrome.description,
      error: chrome.error,
      control: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: v.controlHeight.var,
      },
      track: {
        position: 'relative',
        width: '100%',
        height: v.trackHeight.var,
        borderRadius: t.radius.full.var,
        backgroundColor: v.trackBackground.var,
        overflow: 'hidden',
        pointerEvents: 'none',
      },
      fill: {
        height: '100%',
        borderRadius: 'inherit',
        backgroundColor: v.fillBackground.var,
        pointerEvents: 'none',
      },
      thumb: {
        position: 'absolute',
        top: '50%',
        width: v.thumbSize.var,
        height: v.thumbSize.var,
        boxSizing: 'border-box',
        borderRadius: t.radius.full.var,
        borderWidth: v.thumbBorderWidth.var,
        borderStyle: 'solid',
        borderColor: v.thumbBorder.var,
        backgroundColor: v.thumbBackground.var,
        boxShadow: t.shadow.sm.var,
        '&:focus-visible': {
          outline: `${v.focusOutlineWidth.var} solid ${t.color.border.focus.var}`,
          outlineOffset: v.focusOutlineOffset.var,
        },
      },
      output: {
        fontSize: t.fontSize.sm.var,
        color: v.outputColor.var,
      },
    };
  },
  { layer: 'components' },
);
