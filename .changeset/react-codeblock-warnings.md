---
'@var-ui/react': patch
---

`CodeBlock` no longer emits typestyles dev warnings on every render: attribute-mode slots are merged with `mergeProps` (never `cx`) and modifier slots are gone in favour of `data-*` state hooks, so each element carries exactly one recipe result.
