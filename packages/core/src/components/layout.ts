import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { borderSide } from '../internal/border';
import { designTokens as t } from '../tokens';
import {
  getLayoutShellVars,
  layoutShellVarDefinitions,
  setLayoutShellVars,
} from './layoutShellVars';
import {
  nativeBackdrop,
  nativeDialogReset,
  nativeEnterExit,
  nativeSlideFrom,
} from '../shared/overlayMotion';

export type { LayoutPadding } from './layoutShellVars';
export { layoutContentWidthAssignment, layoutShellPaddingAssignments } from './layoutShellVars';

const layoutHeight = variant.enum(['fill', 'auto'], { default: 'fill' });
const zoneScrollable = variant.boolean({ default: true });
const zonePadding = variant.enum(['inherit', '0'], { default: 'inherit' });
const panelDivider = variant.boolean({ default: false });
const panelResizeHandle = variant.boolean({ default: false });

/**
 * Multi-pane page shell: header/footer bands and a horizontal middle row for
 * start/content/end zones. Sets padding and content-width CSS vars consumed by
 * {@link layoutHeader}, {@link layoutFooter}, {@link layoutContent}, and
 * {@link layoutPanel}. Pair with the React `Layout` compound, which sets
 * `data-has-*` and divider attributes on the root.
 *
 * ```tsx
 * const l = layout({ height: 'fill' });
 * <div className={l.root.className} data-has-header data-has-start data-has-end>
 *   <div className={l.outer.className}><div className={l.inner.className}>
 *     <LayoutHeader>…</LayoutHeader>
 *     <div className={l.middle.className}>
 *       <LayoutPanel data-side="start">…</LayoutPanel>
 *       <LayoutContent>…</LayoutContent>
 *       <LayoutPanel data-side="end">…</LayoutPanel>
 *     </div>
 *     <LayoutFooter>…</LayoutFooter>
 *   </div></div>
 * </div>
 * ```
 */
export const layout = typestyles.recipe({
  name: 'layout',
  layer: 'components',
  slots: ['root', 'outer', 'inner', 'middle'],
  variants: { height: layoutHeight },
  vars: layoutShellVarDefinitions,
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          [vars.padding.outer.x.name]: t.space[4].var,
          [vars.padding.outer.y.name]: t.space[4].var,
          [vars.padding.inner.x.name]: t.space[4].var,
          [vars.padding.inner.y.name]: t.space[4].var,
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
});

setLayoutShellVars(layout.vars);

/**
 * Top chrome band for {@link layout}. Divider when the header slot has
 * `data-divider` or the layout root has `data-divider-header` (set by React
 * `Layout` in Task 3). Edge padding reads layout shell vars from the ancestor root.
 * Assign `layoutHeader.vars.blockSize` to set the band height.
 */
export const layoutHeader = typestyles.recipe({
  name: 'layout-header',
  layer: 'components',
  slots: ['header', 'headerInner'],
  vars: {
    border: { ...atProperty.color, value: t.color.border.default.var },
    blockSize: { syntax: '*', value: 'auto' },
  },
  styles: ({ vars }) => {
    const shell = getLayoutShellVars();
    return {
      base: {
        header: {
          height: vars.blockSize.var,
          flexShrink: 0,
          minWidth: 0,
          paddingInline: shell.padding.outer.x.var,
          paddingBlockStart: shell.padding.outer.y.var,
          paddingBlockEnd: shell.padding.outer.y.var,
          '&[data-divider], [data-divider-header] &': {
            paddingBlockEnd: shell.padding.inner.y.var,
            ...borderSide('block-end', vars.border.var),
          },
        },
        headerInner: {
          maxWidth: shell.content.width.var,
          marginInline: 'auto',
          width: '100%',
          minWidth: 0,
        },
      },
    };
  },
});

/**
 * Bottom chrome band for {@link layout}. Divider when the footer slot has
 * `data-divider` or the layout root has `data-divider-footer` (set by React
 * `Layout` in Task 3). Edge padding reads layout shell vars from the ancestor root.
 * Assign `layoutFooter.vars.blockSize` to set the band height.
 */
