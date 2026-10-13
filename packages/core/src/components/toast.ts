import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  appearanceSurface,
  semanticChannelAssignments,
  type FeedbackTone,
  type SurfaceAppearance,
} from './semanticTone';

/**
 * Toast viewport + toast item chrome.
 *
 * ```ts
 * const t = toast({ tone: 'success', appearance: 'subtle', placement: 'bottom-end' });
 * <div className={t.region}><div className={t.item}>…</div></div>
 * ```
 */
export const toast = typestyles.recipe(
  'toast',
  (c) => {
    const v = c.vars({
      semantic: { value: t.color.tone.accent.foreground.var, syntax: '<color>' },
      solidBg: { value: t.color.tone.accent.background.var, syntax: '<color>' },
      solidFg: { value: t.color.tone.accent.foregroundOnBackground.var, syntax: '<color>' },
      titleColor: { value: t.color.text.primary.var, syntax: '<color>' },
      descriptionColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      closeColor: { value: t.color.text.secondary.var, syntax: '<color>' },
    });
    return {
      slots: ['region', 'item', 'icon', 'body', 'title', 'description', 'close'],
      base: {
        region: {
          position: 'fixed',
          zIndex: t.zIndex.toast.var,
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
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
          },
        },
        icon: {
          flexShrink: 0,
          display: 'inline-flex',
          marginTop: '2px',
          color: v.semantic.var,
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
          color: v.titleColor.var,
        },
        description: {
          margin: 0,
          fontSize: t.fontSize.sm.var,
          color: v.descriptionColor.var,
        },
        close: {
          flexShrink: 0,
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          color: v.closeColor.var,
          cursor: 'pointer',
          display: 'inline-flex',
          padding: t.space[1].var,
          borderRadius: t.radius.sm.var,
          '&:hover': {
            backgroundColor: t.color.background.subtle.var,
            color: t.color.text.primary.var,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '1px',
          },
        },
      },
      variants: {
        tone: {
          info: { item: semanticChannelAssignments(v, 'accent') },
          success: { item: semanticChannelAssignments(v, 'success') },
          warning: { item: semanticChannelAssignments(v, 'warning') },
          danger: { item: semanticChannelAssignments(v, 'danger') },
        },
        appearance: {
          subtle: { item: appearanceSurface(v, 'subtle') },
          solid: {
            item: appearanceSurface(v, 'solid'),
            icon: { color: 'inherit' },
            title: { color: 'inherit' },
          },
          outline: { item: appearanceSurface(v, 'outline') },
        },
        placement: {
          'top-end': { region: { top: 0, right: 0 } },
          'top-start': { region: { top: 0, left: 0 } },
          'bottom-end': { region: { bottom: 0, right: 0 } },
          'bottom-start': { region: { bottom: 0, left: 0 } },
        },
      },
      defaultVariants: { tone: 'info', appearance: 'subtle', placement: 'bottom-end' },
    };
  },
  { layer: 'components' },
);

export type ToastRecipeProps = NonNullable<Parameters<typeof toast>[0]>;
export type ToastTone = FeedbackTone;
export type ToastPlacement = NonNullable<ToastRecipeProps['placement']>;
export type ToastVariantProps = {
  tone?: ToastTone;
  appearance?: SurfaceAppearance;
  placement?: ToastPlacement;
};

export const toastVariantPropDocs = [
  { name: 'tone', type: 'ToastTone', required: false },
  { name: 'appearance', type: 'SurfaceAppearance', required: false },
  { name: 'placement', type: 'ToastPlacement', required: false },
] as const satisfies ReadonlyArray<{
  name: keyof ToastVariantProps;
  type: string;
  required: false;
}>;
