---
'@var-ui/core': patch
'@var-ui/react': patch
'@var-ui/icons': patch
'@var-ui/cli': patch
'@var-ui/astro': patch
'@var-ui/docs': patch
'@var-ui/docs-components': patch
---

Every published package now ships its `CHANGELOG.md`. A new **Upgrading** guide (`/docs/upgrading`) covers the 0.6 → 0.13 breaks: platform prop names, `filled` → `solid`, native overlays, space tokens and removed exports. The core README lists `typestyles` as the one TypeStyles export (no root `recipe`/`style`), and the React README no longer describes the package as React Aria wrappers. `IconButton` warns once in development when it renders without an `icon` (any cause, including the pre-0.7 `name="close"`).
