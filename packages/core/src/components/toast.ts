import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import {
  appearanceSurface,
  mapTone,
  surfaceAppearance,
  toneChannelAssignments,
  toneWithDefault,
} from '../shared/semanticTone';
import { placement } from '../shared/variantAxes';
import { layerZIndex } from './layerVars';

/**
 * Toast viewport + toast item chrome.
 *
 * ```ts
 * const t = toast({ tone: 'success', appearance: 'subtle', placement: 'bottom-end' });
 * <div className={t.region}><div className={t.item}>…</div></div>
 * ```
 */
export const toast = typestyles.recipe({
  name: 'toast',
  layer: 'components',
  slots: ['region', 'item', 'icon', 'body', 'title', 'description', 'close'],
  variants: {
    tone: toneWithDefault('info'),
    appearance: surfaceAppearance,
    placement,
  },
  vars: {
    semantic: { ...atProperty.color, value: t.color.tone.accent.foreground.var },
    solidBg: { ...atProperty.color, value: t.color.tone.accent.background.var },
    solidFg: { ...atProperty.color, value: t.color.tone.accent.foregroundOnBackground.var },
    titleColor: { ...atProperty.color, value: t.color.text.primary.var },
    descriptionColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    closeColor: { ...atProperty.color, value: t.color.text.secondary.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        region: {
          position: 'fixed',
          ...layerZIndex(t.zIndex.toast.var),
          display: 'flex',
          flexDirection: 'column',
          gap: t.space[2].var,
          padding: t.space[4].var,
          pointerEvents: 'none',
          maxWidth: 'min(24rem, calc(100vw - 2rem))',
        },
        item: {
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: t.space[3].var,
          padding: t.space[3].var,
          borderRadius: t.radius.md.var,
          boxShadow: t.shadow.md.var,
          outline: 'none',
          '&[data-focus-visible]': {
            ...focusRing,
          },
        },
        icon: {
          flexShrink: 0,
          display: 'inline-flex',
          marginTop: '2px',
          color: vars.semantic.var,
        },
        body: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: t.space[1].var,
        },
        title: {
          margin: 0,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          color: vars.titleColor.var,
        },
        description: {
          margin: 0,
          fontSize: t.fontSize.sm.var,
          color: vars.descriptionColor.var,
        },
        close: {
          flexShrink: 0,
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          color: vars.closeColor.var,
          cursor: 'pointer',
          display: 'inline-flex',
          padding: t.space[1].var,
          borderRadius: t.radius.sm.var,
          '&:hover': {
            backgroundColor: t.color.background.subtle.var,
            color: t.color.text.primary.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
        },
      },
      variants: {
        tone: mapTone((key) => ({ item: toneChannelAssignments(vars, key) })),
        appearance: {
          subtle: { item: appearanceSurface(vars, 'subtle') },
          solid: {
            item: appearanceSurface(vars, 'solid'),
            icon: { color: 'inherit' },
            title: { color: 'inherit' },
          },
          outline: { item: appearanceSurface(vars, 'outline') },
        },
        placement: {
          'top-end': { region: { top: 0, right: 0 } },
          'top-start': { region: { top: 0, left: 0 } },
          'bottom-end': { region: { bottom: 0, right: 0 } },
          'bottom-start': { region: { bottom: 0, left: 0 } },
        },
      },
    };
  },
});

export type ToastVariantProps = RecipeVariants<typeof toast>;
