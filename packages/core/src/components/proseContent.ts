import { atProperty } from 'typestyles';
import { breakpoint, typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border, borderSide } from '../internal/border';
import { transitionOf } from '../internal/motion';

/** Mobile prose density — uses TypeStyles breakpoint map from `runtime.ts`. */
const belowMd = breakpoint('md', 'max');

/** Marks a subtree (a live demo stage, an embedded widget) that prose element styles skip. */
export const PROSE_ISOLATE_ATTRIBUTE = 'data-prose-isolate';

const outsideIsolated = `:not(:where([${PROSE_ISOLATE_ATTRIBUTE}], [${PROSE_ISOLATE_ATTRIBUTE}] *))`;

/** Split a selector list on top-level commas (not the ones inside `:is(…)` / `:not(…)`). */
function splitSelectorList(list: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of list) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts;
}

/**
 * Scope every descendant rule (`& h2`, `& a, & code`, …) so it stops at an isolated subtree:
 * components rendered inside a demo keep their own typography instead of the docs prose ramp.
 */
function isolateDescendantRules<T extends Record<string, unknown>>(styles: T): T {
  return Object.fromEntries(
    Object.entries(styles).map(([key, value]) => {
      if (!key.startsWith('& ')) return [key, value];
      const scoped = splitSelectorList(key)
        .map((part) => `${part}${outsideIsolated}`)
        .join(', ');
      return [scoped, value];
    }),
  ) as T;
}

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
      value: `color-mix(in srgb, ${t.color.text.primary.var} 6%, transparent)`,
    },
    tableBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    tableHeaderBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    tableCellBorder: {
      ...atProperty.color,
      value: t.color.border.subtle.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: isolateDescendantRules({
          fontFamily: t.fontFamily.body.var,
          // Long-form reading size: 16/26, independent of the 14px control scale.
          fontSize: '1rem',
          lineHeight: '1.625rem',
          color: vars.foreground.var,
          overflowWrap: 'break-word',
          '& > :first-child': {
            marginTop: 0,
          },
          '& h1': {
            fontFamily: t.fontFamily.display.var,
            fontSize: '2.75rem',
            fontWeight: t.fontWeight.bold.var,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginTop: 0,
            marginBottom: t.space.md.var,
            color: t.color.text.primary.var,
            [belowMd]: {
              fontSize: '2rem',
            },
          },
          // The paragraph right after the page title is the lead: larger and muted.
          '& > h1 + p': {
            fontSize: '1.1875rem',
            lineHeight: '1.75rem',
            color: vars.secondaryColor.var,
            marginBottom: t.space.lg.var,
            [belowMd]: {
              fontSize: '1.0625rem',
              lineHeight: '1.625rem',
            },
          },
          // H2 opens a major section: 28/34 at 650, 56px of air above it.
          '& h2': {
            fontFamily: t.fontFamily.display.var,
            fontSize: '1.75rem',
            fontWeight: 650,
            letterSpacing: '-0.015em',
            lineHeight: '2.125rem',
            marginTop: '3.5rem',
            marginBottom: t.space.md.var,
            color: t.color.text.primary.var,
            [belowMd]: {
              fontSize: '1.5rem',
              lineHeight: '1.875rem',
              marginTop: t.space.xxl.var,
            },
          },
          '& h3': {
            fontFamily: t.fontFamily.display.var,
            fontSize: '1.25rem',
            fontWeight: t.fontWeight.semibold.var,
            letterSpacing: '-0.01em',
            lineHeight: '1.75rem',
            marginTop: t.space.xl.var,
            marginBottom: t.space.xs.var,
            color: t.color.text.primary.var,
          },
          // An H3 that directly follows its H2 sits closer: they read as one heading group.
          '& h2 + h3': {
            marginTop: t.space.lg.var,
          },
          '& h4, & h5, & h6': {
            fontFamily: t.fontFamily.display.var,
            fontSize: '1rem',
            fontWeight: t.fontWeight.semibold.var,
            lineHeight: '1.5rem',
            marginTop: t.space.lg.var,
            marginBottom: t.space.xxs.var,
            color: t.color.text.primary.var,
          },
          '& h2, & h3, & h4, & h5, & h6': {
            position: 'relative',
          },
          '& p': {
            marginTop: 0,
            marginBottom: t.space.md.var,
          },
          '& ul, & ol': {
            marginTop: 0,
            marginBottom: t.space.md.var,
            paddingInlineStart: '1.25rem',
          },
          '& li': {
            marginBottom: '0.375rem',
            paddingInlineStart: t.space.xxs.var,
          },
          '& li::marker': {
            color: t.color.text.secondary.var,
          },
          '& strong': {
            fontWeight: t.fontWeight.semibold.var,
          },
          // Links: accent text with a quiet 30% underline that firms up on hover.
          '& a': {
            color: t.color.link.default.var,
            textDecoration: 'underline',
            textDecorationThickness: '0.0625rem',
            textUnderlineOffset: '0.1875rem',
            textDecorationColor: `color-mix(in srgb, currentColor 30%, transparent)`,
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
          // Inline `code`: a quiet neutral chip in body color (tight 4px sides, so punctuation
          // sits against it), never competing with links.
          '& :not(pre) > code': {
            fontFamily: t.fontFamily.mono.var,
            fontSize: '0.875em',
            fontWeight: t.fontWeight.normal.var,
            color: t.color.text.primary.var,
            backgroundColor: vars.inlineCodeBackground.var,
            paddingBlock: '0.0625rem',
            paddingInline: '0.25rem',
            borderRadius: t.radius.sm.var,
            boxDecorationBreak: 'clone',
            WebkitBoxDecorationBreak: 'clone',
          },
          // Table cells carry mono text only; the first column keeps the chip because it names
          // the thing the row is about. Everywhere else (prose, lists, leads) code is a chip.
          '& td > code': {
            backgroundColor: 'transparent',
            paddingInline: 0,
          },
          '& td:first-child > code': {
            backgroundColor: vars.inlineCodeBackground.var,
            paddingInline: '0.25rem',
          },
          '& a > code': {
            color: 'inherit',
          },
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
            fontSize: '0.8125rem',
            lineHeight: '1.375rem',
            backgroundColor: vars.preBackground.var,
            padding: `${t.space.md.var} ${t.space.lg.var}`,
            borderRadius: t.radius.lg.var,
            ...border(vars.preBorder.var),
            overflow: 'auto',
            marginBottom: t.space.md.var,
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
          // Code blocks and demos sit as siblings of prose: 24px from text, 12px between a pair.
          '& > :is([data-codeblock], [data-code-block])': {
            marginBlock: t.space.lg.var,
          },
          '& > :is([data-codeblock], [data-code-block]) + :is([data-codeblock], [data-code-block])':
            {
              marginTop: t.space.sm.var,
            },
          '& > :is([data-codeblock], [data-code-block]):first-child': {
            marginTop: 0,
          },
          '& > :is([data-codeblock], [data-code-block]):last-child': {
            marginBottom: 0,
          },
          '& blockquote': {
            margin: `${t.space.lg.var} 0`,
            paddingBlock: t.space.xxs.var,
            paddingInline: `${t.space.md.var} 0`,
            ...borderSide('inline-start', vars.blockquoteBorder.var, t.borderWidth.thick.var),
            color: vars.secondaryColor.var,
            fontStyle: 'normal',
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
            fontSize: t.fontSize.md.var,
            lineHeight: '1.25rem',
            border: 'none',
          },
          '& thead': {
            ...borderSide('block-end', vars.tableBorder.var),
          },
          '& th, & td': {
            textAlign: 'start',
            paddingBlock: t.space.sm.var,
            paddingInline: `0 ${t.space.lg.var}`,
            ...borderSide('block-end', vars.tableCellBorder.var),
            verticalAlign: 'top',
          },
          '& :is(th, td):last-child': {
            paddingInlineEnd: 0,
          },
          '& th': {
            paddingBlock: t.space.xs.var,
            fontWeight: t.fontWeight.semibold.var,
            fontSize: t.fontSize.xs.var,
            color: vars.secondaryColor.var,
            textTransform: 'uppercase',
            letterSpacing: t.letterSpacing.caps.var,
            whiteSpace: 'nowrap',
            backgroundColor: 'transparent',
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
        }),
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
