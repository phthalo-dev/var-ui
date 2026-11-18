import { COLOR_MODE_ATTRIBUTE } from './constants';

export type ColorModePreference = 'light' | 'dark' | 'system';

export type ColorModeInitScriptOptions = {
  /** `localStorage` key the app persists the preference under (the provider's `storageKey`). */
  storageKey: string;
  /** Mode used when nothing valid is stored (the provider's `defaultColorMode`). */
  defaultColorMode: ColorModePreference;
  /** When set, adds this theme class to `<html>` before paint (the provider's theme class). */
  themeClassName?: string;
};

/**
 * Body of an inline `<script>` that applies the stored colour mode (and optionally the theme
 * class) to `<html>` synchronously, before first paint, so a reload never flashes the wrong
 * mode. `light` and `dark` set `data-color-mode`; `system` removes it so `color-scheme` follows
 * the OS. Blocked storage (private mode) falls back to `defaultColorMode`.
 *
 * Framework-agnostic: the React `getColorModeInitScript`, the Astro `ThemeScript` and the Vite
 * plugin (`@var-ui/core/vite`) all render this string. Put it first in `<head>`.
 *
 * A plain string template, not `Function.prototype.toString()`, so the output is byte-identical
 * between an SSR bundle and a client bundle (no hydration mismatch).
 */
export function getColorModeInitScript({
  storageKey,
  defaultColorMode,
  themeClassName,
}: ColorModeInitScriptOptions): string {
  const themeClassStatement = themeClassName
    ? `document.documentElement.classList.add(${JSON.stringify(themeClassName)});`
    : '';
  const attribute = JSON.stringify(COLOR_MODE_ATTRIBUTE);
  return (
    '(function(){' +
    'var VALID=["light","dark","system"];' +
    'var stored=null;' +
    `try{stored=window.localStorage.getItem(${JSON.stringify(storageKey)})}catch(e){}` +
    `var colorMode=VALID.indexOf(stored)!==-1?stored:${JSON.stringify(defaultColorMode)};` +
    themeClassStatement +
    'var root=document.documentElement;' +
    'root.style.colorScheme="";' +
    `if(colorMode==="light"||colorMode==="dark"){root.setAttribute(${attribute},colorMode)}` +
    `else{root.removeAttribute(${attribute})}` +
    '})();'
  );
}
