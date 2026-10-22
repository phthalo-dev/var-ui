/** Name of the built-in default theme surface registered via {@link registerDefaultTheme}. */
export const DEFAULT_THEME_NAME = 'default';

/** Class name for the default theme surface (`theme-var-ui-default`). */
export const defaultThemeClassName = `theme-var-ui-${DEFAULT_THEME_NAME}`;

/**
 * Attribute that pins color mode on an element and its descendants.
 * `data-color-mode="light"` or `"dark"`. Omit it to follow the OS.
 */
export const COLOR_MODE_ATTRIBUTE = 'data-color-mode';
