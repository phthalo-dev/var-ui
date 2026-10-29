---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

React and Astro components now import recipes from narrow `@var-ui/core/components/*` subpaths instead of the barrel, so importing one component no longer registers every recipe's CSS during extraction. `@var-ui/core` gains `./tokens/declare` and `./icons/iconNames` subpaths (plus existing `./components/*` / `./shared/*` wildcards).

Public surface trim (intentional break): `@var-ui/core` root no longer re-exports `style` / `recipe` / `tokens` / `global` / `override` / `breakpoint` / `media` from `runtime` (use `typestyles.*`); `@var-ui/react` no longer exports overlay helpers (`mergeOverlayChild`, `inferOverlayCloseReason`, `OverlayCloseContext`, `useOverlayClose`), `FormErrorsContext`, `useTocSpy`, or `useTreeFocus`.

Implementation helpers moved to unpublished `src/internal/` (`controlSize`, `fieldChrome`, `focusRing` in core; `menuContent`, `menuPresets`, `controlSizeContext`, `commandPaletteHotkey`, `commandPaletteController`, `racClassName` in react). Package `exports` are static wildcards; the `generate-subpath-exports` build step is removed. `focusRing` remains available from the `@var-ui/core` root barrel.
