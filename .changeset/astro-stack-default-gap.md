---
'@var-ui/astro': patch
---

Keep the rendered default gap of the Astro `Stack` and `HStack` at 12px after the core spacing-vocabulary change (gap names now map 1:1 to the `space.*` tokens): the component default is now `gap="sm"` instead of `gap="md"`, which used to resolve to 12px.
