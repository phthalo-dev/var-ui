import { atProperty } from 'typestyles';
import { breakpoint, typestyles } from '../runtime';
import { atDarkMode } from '../theme/conditions';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border, borderSide } from '../internal/border';
import { transitionOf } from '../internal/motion';

/** Mobile prose density — uses TypeStyles breakpoint map from `runtime.ts`. */
const belowMd = breakpoint('md', 'max');

/**
 * Long-form / markdown prose primitives: blockquote, kbd, inline badges, tables, dividers,
 * heading permalink anchors, lists, and a responsive vertical rhythm.
 *
 * Apply `proseContent.root` on the wrapper around rendered markdown HTML.
 *
 * Body typography and link accents intentionally follow semantic color tokens directly so
 * prose tracks `--color-text-*` / `--color-accent-*` without per-element component vars.
 * Surface chrome (blockquote, fenced pre, tables) uses `c.vars()` for theme overrides.
 */
export const proseContent = typestyles.recipe({
  name: 'docs-prose',
  layer: 'utilities',
  slots: ['root', 'tableWrap', 'headingAnchor'],
  vars: {
    foreground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    secondaryColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    blockquoteBorder: {
      ...atProperty.color,
      value: t.color.border.strong.var,
    },
    blockquoteBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    preBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    preBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    inlineCodeBackground: {
      ...atProperty.color,
      value: `color-mix(in srgb, ${t.color.tone.accent.foreground.var} 10%, ${t.color.background.subtle.var})`,
    },
    tableBorder: {
      ...atProperty.color,
      value: t.color.border.strong.var,
    },
    tableHeaderBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    tableCellBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          fontFamily: t.fontFamily.body.var,
          fontSize: t.fontSize.md.var,
          lineHeight: 1.75,
          ...atDarkMode({ lineHeight: 1.82 }),
          color: vars.foreground.var,
          '& h1': {
            fontFamily: t.fontFamily.display.var,
            fontStyle: 'italic',
            fontSize: t.fontSize.xxxl.var,
            fontWeight: t.fontWeight.bold.var,
            letterSpacing: t.letterSpacing.tight.var,
            lineHeight: 1.25,
            marginTop: 0,
            marginBottom: t.space.sm.var,
            color: t.color.text.primary.var,
            [belowMd]: {
              fontSize: t.fontSize.xxl.var,
              marginBottom: t.space.xs.var,
            },
          },
          /**
           * H2 as editorial section break — italic Fraunces with a full-width hairline rule above it.
           * First H2 after an intro gets no rule (description block already provides one).
           */
          '& h2': {
            fontFamily: t.fontFamily.display.var,
            fontStyle: 'italic',
            fontSize: t.fontSize.xxl.var,
            fontWeight: t.fontWeight.bold.var,
            letterSpacing: t.letterSpacing.tight.var,
            lineHeight: 1.25,
            marginTop: t.space.xxxl.var,
            marginBottom: t.space.sm.var,
            paddingTop: t.space.lg.var,
            borderTop: t.stroke.strong.var,
            color: t.color.text.primary.var,
            [belowMd]: {
              fontSize: t.fontSize['xl'].var,
              marginTop: t.space.xl.var,
              paddingTop: t.space.md.var,
            },
          },
          '& > h2:first-of-type, & > h2:first-child': {
            marginTop: t.space.md.var,
            paddingTop: 0,
            borderTop: 'none',
          },
          '& h2:first-child': {
            marginTop: 0,
          },
          '& h3': {
            fontFamily: t.fontFamily.display.var,
            fontSize: t.fontSize['lg'].var,
            fontWeight: t.fontWeight.semibold.var,
            lineHeight: 1.35,
            marginTop: t.space.lg.var,
            marginBottom: t.space.xs.var,
            color: t.color.text.primary.var,
            [belowMd]: {
              marginTop: t.space.md.var,
            },
          },
          '& h4, & h5, & h6': {
            fontFamily: t.fontFamily.display.var,
            fontSize: t.fontSize.md.var,
            fontWeight: t.fontWeight.semibold.var,
            marginTop: t.space.md.var,
            marginBottom: t.space.xxs.var,
            color: t.color.text.primary.var,
            [belowMd]: {
              marginTop: t.space.sm.var,
            },
          },
          '& h2, & h3, & h4, & h5, & h6': {
            position: 'relative',
          },
          '& p': {
            marginBottom: t.space.md.var,
            [belowMd]: {
              marginBottom: t.space.sm.var,
            },
          },
          '& ul, & ol': {
            marginBottom: t.space.sm.var,
            paddingInlineStart: t.space.md.var,
            [belowMd]: {
              marginBottom: t.space.xs.var,
              paddingInlineStart: t.space.sm.var,
            },
          },
          '& li': {
            marginBottom: t.space.xxs.var,
          },
          /**
           * Links carry an always-on tinted underline so they're distinguishable from inline `code`
           * (mono pill on a tinted background). On hover the underline snaps to full accent.
           */
          '& a': {
            color: t.color.tone.accent.foreground.var,
            textDecoration: 'underline',
            textDecorationThickness: '0.0625rem',
            textUnderlineOffset: '0.1875rem',
            textDecorationColor: `color-mix(in srgb, ${t.color.tone.accent.foreground.var} 40%, transparent)`,
            fontWeight: t.fontWeight.medium.var,
            transition: t.transition.colorShift.var,
            '&:hover': {
              color: t.color.link.hover.var,
              textDecorationColor: 'currentColor',
            },
            '&:focus-visible': {
              ...focusRing,
              borderRadius: t.radius.sm.var,
            },
          },
          /**
           * Inline `code` — mono pill on a tinted surface. Background + font differentiate it from
           * anchors (underline only).
           */
          '& code': {
            fontFamily: t.fontFamily.mono.var,
            fontSize: '0.92em',
            fontWeight: t.fontWeight.medium.var,
            color: t.color.link.hover.var,
            backgroundColor: vars.inlineCodeBackground.var,
            padding: `0.0625rem ${t.space.xxs.var}`,
            borderRadius: t.radius.sm.var,
            whiteSpace: 'nowrap',
          },
          '& a code': {
            color: 'inherit',
            backgroundColor: vars.inlineCodeBackground.var,
          },
          /**
           * Alert / callout anchor links inherit the callout's color and invert the underline behavior
           * (always present, removed on hover) so they read as integrated copy, not detached CTAs.
           */
          '& a[data-alert-action]': {
            color: 'inherit',
            fontWeight: 'inherit',
            textDecoration: 'underline',
            textDecorationColor: 'currentColor',
            '&:hover': {
              color: 'inherit',
              textDecoration: 'none',
            },
          },
          '& pre:not([data-codeblock-pre])': {
            fontFamily: t.fontFamily.mono.var,
            fontSize: t.fontSize.sm.var,
            lineHeight: 1.6,
            backgroundColor: vars.preBackground.var,
            padding: t.space.sm.var,
            borderRadius: t.radius.md.var,
            ...border(vars.preBorder.var),
            overflow: 'auto',
            marginBottom: t.space.sm.var,
            [belowMd]: {
              padding: t.space.xs.var,
              marginBottom: t.space.xs.var,
            },
          },
          '& pre code': {
            backgroundColor: 'transparent',
            padding: 0,
            border: 'none',
            borderRadius: 0,
            fontSize: 'inherit',
            fontWeight: 'inherit',
            color: 'inherit',
            whiteSpace: 'pre',
          },
          /**
           * Fenced code blocks (rendered via `markdownCodeBlockHtml`) sit as siblings of prose.
           * Give them generous breathing room from surrounding prose, but collapse the gap when two
           * blocks sit adjacent — consecutive examples should read as a pair, not two islands.
           */
          '& [data-codeblock]': {
            marginBlock: t.space.lg.var,
            [belowMd]: {
              marginBlock: t.space.md.var,
            },
          },
          '& [data-codeblock] + [data-codeblock]': {
            marginTop: t.space.sm.var,
          },
          '& [data-codeblock]:first-child': {
            marginTop: 0,
          },
          '& [data-codeblock]:last-child': {
            marginBottom: 0,
          },
          /** Brutalist callout — full ink border + hard shadow offset, no side stripe. */
          '& blockquote': {
            margin: `${t.space.lg.var} 0`,
            padding: `${t.space.md.var} ${t.space.lg.var}`,
            ...border(vars.blockquoteBorder.var),
            backgroundColor: vars.blockquoteBackground.var,
            boxShadow: t.shadow.sm.var,
            color: vars.foreground.var,
            fontStyle: 'normal',
            [belowMd]: {
              margin: `${t.space.md.var} 0`,
              padding: `${t.space.sm.var} ${t.space.md.var}`,
            },
          },
          '& blockquote p': {
            marginBottom: t.space.xs.var,
          },
          '& blockquote p:last-child': {
            marginBottom: 0,
          },
          '& kbd': {
            fontFamily: t.fontFamily.mono.var,
            fontSize: t.fontSize.sm.var,
            fontWeight: t.fontWeight.medium.var,
            padding: `0.125rem ${t.space.xs.var}`,
            borderRadius: t.radius.sm.var,
            ...border(t.color.border.strong.var),
            backgroundColor: t.color.background.surface.var,
            boxShadow: `0 0.0625rem 0 ${t.color.border.default.var}`,
            whiteSpace: 'nowrap',
          },
          '& [data-docs-badge]': {
            display: 'inline-flex',
            alignItems: 'center',
            boxSizing: 'border-box',
            fontSize: t.fontSize.sm.var,
            fontWeight: t.fontWeight.medium.var,
            lineHeight: 1.2,
            padding: `0.125rem ${t.space.xs.var}`,
            borderRadius: t.radius.full.var,
            ...border(),
            backgroundColor: t.color.background.subtle.var,
            color: t.color.text.primary.var,
            verticalAlign: '0.08em',
          },
          '& [data-docs-badge][data-docs-badge-tone="success"]': {
            borderColor: `color-mix(in srgb, ${t.color.tone.success.foreground.var} 45%, ${t.color.border.default.var})`,
            backgroundColor: `color-mix(in srgb, ${t.color.tone.success.foreground.var} 14%, ${t.color.background.surface.var})`,
            color: `color-mix(in srgb, ${t.color.tone.success.foreground.var} 85%, ${t.color.text.primary.var})`,
          },
          '& [data-docs-badge][data-docs-badge-tone="warning"]': {
            borderColor: `color-mix(in srgb, ${t.color.tone.warning.foreground.var} 45%, ${t.color.border.default.var})`,
            backgroundColor: `color-mix(in srgb, ${t.color.tone.warning.foreground.var} 16%, ${t.color.background.surface.var})`,
            color: `color-mix(in srgb, ${t.color.tone.warning.foreground.var} 75%, ${t.color.text.primary.var})`,
          },
          '& [data-docs-badge][data-docs-badge-tone="danger"]': {
            borderColor: `color-mix(in srgb, ${t.color.tone.danger.foreground.var} 45%, ${t.color.border.default.var})`,
            backgroundColor: `color-mix(in srgb, ${t.color.tone.danger.foreground.var} 12%, ${t.color.background.surface.var})`,
            color: `color-mix(in srgb, ${t.color.tone.danger.foreground.var} 80%, ${t.color.text.primary.var})`,
          },
          '& [data-docs-badge][data-docs-badge-tone="info"]': {
            borderColor: `color-mix(in srgb, ${t.color.tone.accent.foreground.var} 45%, ${t.color.border.default.var})`,
            backgroundColor: `color-mix(in srgb, ${t.color.tone.accent.foreground.var} 12%, ${t.color.background.surface.var})`,
            color: `color-mix(in srgb, ${t.color.tone.accent.foreground.var} 75%, ${t.color.text.primary.var})`,
          },
          '& hr': {
            ...borderSide('block-start'),
            borderBottom: 'none',
            borderInline: 'none',
            margin: `${t.space.lg.var} 0`,
            [belowMd]: {
              margin: `${t.space.md.var} 0`,
            },
          },
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            marginBlock: `${t.space.md.var} ${t.space.lg.var}`,
            fontSize: t.fontSize.sm.var,
            ...border(vars.tableBorder.var),
          },
          '& thead': {
            backgroundColor: vars.tableHeaderBackground.var,
            ...borderSide('block-end', vars.tableBorder.var, t.borderWidth.thick.var),
          },
          '& th, & td': {
            textAlign: 'start',
            padding: `${t.space.xs.var} ${t.space.sm.var}`,
            ...borderSide('block-end', vars.tableCellBorder.var),
            verticalAlign: 'top',
          },
          '& th': {
            fontWeight: t.fontWeight.bold.var,
            fontSize: t.fontSize.xs.var,
            color: t.color.text.primary.var,
            textTransform: 'uppercase',
            letterSpacing: t.letterSpacing.caps.var,
            fontFamily: t.fontFamily.mono.var,
          },
          '& tr:last-child td': {
            borderBottom: 'none',
          },
          '& caption': {
            captionSide: 'bottom',
            paddingTop: t.space.xs.var,
            fontSize: t.fontSize.sm.var,
            color: t.color.text.secondary.var,
            textAlign: 'start',
          },
          '& [data-prose-heading-anchor]': {
            marginInlineStart: t.space.xs.var,
            fontWeight: t.fontWeight.medium.var,
            color: t.color.text.secondary.var,
            textDecoration: 'none',
            opacity: 0,
            transition: transitionOf(['opacity', 'color']),
          },
          '& [data-prose-heading-anchor]::before': {
            content: '"#"',
            fontSize: '0.85em',
          },
          '& :is(h1, h2, h3, h4, h5, h6):hover [data-prose-heading-anchor]': {
            opacity: 1,
          },
          '& [data-prose-heading-anchor]:focus-visible': {
            opacity: 1,
            ...focusRing,
            borderRadius: t.radius.sm.var,
          },
        },
        /** Scroll container for wide GFM tables (wrap HTML manually). */
        tableWrap: {
          overflowX: 'auto',
          marginBottom: t.space.sm.var,
          WebkitOverflowScrolling: 'touch',
        },
        /** Applied with `data-prose-heading-anchor`; visual rules live on `root`. */
        headingAnchor: {},
      },
    };
  },
});
