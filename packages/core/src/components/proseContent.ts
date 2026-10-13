import { breakpoint, typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

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
export const proseContent = typestyles.recipe(
  'docs-prose',
  (c) => {
    const v = c.vars({
      foreground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      secondaryColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      blockquoteBorder: {
        value: t.color.border.strong.var,
        syntax: '<color>',
      },
      blockquoteBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      preBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      preBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      inlineCodeBackground: {
        value: `color-mix(in srgb, ${t.color.tone.accent.foreground.var} 10%, ${t.color.background.subtle.var})`,
        syntax: '<color>',
      },
      tableBorder: {
        value: t.color.border.strong.var,
        syntax: '<color>',
      },
      tableHeaderBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      tableCellBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
    });
    return {
      slots: ['root', 'tableWrap', 'headingAnchor'],
      root: {
        fontFamily: t.fontFamily.body.var,
        fontSize: t.fontSize.md.var,
        lineHeight: 1.75,
        'html[data-mode="dark"] &': {
          lineHeight: 1.82,
        },
        '@media (prefers-color-scheme: dark)': {
          'html:not([data-mode="light"]) &': {
            lineHeight: 1.82,
          },
        },
        color: v.foreground.var,
        '& h1': {
          fontFamily: t.fontFamily.display.var,
          fontStyle: 'italic',
          fontSize: '28px',
          fontWeight: t.fontWeight.bold.var,
          letterSpacing: t.letterSpacing.tight.var,
          lineHeight: 1.25,
          marginTop: 0,
          marginBottom: t.space[3].var,
          color: t.color.text.primary.var,
          [belowMd]: {
            fontSize: '24px',
            marginBottom: t.space[2].var,
          },
        },
        /**
         * H2 as editorial section break — italic Fraunces with a full-width hairline rule above it.
         * First H2 after an intro gets no rule (description block already provides one).
         */
        '& h2': {
          fontFamily: t.fontFamily.display.var,
          fontStyle: 'italic',
          fontSize: '24px',
          fontWeight: t.fontWeight.bold.var,
          letterSpacing: t.letterSpacing.tight.var,
          lineHeight: 1.25,
          marginTop: t.space[8].var,
          marginBottom: t.space[3].var,
          paddingTop: t.space[5].var,
          borderTop: t.stroke.strong.var,
          color: t.color.text.primary.var,
          [belowMd]: {
            fontSize: '21px',
            marginTop: t.space[6].var,
            paddingTop: t.space[4].var,
          },
        },
        '& > h2:first-of-type, & > h2:first-child': {
          marginTop: t.space[4].var,
          paddingTop: 0,
          borderTop: 'none',
        },
        '& h2:first-child': {
          marginTop: 0,
        },
        '& h3': {
          fontFamily: t.fontFamily.display.var,
          fontSize: '17px',
          fontWeight: t.fontWeight.semibold.var,
          lineHeight: 1.35,
          marginTop: t.space[5].var,
          marginBottom: t.space[2].var,
          color: t.color.text.primary.var,
          [belowMd]: {
            marginTop: t.space[4].var,
          },
        },
        '& h4, & h5, & h6': {
          fontFamily: t.fontFamily.display.var,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          marginTop: t.space[4].var,
          marginBottom: t.space[1].var,
          color: t.color.text.primary.var,
          [belowMd]: {
            marginTop: t.space[3].var,
          },
        },
        '& h2, & h3, & h4, & h5, & h6': {
          position: 'relative',
        },
        '& p': {
          marginBottom: t.space[4].var,
          [belowMd]: {
            marginBottom: t.space[3].var,
          },
        },
        '& ul, & ol': {
          marginBottom: t.space[3].var,
          paddingLeft: t.space[4].var,
          [belowMd]: {
            marginBottom: t.space[2].var,
            paddingLeft: t.space[3].var,
          },
        },
        '& li': {
          marginBottom: t.space[1].var,
        },
        /**
         * Links carry an always-on tinted underline so they're distinguishable from inline `code`
         * (mono pill on a tinted background). On hover the underline snaps to full accent.
         */
        '& a': {
          color: t.color.tone.accent.foreground.var,
          textDecoration: 'underline',
          textDecorationThickness: '1px',
          textUnderlineOffset: '3px',
          textDecorationColor: `color-mix(in srgb, ${t.color.tone.accent.foreground.var} 40%, transparent)`,
          fontWeight: t.fontWeight.medium.var,
          transition: t.transition.colorShift.var,
          '&:hover': {
            color: t.color.link.hover.var,
            textDecorationColor: 'currentColor',
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
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
          backgroundColor: v.inlineCodeBackground.var,
          padding: `1px ${t.space[1].var}`,
          borderRadius: t.radius.sm.var,
          whiteSpace: 'nowrap',
        },
        '& a code': {
          color: 'inherit',
          backgroundColor: v.inlineCodeBackground.var,
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
          backgroundColor: v.preBackground.var,
          padding: t.space[3].var,
          borderRadius: t.radius.md.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.preBorder.var,
          overflow: 'auto',
          marginBottom: t.space[3].var,
          [belowMd]: {
            padding: t.space[2].var,
            marginBottom: t.space[2].var,
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
          marginBlock: t.space[5].var,
          [belowMd]: {
            marginBlock: t.space[4].var,
          },
        },
        '& [data-codeblock] + [data-codeblock]': {
          marginTop: t.space[3].var,
        },
        '& [data-codeblock]:first-child': {
          marginTop: 0,
        },
        '& [data-codeblock]:last-child': {
          marginBottom: 0,
        },
        /** Brutalist callout — full ink border + hard shadow offset, no side stripe. */
        '& blockquote': {
          margin: `${t.space[5].var} 0`,
          padding: `${t.space[4].var} ${t.space[5].var}`,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.blockquoteBorder.var,
          backgroundColor: v.blockquoteBackground.var,
          boxShadow: t.shadow.sm.var,
          color: v.foreground.var,
          fontStyle: 'normal',
          [belowMd]: {
            margin: `${t.space[4].var} 0`,
            padding: `${t.space[3].var} ${t.space[4].var}`,
          },
        },
        '& blockquote p': {
          marginBottom: t.space[2].var,
        },
        '& blockquote p:last-child': {
          marginBottom: 0,
        },
        '& kbd': {
          fontFamily: t.fontFamily.mono.var,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          padding: `2px ${t.space[2].var}`,
          borderRadius: t.radius.sm.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: t.color.border.strong.var,
          backgroundColor: t.color.background.surface.var,
          boxShadow: `0 1px 0 ${t.color.border.default.var}`,
          whiteSpace: 'nowrap',
        },
        '& [data-docs-badge]': {
          display: 'inline-flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          lineHeight: 1.2,
          padding: `2px ${t.space[2].var}`,
          borderRadius: t.radius.full.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: t.color.border.default.var,
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
          borderTopWidth: t.borderWidth.default.var,
          borderTopStyle: 'solid',
          borderTopColor: t.color.border.default.var,
          borderRight: 'none',
          borderBottom: 'none',
          borderLeft: 'none',
          margin: `${t.space[5].var} 0`,
          [belowMd]: {
            margin: `${t.space[4].var} 0`,
          },
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          marginBlock: `${t.space[4].var} ${t.space[5].var}`,
          fontSize: t.fontSize.sm.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.tableBorder.var,
        },
        '& thead': {
          backgroundColor: v.tableHeaderBackground.var,
          borderBottomWidth: t.borderWidth.thick.var,
          borderBottomStyle: 'solid',
          borderBottomColor: v.tableBorder.var,
        },
        '& th, & td': {
          textAlign: 'left',
          padding: `${t.space[2].var} ${t.space[3].var}`,
          borderBottomWidth: t.borderWidth.default.var,
          borderBottomStyle: 'solid',
          borderBottomColor: v.tableCellBorder.var,
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
          paddingTop: t.space[2].var,
          fontSize: t.fontSize.sm.var,
          color: t.color.text.secondary.var,
          textAlign: 'left',
        },
        '& [data-prose-heading-anchor]': {
          marginLeft: t.space[2].var,
          fontWeight: t.fontWeight.medium.var,
          color: t.color.text.secondary.var,
          textDecoration: 'none',
          opacity: 0,
          transition: `opacity var(--duration-medium) var(--easing-standard), color var(--duration-medium) var(--easing-standard)`,
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
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
          borderRadius: t.radius.sm.var,
        },
      },
      /** Scroll container for wide GFM tables (wrap HTML manually). */
      tableWrap: {
        overflowX: 'auto',
        marginBottom: t.space[3].var,
        WebkitOverflowScrolling: 'touch',
      },
      /** Applied with `data-prose-heading-anchor`; visual rules live on `root`. */
      headingAnchor: {},
    };
  },
  { layer: 'utilities' },
);
