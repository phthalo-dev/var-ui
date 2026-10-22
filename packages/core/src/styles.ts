/**
 * Build-time CSS extraction entry for `@typestyles/vite`.
 *
 * App code should import helpers from `@var-ui/core`, not here.
 * The {@link stylesEntry} binding exists so `vp pack` keeps the registration graph — bare
 * side-effect imports are tree-shaken out of `dist/styles.mjs`.
 *
 * ```ts
 * // typestyles-entry.ts
 * import '@var-ui/core/styles';
 *
 * // Optional: custom themes and app-owned `recipe()` modules
 * import './my-theme';
 * ```
 */
import * as components from './components';
import { registerBaseStyles } from './theme/base-styles';
import { defaultTheme, registerDefaultTheme } from './theme/register-default';

/** Retained export so the packed `@var-ui/core/styles` entry keeps recipe + theme registrations. */
export const stylesEntry = {
  components,
  defaultTheme,
  registerBaseStyles,
  registerDefaultTheme,
};
