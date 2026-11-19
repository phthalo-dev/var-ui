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
import { atForcedColors } from '../theme/conditions';
import { forced } from '../internal/forcedColors';
import { placement } from '../shared/variantAxes';
import { nativeEnterExit } from '../shared/overlayMotion';

/**
 * Toast viewport + toast item chrome.
 *
 * ```ts
 * const t = toast({ tone: 'success', appearance: 'subtle', placement: 'bottom-end' });
 * <div className={t.region}><div className={t.item}>…</div></div>
 * ```
 */
/** Horizontally centered in the viewport: both inline edges at 0 with auto margins. */
const centered = { insetInline: 0, marginInline: 'auto', width: 'fit-content' } as const;

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
    /**
     * Distance from the anchored top/bottom edge, e.g. the height of a bottom player bar:
     * `--var-ui-toast-offsetblock: var(--app-bottom-bar)`.
     */
    offsetBlock: { ...atProperty.length, value: '0px' },
    /** Distance from the anchored start/end edge (ignored by the `*-center` placements). */
    offsetInline: { ...atProperty.length, value: '0px' },
  },
  styles: ({ vars }) => {
    return {
      base: {
        // `popover="manual"` top-layer region (no z-index: the top layer orders by insertion).
        // `display: flex` is scoped to the open state because an author `display` would beat the
        // UA `[popover]:not(:popover-open) { display: none }`.
        region: {
          position: 'fixed',
          inset: 'auto',
          margin: 0,
          border: 'none',
          background: 'transparent',
          color: 'inherit',
          overflow: 'visible',
          '&:not([popover]), &:popover-open': { display: 'flex' },
          '&[popover]': nativeEnterExit({ open: ':popover-open' }),
          flexDirection: 'column',
          gap: t.space.xs.var,
          padding: t.space.md.var,
          pointerEvents: 'none',
          maxWidth: `min(${t.size.panel.lg.var}, calc(100vw - 2rem))`,
        },
        item: {
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: t.space.sm.var,
          padding: t.space.sm.var,
          borderRadius: t.radius.md.var,
          boxShadow: t.shadow.md.var,
          outline: 'none',
          // The tinted/shadowed card has no edge of its own in forced colors.
          ...atForcedColors(forced.boundary),
          '&[data-focus-visible]': {
            ...focusRing,
          },
        },
        icon: {
          flexShrink: 0,
          display: 'inline-flex',
          marginTop: '0.125rem',
          color: vars.semantic.var,
        },
        body: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.xxs.var,
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
          padding: t.space.xxs.var,
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
          'top-start': {
            region: { top: vars.offsetBlock.var, insetInlineStart: vars.offsetInline.var },
          },
          'top-center': { region: { top: vars.offsetBlock.var, ...centered } },
          'top-end': {
            region: { top: vars.offsetBlock.var, insetInlineEnd: vars.offsetInline.var },
          },
          'bottom-start': {
            region: { bottom: vars.offsetBlock.var, insetInlineStart: vars.offsetInline.var },
          },
          'bottom-center': { region: { bottom: vars.offsetBlock.var, ...centered } },
          'bottom-end': {
            region: { bottom: vars.offsetBlock.var, insetInlineEnd: vars.offsetInline.var },
          },
        },
      },
    };
  },
});

export type ToastVariantProps = RecipeVariants<typeof toast>;
