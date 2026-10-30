---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

CSS-first theming and platform accessibility features.

- **Reduced motion at the token level.** The `duration.fast|medium|slow` tokens resolve to `0ms` under `prefers-reduced-motion: reduce` (a theme `mode` added to every `createDesignTheme` theme), and the `transition.*` tokens are built from them, so any recipe that uses duration or transition tokens respects it without per-recipe code. Every hard-coded `140ms`/`0.15s`/`200ms` literal in the recipes is now a token or `transitionOf()`; keyframe animations use `atReducedMotion`; no recipe contains a raw `@media` any more. Unused duration `*-min`/`*-max` tokens are removed. New transition tokens: `border`, `borderShadow`, `background`, `chrome`, `transform`.
- **Forced colors and contrast.** New `atForcedColors`, `atMoreContrast`, `when.forcedColors`, `when.moreContrast`. Components that conveyed state or boundaries only through background or box-shadow (checkbox/radio/switch, selected tabs/segments/chips/menu items, progress and slider fills, calendar and date segments, skeleton, spinner, swatches, chat bubbles, dividers, ...) now keep a visible cue in Windows High Contrast.
- **RTL.** Physical properties in the recipes became logical (inline/block sides, `text-align: start`, logical radii and insets); the switch thumb, table resize handle, progress indeterminate animation, scroll fades and menu placement edges are mirrored under `[dir="rtl"]`.
- **Tokens.** One shadow scale (`xs`-`xl`; `shadow.elevation` is removed); new `zIndex.lifted`; raw z-index integers and opacity literals use tokens; codeBlock diff colours use `tone.success|danger.subtleBackground`; shared `border()` / `borderSide()` helpers replace ~110 longhand borders.
- **Stability.** New tests snapshot every recipe's slot class names, component CSS variables and axes, and the `data-*` state hooks the components emit, so renames show up in review. Unused `data-alert-*` attributes are removed.
- **Docs.** New "Plain CSS" page under Theming describing the class names, `data-*` hooks, component variables, cascade layers, dark mode, reduced motion, forced colors and RTL; `ROADMAP.md` rewritten to match reality.
- `defaultTheme` is a `const` export; the dark-mode condition constants are shared.
