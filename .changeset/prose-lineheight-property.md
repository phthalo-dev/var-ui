---
'@var-ui/core': patch
---

Importing `@var-ui/core` is silent again. The `prose` recipe's `lineHeight` var has a literal `initial`, so TypeStyles registers its `@property` and no longer prints "Skipping @property for --var-ui-prose-lineheight".
