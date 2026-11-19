---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': minor
---

`prose` gains an opt-out, and the docs-only prose recipe moves out of core.

- **`data-not-prose`** (`NOT_PROSE_ATTRIBUTE`): prose element styles skip the marked element and everything inside it (a live demo, an embedded widget), while the element still takes part in the vertical flow. **`proseRules()`** scopes your own element rules the same way when you extend prose.
- **`proseContent` is removed from `@var-ui/core`** (class `docs-prose`). It was the docs site's reading style, and it sat in the `utilities` layer, so it overrode component styles and needed `data-prose-isolate` to keep out of demos. `@var-ui/docs` now has `docsProse` (in `@var-ui/docs/styles`), which sets `prose`'s vars to the docs ramp and adds the docs extras. It lives in the `base` layer, so components inside win. `data-prose-isolate` is replaced by `data-not-prose`.
- `prose` no longer gives inline children of list items and blockquotes (`code`, badges) a bottom margin; only block children are spaced.
- `Table` sets `display: table` on its `<table>`, so it keeps its layout inside `Prose` (which makes bare tables scrollable blocks).
