import { getColorModeInitScript, type ColorModeInitScriptOptions } from './theme/colorModeScript';

/**
 * The subset of Vite's `Plugin` this plugin uses, typed structurally so `@var-ui/core` has no
 * dependency on `vite`. Assignable to `PluginOption`.
 */
export type VarUiVitePlugin = {
  name: string;
  transformIndexHtml: {
    order: 'pre';
    handler: () => Array<{
      tag: 'script';
      children: string;
      injectTo: 'head-prepend';
    }>;
  };
};

/**
 * Vite plugin for single-page apps: injects the colour-mode init script as the first thing in
 * `index.html`'s `<head>`, so a reload paints the stored mode immediately (no flash), with no
 * server rendering. Pass the same values you give `DesignSystemProvider`, ideally from one
 * shared constant so they cannot drift.
 *
 * ```ts
 * // vite.config.ts
 * import { varUiColorMode } from '@var-ui/core/vite';
 * import { defaultThemeClassName } from '@var-ui/core/theme-constants';
 *
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *     varUiColorMode({
 *       storageKey: 'color-mode',
 *       defaultColorMode: 'system',
 *       themeClassName: defaultThemeClassName,
 *     }),
 *   ],
 * });
 * ```
 */
export function varUiColorMode(options: ColorModeInitScriptOptions): VarUiVitePlugin {
  const script = getColorModeInitScript(options);
  return {
    name: 'var-ui:color-mode',
    transformIndexHtml: {
      order: 'pre',
      handler: () => [{ tag: 'script', children: script, injectTo: 'head-prepend' }],
    },
  };
}

export type { ColorModeInitScriptOptions, ColorModePreference } from './theme/colorModeScript';
