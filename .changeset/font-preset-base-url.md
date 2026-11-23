---
'@var-ui/core': minor
---

**Breaking:** the font presets are functions: `groteskMono()`, `figtreeGrotesk()` and `alloGrotesk()` (were objects). They take `{ baseUrl }` (default `/fonts/`) for where the app hosts the `.woff2` files. Var UI does not ship the files. The presets' JSDoc and the Customize guide list the exact filenames to self-host and where to get them.
