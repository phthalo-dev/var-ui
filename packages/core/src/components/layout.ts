import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { defineLayoutShellVars, getLayoutShellVars } from './layoutShellVars';
export type { LayoutPadding } from './layoutShellVars';
export {
  getLayoutShellVars,
  layoutContentWidthAssignment,
  layoutShellPaddingAssignments,
} from './layoutShellVars';

const layoutHeight = variant.enum(['fill', 'auto'], { default: 'fill' });
const zoneScrollable = variant.boolean({ default: true });
const zonePadding = variant.enum(['inherit', '0'], { default: 'inherit' });
const panelDivider = variant.boolean({ default: false });

/**
 * Multi-pane page shell: header/footer bands and a horizontal middle row for
 * start/content/end zones. Sets padding and content-width CSS vars consumed by
 * {@link layoutHeader}, {@link layoutFooter}, {@link layoutContent}, and
 * {@link layoutPanel}. Pair with the React `Layout` compound, which sets
 * `data-has-*` and divider attributes on the root.
 *
 * ```tsx
 * const l = layout({ height: 'fill' });
 * <div className={l.root} data-has-header data-has-start data-has-end>
 *   <div className={l.outer}><div className={l.inner}>
 *     <LayoutHeader>…</LayoutHeader>
 *     <div className={l.middle}>
 *       <LayoutPanel data-side="start">…</LayoutPanel>
 *       <LayoutContent>…</LayoutContent>
 *       <LayoutPanel data-side="end">…</LayoutPanel>
 *     </div>
 *     <LayoutFooter>…</LayoutFooter>
 *   </div></div>
 * </div>
 * ```
 */
export const layout = typestyles.recipe(
  'layout',
  {
    slots: ['root', 'outer', 'inner', 'middle'],
    variants: { height: layoutHeight },
  },
  (c) => {
    const shell = defineLayoutShellVars(c);
    return {
      vars: shell,
      base: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          [shell.padding.outer.x.name]: t.space[4].var,
          [shell.padding.outer.y.name]: t.space[4].var,
          [shell.padding.inner.x.name]: t.space[4].var,
          [shell.padding.inner.y.name]: t.space[4].var,
        },
        outer: {
          marginInlineStart: 'calc(-1 * var(--container-padding-inline-start, 0px))',
          marginInlineEnd: 'calc(-1 * var(--container-padding-inline-end, 0px))',
          marginBlockStart: 'calc(-1 * var(--container-padding-block-start, 0px))',
          marginBlockEnd: 'calc(-1 * var(--container-padding-block-end, 0px))',
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          minHeight: 0,
          minWidth: 0,
        },
        inner: {
          '--container-padding-inline-start': '0px',
          '--container-padding-inline-end': '0px',
          '--container-padding-block-start': '0px',
          '--container-padding-block-end': '0px',
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          minHeight: 0,
          minWidth: 0,
        },
        middle: {
          display: 'flex',
          flex: '1 1 auto',
          minHeight: 0,
          minWidth: 0,
        },
      },
      variants: {
        height: {
          fill: { root: { flex: '1 1 auto', minHeight: 0, overflow: 'hidden' } },
          auto: { root: { flex: 'none' } },
        },
      },
    };
  },
  { layer: 'components' },
);

/**
 * Top chrome band for {@link layout}. Divider when the header slot has
 * `data-divider` or the layout root has `data-divider-header` (set by React
 * `Layout` in Task 3). Edge padding reads layout shell vars from the ancestor root.
 */
