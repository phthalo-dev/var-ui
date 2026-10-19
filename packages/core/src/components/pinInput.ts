import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlSizeMetrics, controlSizeVariants } from './controlSize';
import { fieldChrome } from './field';
import type { ControlSize } from './semanticTone';
import { controlSize } from './variantAxes';
import { type RecipeVariants } from 'typestyles';

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

export const pinInput = typestyles.recipe(
  'pin-input',
  {
    slots: ['root', 'label', 'group', 'cell', 'description', 'error'],
    variants: { size: controlSize },
  },
  (c) => {
    const v = c.vars({
      labelColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      cellBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      cellBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      cellForeground: {
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
    });
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
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
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        },
        cell: {
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.cellBorder.var,
          borderRadius: t.radius.md.var,
          backgroundColor: v.cellBackground.var,
          color: v.cellForeground.var,
          fontFamily: t.fontFamily.body.var,
          fontVariantNumeric: 'tabular-nums',
          outline: 'none',
          '&:focus': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '1px',
            [v.cellBorder.name]: t.color.border.focus.var,
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
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type PinInputVariantProps = RecipeVariants<typeof pinInput>;
