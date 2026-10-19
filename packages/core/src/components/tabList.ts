import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlSizeMetrics, controlSizeVariants } from './controlSize';
import { controlSize } from './variantAxes';
import { type RecipeVariants } from 'typestyles';

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
export const tabList = typestyles.recipe(
  'tab-list',
  {
    slots: ['root', 'tab', 'indicator', 'menu', 'menuTrigger'],
    variants: { size: controlSize },
  },
  (c) => {
    const v = c.vars({
      tabColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      tabSelectedColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      tabHoverBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      indicatorColor: {
        value: t.color.tone.accent.foreground.var,
        syntax: '<color>',
      },
      dividerColor: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
    });

    return {
      vars: v,
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
            borderBottomWidth: t.borderWidth.default.var,
            borderBottomStyle: 'solid',
            borderBottomColor: v.dividerColor.var,
          },
          '&[data-has-divider][data-orientation="vertical"]': {
            borderInlineEndWidth: t.borderWidth.default.var,
            borderInlineEndStyle: 'solid',
            borderInlineEndColor: v.dividerColor.var,
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
          color: v.tabColor.var,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          textDecoration: 'none',
          cursor: 'pointer',
          outline: 'none',
          whiteSpace: 'nowrap',
          paddingBlock: 0,
          paddingInline: t.space[3].var,
          '&:hover': {
            backgroundColor: v.tabHoverBackground.var,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
          },
          '&[data-selected]': {
            color: v.tabSelectedColor.var,
            fontWeight: t.fontWeight.semibold.var,
          },
          '&[data-disabled]': {
            color: v.tabColor.var,
            opacity: 0.5,
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
          backgroundColor: v.indicatorColor.var,
          opacity: 0,
          transition: `opacity ${t.duration.fast.var} ${t.easing.standard.var}`,
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
          color: v.tabColor.var,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          cursor: 'pointer',
          outline: 'none',
          whiteSpace: 'nowrap',
          paddingBlock: 0,
          paddingInline: t.space[3].var,
          '&:hover': {
            backgroundColor: v.tabHoverBackground.var,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
          },
          '&[data-selected]': {
            color: v.tabSelectedColor.var,
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
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type TabListVariantProps = RecipeVariants<typeof tabList>;