export const layoutFooter = typestyles.recipe({
  name: 'layout-footer',
  layer: 'components',
  slots: ['footer', 'footerInner'],
  vars: {
    border: { ...atProperty.color, value: t.color.border.default.var },
    blockSize: { syntax: '*', value: 'auto' },
  },
  styles: ({ vars }) => {
    const shell = getLayoutShellVars();
    return {
      base: {
        footer: {
          height: vars.blockSize.var,
          flexShrink: 0,
          minWidth: 0,
          paddingInline: shell.padding.outer.x.var,
          paddingBlockEnd: shell.padding.outer.y.var,
          paddingBlockStart: shell.padding.outer.y.var,
          '&[data-divider], [data-divider-footer] &': {
            paddingBlockStart: shell.padding.inner.y.var,
            ...borderSide('block-start', vars.border.var),
          },
        },
        footerInner: {
          maxWidth: shell.content.width.var,
          marginInline: 'auto',
          width: '100%',
          minWidth: 0,
        },
      },
    };
  },
});

/**
 * Flex-1 main column for {@link layout}. Edge-aware padding uses `data-has-*`
 * attributes on the layout root; defaults to outer padding on exposed edges.
 */
export const layoutContent = typestyles.recipe({
  name: 'layout-content',
  layer: 'components',
  slots: ['content'],
  variants: {
    scrollable: zoneScrollable,
    padding: zonePadding,
  },
  styles: () => {
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
        scrollable: {
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
});

/**
 * Fixed-width side panel for {@link layout} start/end slots, plus a `popup`
 * slot (native `<dialog>`) for responsive drawer mode. Divider borders target the content-facing
 * edge via `data-side`; negative margins collapse inner padding when seamless.
 */
export const layoutPanel = typestyles.recipe({
  name: 'layout-panel',
  layer: 'components',
  slots: ['panel', 'popup'],
  variants: {
    scrollable: zoneScrollable,
    hasDivider: panelDivider,
    hasResizeHandle: panelResizeHandle,
    padding: zonePadding,
  },
  vars: {
    border: { ...atProperty.color, value: t.color.border.default.var },
    overlayBackground: { ...atProperty.color, value: t.color.overlay.backdrop.var },
    panelBackground: { ...atProperty.color, value: t.color.background.surface.var },
    panelWidth: { syntax: '*', value: 'auto' },
  },
  styles: ({ vars }) => {
    const shell = getLayoutShellVars();
    return {
      base: {
        panel: {
          width: vars.panelWidth.var,
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
        // Responsive overlay mode: the native `<dialog>` that holds the panel body, sliding in
        // from `data-side`.
        popup: {
          ...nativeDialogReset,
          ...nativeEnterExit({ slide: true, backdrop: true, whenOpen: { display: 'flex' } }),
          ...nativeBackdrop(vars.overlayBackground.var),
          margin: 0,
          insetBlock: 0,
          height: '100dvh',
          maxHeight: '100dvh',
          maxWidth: '100vw',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          backgroundColor: vars.panelBackground.var,
          boxShadow: t.shadow.lg.var,
          '&[data-side="start"]': {
            ...nativeSlideFrom('start'),
            insetInlineStart: 0,
            insetInlineEnd: 'auto',
            ...borderSide('inline-end', vars.border.var),
          },
          '&[data-side="end"]': {
            ...nativeSlideFrom('end'),
            insetInlineEnd: 0,
            insetInlineStart: 'auto',
            ...borderSide('inline-start', vars.border.var),
          },
        },
      },
      variants: {
        scrollable: {
          true: {
            panel: { overflow: 'auto' },
            popup: { overflow: 'auto' },
          },
          false: {
            panel: { overflow: 'visible' },
            popup: { overflow: 'visible' },
          },
        },
        hasDivider: {
          true: {
            panel: {
              '&[data-side="start"]': {
                ...borderSide('inline-end', vars.border.var),
              },
              '&[data-side="end"]': {
                ...borderSide('inline-start', vars.border.var),
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
        // Declared after `hasDivider` so it wins: a sibling resize handle sits at the
        // panel edge, so the seamless negative margin must not pull it inside.
        hasResizeHandle: {
          true: {
            panel: {
              '&[data-side="start"]': { marginInlineEnd: 0 },
              '&[data-side="end"]': { marginInlineStart: 0 },
            },
          },
          false: {},
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
});

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