export const layoutHeader = typestyles.recipe(
  'layout-header',
  (c) => {
    const shell = getLayoutShellVars();
    const v = c.vars({
      border: { value: t.color.border.default.var, syntax: '<color>' },
    });
    return {
      slots: ['header', 'headerInner'],
      header: {
        flexShrink: 0,
        minWidth: 0,
        paddingInline: shell.padding.outer.x.var,
        paddingBlockStart: shell.padding.outer.y.var,
        paddingBlockEnd: shell.padding.outer.y.var,
        '&[data-divider], [data-divider-header] &': {
          paddingBlockEnd: shell.padding.inner.y.var,
          borderBlockEndWidth: t.borderWidth.default.var,
          borderBlockEndStyle: 'solid',
          borderBlockEndColor: v.border.var,
        },
      },
      headerInner: {
        maxWidth: shell.content.width.var,
        marginInline: 'auto',
        width: '100%',
        minWidth: 0,
      },
    };
  },
  { layer: 'components' },
);

/**
 * Bottom chrome band for {@link layout}. Divider when the footer slot has
 * `data-divider` or the layout root has `data-divider-footer` (set by React
 * `Layout` in Task 3). Edge padding reads layout shell vars from the ancestor root.
 */
export const layoutFooter = typestyles.recipe(
  'layout-footer',
  (c) => {
    const shell = getLayoutShellVars();
    const v = c.vars({
      border: { value: t.color.border.default.var, syntax: '<color>' },
    });
    return {
      slots: ['footer', 'footerInner'],
      footer: {
        flexShrink: 0,
        minWidth: 0,
        paddingInline: shell.padding.outer.x.var,
        paddingBlockEnd: shell.padding.outer.y.var,
        paddingBlockStart: shell.padding.outer.y.var,
        '&[data-divider], [data-divider-footer] &': {
          paddingBlockStart: shell.padding.inner.y.var,
          borderBlockStartWidth: t.borderWidth.default.var,
          borderBlockStartStyle: 'solid',
          borderBlockStartColor: v.border.var,
        },
      },
      footerInner: {
        maxWidth: shell.content.width.var,
        marginInline: 'auto',
        width: '100%',
        minWidth: 0,
      },
    };
  },
  { layer: 'components' },
);

/**
 * Flex-1 main column for {@link layout}. Edge-aware padding uses `data-has-*`
 * attributes on the layout root; defaults to outer padding on exposed edges.
 */
export const layoutContent = typestyles.recipe(
  'layout-content',
  {
    slots: ['content'],
    variants: {
      isScrollable: zoneScrollable,
      padding: zonePadding,
    },
  },
  () => {
    const shell = getLayoutShellVars();
    return {
      base: {
        content: {
          flex: '1 1 auto',
          minWidth: 0,
          minHeight: 0,
          paddingInlineStart: shell.padding.outer.x.var,
          paddingInlineEnd: shell.padding.outer.x.var,
          paddingBlockStart: shell.padding.outer.y.var,
          paddingBlockEnd: shell.padding.outer.y.var,
          '[data-has-start] &': {
            paddingInlineStart: shell.padding.inner.x.var,
          },
          '[data-has-end] &': {
            paddingInlineEnd: shell.padding.inner.x.var,
          },
          '[data-has-header] &': {
            paddingBlockStart: shell.padding.inner.y.var,
          },
          '[data-has-footer] &': {
            paddingBlockEnd: shell.padding.inner.y.var,
          },
        },
      },
      variants: {
        isScrollable: {
          true: {
            content: { overflow: 'auto' },
          },
          false: {
            content: { overflow: 'visible' },
          },
        },
        padding: {
          inherit: {},
          '0': {
            content: { padding: 0 },
          },
        },
      },
    };
  },
  { layer: 'components' },
);

/**
 * Fixed-width side panel for {@link layout} start/end slots, plus overlay
 * slots for responsive drawer mode. Divider borders target the content-facing
 * edge via `data-side`; negative margins collapse inner padding when seamless.
 */
