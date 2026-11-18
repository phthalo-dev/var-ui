---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': minor
'@var-ui/docs-components': minor
---

Docs visual design pass, built into the system:

- `tabs` gains `appearance: 'underline' | 'pill'` (React and Astro `Tabs` take `appearance`); tabs lay out an icon + label.
- `codeBlock`: 40px header, icon-only 28px copy button (label kept for screen readers), neutral code surface, and `tabs` / `tab` slots for tabbed blocks.
- `proseContent`: 16/26 reading type, 44/28/20 heading ramp, lead paragraph, neutral inline-code chip, quiet link underline, hairline tables.
- `sideNav`: 32px rows, semibold active item with a 2px accent bar. `toc`: uppercase label, accent indicator.
- `appShell`: CSS twin of `data-mobile`, so the side nav and aside hide below the mobile breakpoint on first paint.
- Tokens: warm three-step dark surfaces (canvas / chrome / raised), warm borders and muted text, neutral code surfaces, a restrained three-hue syntax palette, a desaturated dark accent. Disabled buttons drain their hue.
- `@var-ui/docs`: `DocsPageHeader` (eyebrow, title, lead, metadata list), `PackageInstall` (tabbed pnpm / npm / yarn / bun block), markdown fences rendered as the shared code block, demo frames as dot-grid stages, a centered content + TOC grid, a sidebar that becomes the mobile drawer, and a props-table recipe.
- `@var-ui/docs-components`: `ComponentDocTabs` uses pill tabs with icons; the TOC lives in the `DocsPage` rail.
