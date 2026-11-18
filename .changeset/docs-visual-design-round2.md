---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': minor
---

Docs visual design, round 2:

- New core `stage` recipe (`pattern: dots | grid | none`, `tone: neutral | accent`, `fade: none | start | end`): the shared showcase surface for demos, playgrounds and page heroes.
- `proseContent` stops at `[data-prose-isolate]` subtrees (export `PROSE_ISOLATE_ATTRIBUTE`), so live demos keep their own typography. Inline code is quieter (0.875em, 1px 4px, 4px radius) and mono-only in tables and lists.
- `codeBlock`: `codeLanguageLabel()` gives one label convention (TSX, CSS, Shell); filename and language share a 12px/500 muted style. React and Astro `CodeBlock` use it.
- `Card` gains a full-bleed `media` slot (React `media` prop, Astro `media` slot) and an accent-edged hover lift.
- Pill `Tabs` stay on one scrollable row with unclipped focus rings; the selected pill is a raised surface in dark mode.
- Neutral filled controls are a softer ink / off-white; the dark-mode selected nav item has a real accent tint.
- `@var-ui/react` re-exports `combine`, `cx` and `mergeProps`, like `@var-ui/astro`.
- `@var-ui/docs`: `DocsPageHeader` is an accent stage band with a copyable import and one metadata row; the TOC rail keeps its column on every tab; `guideEntryExists()` (`@var-ui/docs/guide-entry`) lets routes 404 before rendering; the props-table recipe stacks into cards below 640px.