export const layoutPanel = typestyles.recipe(
  'layout-panel',
  {
    slots: ['panel', 'overlay', 'overlayBackdrop'],
    variants: {
      isScrollable: zoneScrollable,
      hasDivider: panelDivider,
      padding: zonePadding,
    },
  },
  (c) => {
    const shell = getLayoutShellVars();
    const v = c.vars({
      border: { ...atProperty.color, value: t.color.border.default.var },
      overlayBackground: { ...atProperty.color, value: t.color.overlay.backdrop.var },
      panelBackground: { ...atProperty.color, value: t.color.background.surface.var },
    });
    return {
      vars: v,
      base: {
        panel: {
          flexShrink: 0,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          paddingInlineStart: shell.padding.outer.x.var,
          paddingInlineEnd: shell.padding.outer.x.var,
          paddingBlockStart: shell.padding.outer.y.var,
          paddingBlockEnd: shell.padding.outer.y.var,
          '[data-has-header] &': {
            paddingBlockStart: shell.padding.inner.y.var,
          },
          '[data-has-footer] &': {
            paddingBlockEnd: shell.padding.inner.y.var,
          },
          '&[data-side="start"]': {
            paddingInlineStart: shell.padding.outer.x.var,
            paddingInlineEnd: shell.padding.inner.x.var,
            '[data-has-start] &': {
              paddingInlineStart: shell.padding.inner.x.var,
            },
          },
          '&[data-side="end"]': {
            paddingInlineStart: shell.padding.inner.x.var,
            paddingInlineEnd: shell.padding.outer.x.var,
            '[data-has-end] &': {
              paddingInlineEnd: shell.padding.inner.x.var,
            },
          },
        },
        overlayBackdrop: {
          position: 'fixed',
          inset: 0,
          backgroundColor: v.overlayBackground.var,
        },
        overlay: {
          position: 'fixed',
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          backgroundColor: v.panelBackground.var,
          boxShadow: t.shadow.lg.var,
          '&[data-side="start"]': {
            insetInlineStart: 0,
            borderInlineEndWidth: t.borderWidth.default.var,
            borderInlineEndStyle: 'solid',
            borderInlineEndColor: v.border.var,
          },
          '&[data-side="end"]': {
            insetInlineEnd: 0,
            borderInlineStartWidth: t.borderWidth.default.var,
            borderInlineStartStyle: 'solid',
            borderInlineStartColor: v.border.var,
          },
        },
      },
      variants: {
        isScrollable: {
          true: {
            panel: { overflow: 'auto' },
            overlay: { overflow: 'auto' },
          },
          false: {
            panel: { overflow: 'visible' },
            overlay: { overflow: 'visible' },
          },
        },
        hasDivider: {
          true: {
            panel: {
              '&[data-side="start"]': {
                borderInlineEndWidth: t.borderWidth.default.var,
                borderInlineEndStyle: 'solid',
                borderInlineEndColor: v.border.var,
              },
              '&[data-side="end"]': {
                borderInlineStartWidth: t.borderWidth.default.var,
                borderInlineStartStyle: 'solid',
                borderInlineStartColor: v.border.var,
              },
            },
          },
          false: {
            panel: {
              '&[data-side="start"]': {
                marginInlineEnd: `calc(-1 * ${shell.padding.inner.x.var})`,
              },
              '&[data-side="end"]': {
                marginInlineStart: `calc(-1 * ${shell.padding.inner.x.var})`,
              },
            },
          },
        },
        padding: {
          inherit: {},
          '0': {
            panel: { padding: 0 },
          },
        },
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type LayoutVariantProps = RecipeVariants<typeof layout>;

/** Visual props derived from the schema. */
export type LayoutHeaderVariantProps = RecipeVariants<typeof layoutHeader>;

/** Visual props derived from the schema. */
export type LayoutFooterVariantProps = RecipeVariants<typeof layoutFooter>;

/** Visual props derived from the schema. */
export type LayoutContentVariantProps = RecipeVariants<typeof layoutContent>;

/** Visual props derived from the schema. */
export type LayoutPanelVariantProps = RecipeVariants<typeof layoutPanel>;
