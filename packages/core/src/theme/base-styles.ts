import { reset } from 'typestyles/globals';
import { designTokens as t } from '../tokens';
import { focusRing } from '../components/focusRing';
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
        ...atReducedMotion({ scrollBehavior: 'auto' }),
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
        fontSize: t.fontSize['3xl'].var,
        fontWeight: t.fontWeight.bold.var,
        marginBottom: t.space[3].var,
      },
      h2: {
        fontSize: t.fontSize['2xl'].var,
        fontWeight: t.fontWeight.bold.var,
        marginTop: t.space[6].var,
        marginBottom: t.space[2].var,
      },
      h3: {
        fontSize: t.fontSize.xl.var,
        marginTop: t.space[5].var,
        marginBottom: t.space[2].var,
      },
      'h4, h5, h6': {
        fontSize: t.fontSize.lg.var,
        marginTop: t.space[4].var,
        marginBottom: t.space[1].var,
      },
      p: {
        marginBottom: t.space[3].var,
      },
      'p:last-child': {
        marginBottom: 0,
      },
      a: {
        color: t.color.link.default.var,
        textDecoration: 'underline',
        textDecorationThickness: '1px',
        textUnderlineOffset: '2px',
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
        padding: t.space[3].var,
        borderRadius: t.radius.md.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: t.color.border.default.var,
        overflow: 'auto',
        marginBottom: t.space[3].var,
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
        margin: `${t.space[5].var} 0`,
      },
      'ul, ol': {
        marginBottom: t.space[3].var,
        paddingLeft: t.space[4].var,
      },
      li: {
        marginBottom: t.space[1].var,
      },
      'li:last-child': {
        marginBottom: 0,
      },
      blockquote: {
        margin: `${t.space[4].var} 0`,
        paddingLeft: t.space[4].var,
        borderLeftWidth: t.borderWidth.thick.var,
        borderLeftStyle: 'solid',
        borderLeftColor: t.color.border.strong.var,
        color: t.color.text.secondary.var,
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: t.space[4].var,
        fontSize: t.fontSize.sm.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: t.color.border.default.var,
      },
      'th, td': {
        textAlign: 'left',
        padding: `${t.space[2].var} ${t.space[3].var}`,
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
        paddingTop: t.space[2].var,
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        textAlign: 'left',
      },
    },
    { layer: baseLayer },
  );
}

registerBaseStyles();
