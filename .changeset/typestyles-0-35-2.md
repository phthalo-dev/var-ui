---
'@var-ui/core': patch
'@var-ui/react': patch
'@var-ui/astro': patch
---

Depend on `typestyles` `^0.35.2`, which keeps recipe `.vars` in `compile: true` (zero-runtime) builds, so components that set recipe vars at runtime work with the compile transform.
