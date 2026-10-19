import { atProperty, variant, type RecipeVariants, type VariantOptions } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

const appShellHeight = variant.enum(['fill', 'auto'], { default: 'fill' });
const appShellVariant = variant.enum(['wash', 'surface', 'section', 'elevated'], {
  default: 'wash',
});
const appShellContentPaddingValues = ['0', '1', '2', '3', '4', '5', '6', '8'] as const;
const appShellContentPadding = variant.enum(appShellContentPaddingValues, { default: '0' });

/** Turns the numeric-string axis options into the public numeric space steps. */
type NumericSteps<S extends string> = S extends `${infer Step extends number}` ? Step : never;

/** `appShell` `contentPadding` variant — design-token space steps. */
export type AppShellContentPadding = NumericSteps<VariantOptions<typeof appShellContentPadding>>;

/**
 * Application chrome shell: optional banner, top nav, side nav, main, and
 * aside content in a CSS grid layout. Pair with the React `AppShell`
 * compound, which sets `data-mobile` on the root below the breakpoint and
 * `data-aside` when aside content is provided.
 *
 * Shell dimensions are CSS vars on the recipe (`contentPadding`, `asideWidth`,
 * `sideNavWidth`) — override via variants or theme `components.appShell`.
 *
 * ```tsx
 * const s = appShell({ height: 'fill', variant: 'surface', contentPadding: '0' });
 * <div className={s.root} data-mobile={isMobile || undefined} data-aside={hasAside ? '' : undefined}>
 *   …
 * </div>
 * ```
 */
