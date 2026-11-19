---
'@var-ui/core': patch
---

A scoped theme surface (`DesignSystemProvider` without `applyToDocument`) sets its own text defaults (font family, size, line height, colour) from its tokens. Since TypeStyles stopped emitting theme tokens on `:root`, `body` resolved them to their `@property` initial values, so scoped content inherited 0px text, 0 line height and transparent colour.
