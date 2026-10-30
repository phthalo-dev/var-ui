import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { borderSide } from '../internal/border';
import { transitionOf } from '../internal/motion';
import { atForcedColors } from '../theme/conditions';
import { forced } from '../internal/forcedColors';
import { controlSizeMetrics, controlSizeVariants } from '../internal/controlSize';
import { controlSize } from '../shared/variantAxes';
import { atProperty, type RecipeVariants } from 'typestyles';

/**
 * Nav landmark tabs for switching between views/routes — no panels. Pair with
 * the panel `tabs` recipe for in-page content switching instead; this is a
 * deliberately separate family with its own tokens. `layout` / `hasDivider` /
 * `orientation` are driven by data attributes on the React `TabList`
 * compound; only density (`size`) is a true recipe variant.
 *
 * ```tsx
 * const s = tabList({ size: 'md' });
 * <nav className={s.root} data-orientation="horizontal" data-layout="hug" data-has-divider>
 *   <a className={s.tab} data-selected aria-current="page">
 *     Overview
 *     <span className={s.indicator} />
 *   </a>
 *   <div className={s.menu}>
 *     <button className={s.menuTrigger}>More</button>
 *   </div>
 * </nav>
 * ```
 */
export const tabList = typestyles.recipe({
  name: 'tab-list',
  layer: 'components',
  slots: ['root', 'tab', 'indicator', 'menu', 'menuTrigger'],
  variants: { size: controlSize },
  vars: {
    tabColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    tabSelectedColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    tabHoverBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    indicatorColor: {
      ...atProperty.color,
      value: t.color.tone.accent.foreground.var,
    },
    dividerColor: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'stretch',
          gap: t.space[1].var,
          '&[data-orientation="vertical"]': {
            flexDirection: 'column',
          },
          '&[data-layout="fill"]': {
            display: 'flex',
            width: '100%',
          },
          '&[data-layout="fill"] > *': {
            flex: '1 1 auto',
          },
          '&[data-has-divider][data-orientation="horizontal"]': {
            ...borderSide('block-end', vars.dividerColor.var),
          },
          '&[data-has-divider][data-orientation="vertical"]': {
            ...borderSide('inline-end', vars.dividerColor.var),
          },
        },
        tab: {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: t.space[2].var,
          border: 'none',
          backgroundColor: 'transparent',
          color: vars.tabColor.var,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          textDecoration: 'none',
          cursor: 'pointer',
          outline: 'none',
          whiteSpace: 'nowrap',
          paddingBlock: 0,
          paddingInline: t.space[3].var,
          '&:hover': {
            backgroundColor: vars.tabHoverBackground.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
          '&[data-selected]': {
            color: vars.tabSelectedColor.var,
            fontWeight: t.fontWeight.semibold.var,
          },
          '&[data-disabled]': {
            color: vars.tabColor.var,
            opacity: t.opacity.disabled.var,
            cursor: 'not-allowed',
            pointerEvents: 'none',
          },
        },
        indicator: {
          position: 'absolute',
          insetInlineStart: t.space[2].var,
          insetInlineEnd: t.space[2].var,
          bottom: 0,
          height: '2px',
          borderRadius: t.radius.sm.var,
          backgroundColor: vars.indicatorColor.var,
          opacity: 0,
          transition: transitionOf('opacity', 'fast'),
          ...atForcedColors(forced.fill),
          '[data-selected] &': {
            opacity: 1,
          },
          '[data-orientation="vertical"] &': {
            insetInlineStart: 0,
            insetInlineEnd: 'auto',
            top: t.space[2].var,
            bottom: t.space[2].var,
            width: '2px',
            height: 'auto',
          },
        },
        menu: {
          display: 'inline-flex',
        },
        menuTrigger: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[1].var,
          border: 'none',
          backgroundColor: 'transparent',
          color: vars.tabColor.var,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          cursor: 'pointer',
          outline: 'none',
          whiteSpace: 'nowrap',
          paddingBlock: 0,
          paddingInline: t.space[3].var,
          '&:hover': {
            backgroundColor: vars.tabHoverBackground.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
          '&[data-selected]': {
            color: vars.tabSelectedColor.var,
            fontWeight: t.fontWeight.semibold.var,
          },
        },
      },
      variants: {
        size: controlSizeVariants((size) => ({
          tab: {
            minHeight: controlSizeMetrics[size].height,
            fontSize: controlSizeMetrics[size].fontSize,
            paddingInline: controlSizeMetrics[size].paddingInline,
          },
          menuTrigger: {
            minHeight: controlSizeMetrics[size].height,
            fontSize: controlSizeMetrics[size].fontSize,
            paddingInline: controlSizeMetrics[size].paddingInline,
          },
        })),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type TabListVariantProps = RecipeVariants<typeof tabList>;