export const appShell = typestyles.recipe(
  'app-shell',
  {
    slots: ['root', 'banner', 'frame', 'topNav', 'sideNav', 'main', 'aside', 'skipLink'],
    variants: {
      height: appShellHeight,
      variant: appShellVariant,
      contentPadding: appShellContentPadding,
    },
  },
  (c) => {
    const v = c.vars({
      background: {
        ...atProperty.color,
        value: t.color.background.app.var,
      },
      border: {
        ...atProperty.color,
        value: t.color.border.default.var,
      },
      contentPadding: {
        ...atProperty.length,
        value: '0px',
      },
      asideWidth: {
        ...atProperty.length,
        value: '12.5rem',
      },
      sideNavWidth: {
        ...atProperty.union(atProperty.length, { syntax: 'auto' }),
        value: 'auto',
      },
    });
    const transition = `transform ${t.duration.fast.var} ${t.easing.standard.var}`;

    return {
      vars: v,
      base: {
        root: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          backgroundColor: v.background.var,
        },
        skipLink: {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
          '&:focus-visible': {
            position: 'fixed',
            top: t.space[2].var,
            insetInlineStart: t.space[2].var,
            zIndex: t.zIndex.max.var,
            width: 'auto',
            height: 'auto',
            margin: 0,
            padding: `${t.space[2].var} ${t.space[3].var}`,
            overflow: 'visible',
            clip: 'auto',
            whiteSpace: 'normal',
            borderRadius: t.radius.md.var,
            backgroundColor: t.color.background.surface.var,
            color: t.color.text.primary.var,
            boxShadow: t.shadow.md.var,
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
            textDecoration: 'none',
            fontSize: t.fontSize.sm.var,
            fontWeight: t.fontWeight.medium.var,
          },
        },
        banner: {
          flexShrink: 0,
        },
        frame: {
          display: 'grid',
          flex: '1 1 auto',
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
          gridTemplateAreas: '"top top" "side main"',
          gridTemplateColumns: 'auto 1fr',
          gridTemplateRows: 'auto 1fr',
          '[data-has-side-nav] &': {
            gridTemplateColumns: `${v.sideNavWidth.var} 1fr`,
          },
          '[data-aside] &': {
            gridTemplateAreas: '"top top top" "side main aside"',
            gridTemplateColumns: `auto 1fr ${v.asideWidth.var}`,
          },
          '[data-has-side-nav][data-aside] &': {
            gridTemplateColumns: `${v.sideNavWidth.var} 1fr ${v.asideWidth.var}`,
          },
          '[data-aside]:not([data-has-side-nav]) &': {
            gridTemplateAreas: '"top top" "main aside"',
            gridTemplateColumns: `1fr ${v.asideWidth.var}`,
          },
          '[data-side-nav-collapsed] &': {
            gridTemplateAreas: '"top top" "main main"',
            gridTemplateColumns: '1fr',
          },
          '[data-side-nav-collapsed][data-aside] &': {
            gridTemplateAreas: '"top top top" "main aside"',
            gridTemplateColumns: `1fr ${v.asideWidth.var}`,
          },
          '[data-side-nav-collapsed][data-aside-collapsed] &': {
            gridTemplateAreas: '"top top" "main main"',
            gridTemplateColumns: '1fr',
          },
          '[data-aside-collapsed] &': {
            gridTemplateAreas: '"top top" "side main"',
            gridTemplateColumns: 'auto 1fr',
          },
          '[data-aside-collapsed][data-has-side-nav] &': {
            gridTemplateColumns: `${v.sideNavWidth.var} 1fr`,
          },
          '[data-layout="alt"] &': {
            gridTemplateAreas: '"side top" "side main"',
            gridTemplateColumns: `${v.sideNavWidth.var} 1fr`,
            gridTemplateRows: 'auto 1fr',
          },
          '[data-layout="alt"][data-aside] &': {
            gridTemplateAreas: '"side top top" "side main aside"',
            gridTemplateColumns: `${v.sideNavWidth.var} 1fr ${v.asideWidth.var}`,
          },
          '[data-layout="alt"][data-side-nav-collapsed] &': {
            gridTemplateAreas: '"top" "main"',
            gridTemplateColumns: '1fr',
          },
          '[data-layout="alt"][data-side-nav-collapsed][data-aside] &': {
            gridTemplateAreas: '"top top" "main aside"',
            gridTemplateColumns: `1fr ${v.asideWidth.var}`,
          },
          '[data-layout="alt"][data-side-nav-collapsed][data-aside-collapsed] &': {
            gridTemplateAreas: '"top" "main"',
            gridTemplateColumns: '1fr',
          },
          '[data-layout="alt"][data-aside-collapsed] &': {
            gridTemplateAreas: '"side top" "side main"',
            gridTemplateColumns: `${v.sideNavWidth.var} 1fr`,
          },
          '[data-header-hidden]:not([data-header-offset]) &': {
            gridTemplateRows: '0fr 1fr',
          },
          '[data-mobile] &': {
            gridTemplateAreas: '"top" "main"',
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto 1fr',
          },
        },
        topNav: {
          gridArea: 'top',
          minWidth: 0,
          zIndex: 2,
          flexShrink: 0,
          transition,
          '[data-header-hidden][data-header-offset] &': {
            transform: 'translateY(-100%)',
          },
          '[data-header-hidden]:not([data-header-offset]) &': {
            transform: 'none',
            minHeight: 0,
            height: 0,
            overflow: 'hidden',
            visibility: 'hidden',
          },
        },
        sideNav: {
          gridArea: 'side',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
          transition,
          '[data-has-side-nav] &': {
            width: v.sideNavWidth.var,
          },
          '[data-side-nav-collapsed] &': {
            display: 'none',
          },
          '[data-mobile] &': {
            display: 'none',
          },
        },
        main: {
          gridArea: 'main',
          minHeight: 0,
          minWidth: 0,
          overflow: 'auto',
          padding: v.contentPadding.var,
        },
        aside: {
          gridArea: 'aside',
          minHeight: 0,
          minWidth: 0,
          overflow: 'auto',
          position: 'sticky',
          top: 0,
          alignSelf: 'start',
          maxHeight: '100%',
          transition,
          '[data-aside] &': {
            width: v.asideWidth.var,
          },
          '[data-aside-collapsed] &': {
            display: 'none',
          },
          '[data-mobile] &': {
            display: 'none',
          },
        },
      },
      variants: {
        height: {
          fill: {
            root: {
              minHeight: '100dvh',
              height: '100dvh',
              maxHeight: '100dvh',
              overflow: 'hidden',
            },
          },
          auto: {
            root: {
              minHeight: 'auto',
              height: 'auto',
            },
          },
        },
        variant: {
          wash: {
            root: { [v.background.name]: t.color.background.app.var },
          },
          surface: {
            root: { [v.background.name]: t.color.background.surface.var },
          },
          section: {
            root: {
              [v.background.name]: t.color.background.surface.var,
              borderWidth: t.borderWidth.default.var,
              borderStyle: 'solid',
              borderColor: v.border.var,
              borderRadius: t.radius.lg.var,
              boxShadow: t.shadow.xs.var,
            },
          },
          elevated: {
            root: {
              [v.background.name]: t.color.background.elevated.var,
              boxShadow: t.shadow.sm.var,
            },
          },
        },
        contentPadding: {
          '0': { root: { [v.contentPadding.name]: '0px' } },
          '1': { root: { [v.contentPadding.name]: t.space[1].var } },
          '2': { root: { [v.contentPadding.name]: t.space[2].var } },
          '3': { root: { [v.contentPadding.name]: t.space[3].var } },
          '4': { root: { [v.contentPadding.name]: t.space[4].var } },
          '5': { root: { [v.contentPadding.name]: t.space[5].var } },
          '6': { root: { [v.contentPadding.name]: t.space[6].var } },
          '8': { root: { [v.contentPadding.name]: t.space[8].var } },
        },
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type AppShellVariantProps = RecipeVariants<typeof appShell>;
