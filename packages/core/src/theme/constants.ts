/** Name of the built-in default theme surface registered via {@link registerDefaultTheme}. */
export const DEFAULT_THEME_NAME = 'default';

/** Shared prefix for all theme surface class names (`theme-var-ui-`). */
export const THEME_CLASS_PREFIX = 'theme-var-ui-';

/** Class name for the default theme surface (`theme-var-ui-default`). */
export const defaultThemeClassName = `${THEME_CLASS_PREFIX}${DEFAULT_THEME_NAME}`;

/**
 * Attribute that pins color mode on an element and its descendants.
 * `data-color-mode="light"` or `"dark"`. Omit it to follow the OS.
 */
export const COLOR_MODE_ATTRIBUTE = 'data-color-mode';
