import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border } from '../internal/border';
import { controlSizeMetrics, controlSizeVariants } from '../internal/controlSize';
import { fieldChrome } from '../internal/fieldChrome';
import { controlSize, type ControlSize } from '../shared/variantAxes';
import { atProperty, type RecipeVariants } from 'typestyles';

function pinCellSize(size: ControlSize) {
  const { height, fontSize } = controlSizeMetrics[size];
  return {
    boxSizing: 'border-box' as const,
    width: height,
    height,
    minWidth: height,
    fontSize,
    padding: 0,
    textAlign: 'center' as const,
  };
}

export const pinInput = typestyles.recipe({
  name: 'pin-input',
  layer: 'components',
  slots: ['root', 'label', 'group', 'cell', 'description', 'error'],
  variants: { size: controlSize },
  vars: {
    labelColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    cellBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    cellBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    cellForeground: {
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
          width: 'fit-content',
        },
        label: chrome.label,
        group: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2].var,
          width: 'fit-content',
          '&[data-disabled]': {
            opacity: t.opacity.muted.var,
            cursor: 'not-allowed',
          },
        },
        cell: {
          ...border(vars.cellBorder.var),
          borderRadius: t.radius.md.var,
          backgroundColor: vars.cellBackground.var,
          color: vars.cellForeground.var,
          fontFamily: t.fontFamily.body.var,
          fontVariantNumeric: 'tabular-nums',
          outline: 'none',
          '&:focus': {
            ...focusRing,
            [vars.cellBorder.name]: t.color.border.focus.var,
          },
          '&:disabled': {
            cursor: 'not-allowed',
          },
        },
        description: chrome.description,
        error: chrome.error,
      },
      variants: {
        size: controlSizeVariants((size) => ({
          cell: pinCellSize(size),
        })),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type PinInputVariantProps = RecipeVariants<typeof pinInput>;
