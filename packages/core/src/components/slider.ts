import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './fieldChrome';

export const slider = typestyles.recipe(
  'slider',
  (c) => {
    const v = c.vars({
      labelColor: {
        ...atProperty.color,
        value: t.color.text.primary.var,
      },
      trackBackground: {
        ...atProperty.color,
        value: t.color.background.subtle.var,
      },
      fillBackground: {
        ...atProperty.color,
        value: t.color.tone.accent.foreground.var,
      },
      thumbBackground: {
        ...atProperty.color,
        value: t.color.background.surface.var,
      },
      thumbBorder: {
        ...atProperty.color,
        value: t.color.tone.accent.foreground.var,
      },
      outputColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
      descriptionColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
      errorColor: {
        ...atProperty.color,
        value: t.color.tone.danger.foreground.var,
      },
      trackHeight: {
        ...atProperty.length,
        value: t.space[1].var,
      },
      thumbSize: {
        ...atProperty.length,
        value: t.size.icon.md.var,
      },
      controlHeight: {
        ...atProperty.length,
        value: t.size.icon.lg.var,
      },
      thumbBorderWidth: {
        ...atProperty.length,
        value: t.borderWidth.thick.var,
      },
      focusOutlineWidth: {
        ...atProperty.length,
        value: t.borderWidth.thick.var,
      },
      focusOutlineOffset: {
        ...atProperty.length,
        value: t.space[1].var,
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
