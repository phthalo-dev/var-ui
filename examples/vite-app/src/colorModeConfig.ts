/**
 * One source for the colour-mode settings: `vite.config.ts` passes them to the `varUiColorMode`
 * plugin (the pre-paint script) and `App` passes them to `DesignSystemProvider`, so the storage
 * key and default can't drift apart.
 */
export const COLOR_MODE = {
  storageKey: 'var-ui-example-color-mode',
  defaultColorMode: 'light',
} as const;
