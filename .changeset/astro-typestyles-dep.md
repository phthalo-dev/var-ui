---
'@var-ui/astro': patch
---

Declare `typestyles` as a dependency (it was only a devDependency, but `@var-ui/astro` re-exports `cx`, `combine` and `mergeProps` from it, which could fail to resolve under strict package managers).
