import { reset } from 'typestyles/globals';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { atReducedMotion } from './conditions';
import { COLOR_MODE_ATTRIBUTE } from './constants';
import { global } from '../runtime';

const resetLayer = 'reset';
const baseLayer = 'base';
const tokenLayer = 'tokens';

/**
 * Document globals shipped with `@var-ui/core/styles`: `color-scheme` for root and
 * {@link COLOR_MODE_ATTRIBUTE} pins, Josh Comeau CSS reset, and token-driven defaults for
 * bare HTML elements. Registered in the `tokens`, `reset`, and `base` cascade layers so
 * component recipes in higher layers can override.
 *
 * Side effect on import via the styles extract entry. Re-call after `reset()` in tests.
 */
export function registerBaseStyles(): void {
  global.rules(
    {
      ':root': { colorScheme: 'light dark' },
      // Doubled so the pin outranks the theme class's `color-scheme: light dark` in the same layer.
      [`[${COLOR_MODE_ATTRIBUTE}="dark"][${COLOR_MODE_ATTRIBUTE}="dark"]`]: {
        colorScheme: 'dark',
      },
      [`[${COLOR_MODE_ATTRIBUTE}="light"][${COLOR_MODE_ATTRIBUTE}="light"]`]: {
        colorScheme: 'light',
      },
    },
    { layer: tokenLayer },
  );

  global.apply(...reset({ layer: resetLayer, includeAppRootIsolation: false }));

  global.rules(
    {
      html: {
        scrollBehavior: 'smooth',
        // Reserve the scrollbar's space so locking scroll (below) does not shift the layout.
        scrollbarGutter: 'stable',
        ...atReducedMotion({ scrollBehavior: 'auto' }),
      },
      // Scroll lock for native modal dialogs: pure CSS, no JS scroll-lock hook.
      'html:has(dialog:modal)': {
        overflow: 'hidden',
      },
      body: {
        margin: 0,
        minHeight: '100%',
        fontFamily: t.fontFamily.body.var,
        fontSize: t.fontSize.md.var,
        lineHeight: t.lineHeight.normal.var,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        // Resolves when the design theme surface lives on `<html>`
        // (`DesignSystemProvider applyToDocument`). Otherwise these vars fall back until an
        // ancestor defines the theme tokens.
        backgroundColor: t.color.background.app.var,
        color: t.color.text.primary.var,
      },
      'h1, h2, h3, h4, h5, h6': {
        fontFamily: t.fontFamily.display.var,
        fontWeight: t.fontWeight.semibold.var,
        lineHeight: t.lineHeight.tight.var,
        color: t.color.text.primary.var,
      },
      h1: {
        fontSize: t.fontSize.xxxl.var,
        fontWeight: t.fontWeight.bold.var,
        marginBottom: t.space.sm.var,
      },
      h2: {
        fontSize: t.fontSize.xxl.var,
        fontWeight: t.fontWeight.bold.var,
        marginTop: t.space.xl.var,
        marginBottom: t.space.xs.var,
      },
      h3: {
        fontSize: t.fontSize.xl.var,
        marginTop: t.space.lg.var,
        marginBottom: t.space.xs.var,
      },
      'h4, h5, h6': {
        fontSize: t.fontSize.lg.var,
        marginTop: t.space.md.var,
        marginBottom: t.space.xxs.var,
      },
      p: {
        marginBottom: t.space.sm.var,
      },
      'p:last-child': {
        marginBottom: 0,
      },
      a: {
        color: t.color.link.default.var,
        textDecoration: 'underline',
        textDecorationThickness: '0.0625rem',
        textUnderlineOffset: '0.125rem',
        fontWeight: t.fontWeight.medium.var,
        transition: t.transition.colorShift.var,
      },
      'a:hover': {
        color: t.color.link.hover.var,
      },
      'a:focus-visible': {
        ...focusRing,
        borderRadius: t.radius.sm.var,
      },
      code: {
        fontFamily: t.fontFamily.mono.var,
        fontSize: '0.9em',
        fontWeight: t.fontWeight.medium.var,
        color: t.color.link.hover.var,
      },
      'a code': {
        color: 'inherit',
      },
      'pre:not([data-codeblock-pre])': {
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.sm.var,
        lineHeight: 1.6,
        backgroundColor: t.color.background.subtle.var,
        padding: t.space.sm.var,
        borderRadius: t.radius.md.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: t.color.border.default.var,
        overflow: 'auto',
        marginBottom: t.space.sm.var,
      },
      'pre code': {
        backgroundColor: 'transparent',
        padding: 0,
        border: 'none',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        color: 'inherit',
      },
      'strong, b': {
        fontWeight: t.fontWeight.semibold.var,
      },
      'em, i': {
        fontStyle: 'italic',
      },
      small: {
        fontSize: t.fontSize.sm.var,
      },
      hr: {
        border: 'none',
        borderTopWidth: t.borderWidth.default.var,
        borderTopStyle: 'solid',
        borderTopColor: t.color.border.default.var,
        margin: `${t.space.lg.var} 0`,
      },
      'ul, ol': {
        marginBottom: t.space.sm.var,
        paddingLeft: t.space.md.var,
      },
      li: {
        marginBottom: t.space.xxs.var,
      },
      'li:last-child': {
        marginBottom: 0,
      },
      blockquote: {
        margin: `${t.space.md.var} 0`,
        paddingLeft: t.space.md.var,
        borderLeftWidth: t.borderWidth.thick.var,
        borderLeftStyle: 'solid',
        borderLeftColor: t.color.border.strong.var,
        color: t.color.text.secondary.var,
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: t.space.md.var,
        fontSize: t.fontSize.sm.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: t.color.border.default.var,
      },
      'th, td': {
        textAlign: 'left',
        padding: `${t.space.xs.var} ${t.space.sm.var}`,
        borderBottomWidth: t.borderWidth.default.var,
        borderBottomStyle: 'solid',
        borderBottomColor: t.color.border.default.var,
        verticalAlign: 'top',
      },
      th: {
        fontWeight: t.fontWeight.semibold.var,
        backgroundColor: t.color.background.subtle.var,
      },
      'tr:last-child td': {
        borderBottom: 'none',
      },
      caption: {
        captionSide: 'bottom',
        paddingTop: t.space.xs.var,
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        textAlign: 'left',
      },
    },
    { layer: baseLayer },
  );
}

registerBaseStyles();
