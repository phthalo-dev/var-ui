---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': patch
---

New `Prose` for rendered markdown in app UI (#147).

- **core** `prose` recipe: styles the bare elements a markdown renderer emits (headings, paragraphs, lists, links, inline and fenced code, blockquotes, tables, rules), relative to the inherited font size. `density` (`compact | balanced | spacious`) sets the rhythm and heading scale. Element rules sit in the `base` cascade layer, so Var UI components inside keep their own styles. `inlineCode` is now `0.875em` instead of a fixed `xs`, so `Code` scales with its text.
- **react** `Prose` and `proseComponents`, an element map for react-markdown / MDX: fenced code → `CodeBlock` (language from `language-*`), inline code → `Code`, links → `Link`, GFM tables → `Table` parts with column alignment.
- **astro** `Prose`.
