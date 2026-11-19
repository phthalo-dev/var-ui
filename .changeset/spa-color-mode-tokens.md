---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': patch
---

SPA colour-mode setup and a runtime token list (#148).

- **core** One colour-mode init script for every setup: `getColorModeInitScript` (`@var-ui/core/color-mode-script`, also from the root). New Vite plugin `varUiColorMode` (`@var-ui/core/vite`) injects it first in `index.html`, so SPAs get no flash on reload without server rendering. New `listDesignTokens()` returns every built-in token's path, CSS variable, `var()` ref and default value (`designTokens` is a proxy with no enumerable keys).
- **react** `getColorModeInitScript` is the core implementation (same signature).
- **astro** `ThemeScript` renders the core script and takes `defaultColorMode`; across view transitions it copies the resolved theme class and mode onto the incoming page. Removed `applyThemeBoot`, `bootTheme` and `watchThemeOnNavigation`: an unused copy of the boot logic that ran too late (a module script) to prevent a flash. Use `ThemeScript`.
