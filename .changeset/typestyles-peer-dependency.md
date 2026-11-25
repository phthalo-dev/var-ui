---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

**Breaking:** `typestyles` is now a peer dependency of `@var-ui/core`, `@var-ui/react` and `@var-ui/astro` instead of a regular dependency, so an app that has its own `typestyles` (for example a workspace that links it with `workspace:*`) no longer gets a second runtime with its own class and token registry. Add `typestyles` to the app if your package manager does not install peers automatically (#332).
