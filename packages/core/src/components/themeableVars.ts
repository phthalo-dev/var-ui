import type { ComponentVarDefinitions } from 'typestyles';

/** Attach var-definition metadata for typed theme `components` / `override` `vars` keys. */
export function themeableVars<const D extends ComponentVarDefinitions, H extends object>(
  handle: H,
  _definitions: D,
): H & { readonly __varDefinitions: D } {
  return handle as H & { readonly __varDefinitions: D };
}
