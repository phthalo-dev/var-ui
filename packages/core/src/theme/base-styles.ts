import { reset } from 'typestyles/globals';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { atReducedMotion } from './conditions';
import { COLOR_MODE_ATTRIBUTE, THEME_CLASS_PREFIX } from './constants';
import { global } from '../runtime';
import { viewportAnchor } from '../shared/anchored';

const resetLayer = 'reset';
const baseLayer = 'base';
const tokenLayer = 'tokens';

/**
 * Document globals shipped with `@var-ui/core/styles`: `color-scheme` for root and
 * {@link COLOR_MODE_ATTRIBUTE} pins, Josh Comeau CSS reset, and the document's theme defaults
 * (body text and background, font roles, link colour, focus ring). Registered in the `tokens`,
 * `reset`, and `base` cascade layers so component recipes in higher layers can override.
 *
 * No content formatting: margins, list and quote styles, rules, tables and code blocks for
 * rendered markdown come from `prose` (`<Prose>`), scoped to its container.
 *
 * Side effect on import via the styles extract entry. Re-call after `reset()` in tests.
 */
export function registerBaseStyles(): void {
  global.rules(
    {
      ':root': { colorScheme: 'light dark' },
      // Root theme surface without a pin: keep resolving light-dark() from the OS.
      [`:root[class*="${THEME_CLASS_PREFIX}"]`]: { colorScheme: 'light dark' },
      // Doubled so the pin outranks the theme class's `color-scheme: light dark` in the same layer.
      [`[${COLOR_MODE_ATTRIBUTE}="dark"][${COLOR_MODE_ATTRIBUTE}="dark"]`]: {
        colorScheme: 'dark',
      },
      [`[${COLOR_MODE_ATTRIBUTE}="light"][${COLOR_MODE_ATTRIBUTE}="light"]`]: {
        colorScheme: 'light',
      },
      // Nested theme surfaces without their own pin inherit the ancestor's pinned scheme
      // instead of following the OS via `color-scheme: light dark` (see var-ui#177).
      [`html [class*="${THEME_CLASS_PREFIX}"]:not([${COLOR_MODE_ATTRIBUTE}])`]: {
        colorScheme: 'inherit',
      },
      // Pinned theme surfaces (including nested ones) keep their own explicit scheme.
      [`html [class*="${THEME_CLASS_PREFIX}"][${COLOR_MODE_ATTRIBUTE}="dark"]`]: {
        colorScheme: 'dark',
      },
      [`html [class*="${THEME_CLASS_PREFIX}"][${COLOR_MODE_ATTRIBUTE}="light"]`]: {
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
        // Names the usable viewport for popup width caps (see `viewportAnchor`).
        anchorName: viewportAnchor,
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
      // A scoped theme surface (`DesignSystemProvider` without `applyToDocument`) defines the
      // tokens `body` reads, so `body` sees only their `@property` initial values (0px font,
      // 0 line height, transparent text) and its children would inherit those. The surface
      // restates the document text defaults from its own tokens. No background: a scoped
      // surface does not paint the app background.
      [`body [class*="${THEME_CLASS_PREFIX}"]`]: {
        fontFamily: t.fontFamily.body.var,
        fontSize: t.fontSize.md.var,
        lineHeight: t.lineHeight.normal.var,
        color: t.color.text.primary.var,
      },
      // Theme font roles only. Sizes, margins and block chrome (lists, quotes, rules, tables,
      // fenced code) are content formatting: they live in `prose`, so a component that renders
      // a heading, a <table> or a <ul> never inherits document formatting it has to undo.
      'h1, h2, h3, h4, h5, h6': {
        fontFamily: t.fontFamily.display.var,
        fontWeight: t.fontWeight.semibold.var,
        lineHeight: t.lineHeight.tight.var,
      },
      'code, kbd, samp, pre': {
        fontFamily: t.fontFamily.mono.var,
      },
      'strong, b': {
        fontWeight: t.fontWeight.semibold.var,
      },
      a: {
        color: t.color.link.default.var,
      },
      'a:focus-visible': {
        ...focusRing,
        borderRadius: t.radius.sm.var,
      },
    },
    { layer: baseLayer },
  );
}

registerBaseStyles();
