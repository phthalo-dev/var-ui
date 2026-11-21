---
'@var-ui/cli': minor
---

New `var-ui tokens [query] [--json]`: lists design tokens with their CSS variable and default value (light / dark for colours). The query matches the token path or variable name, ignoring case and separators, so a pasted `--var-ui-font-size-md` finds `--var-ui-fontSize-md`. The catalog gains a `tokens` array from `listDesignTokens()`, and the AGENTS.md block mentions the command.
