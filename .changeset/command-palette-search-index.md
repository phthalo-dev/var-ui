---
'@var-ui/core': minor
'@var-ui/astro': minor
'@var-ui/react': minor
'@var-ui/docs': minor
---

Full-text command palette search (#334):

- Command items take a `body` (full text). The shared ranking matches it last, at word starts (phrases too), in a new `commandMatchTier.body` between description substrings and typo matches, and shows the passage around the match as the subtitle. Tier numbers above it moved up by one.
- Astro `CommandPalette` takes `searchIndexUrl`: a JSON array of `{ id, body }` fetched the first time the palette opens and merged into the items, so body text is not inlined on every page. `mergeCommandPaletteSearchIndex` and `CommandPaletteSearchIndexEntry` are exported. React `CommandPaletteItem` gains `body` too.
- `@var-ui/docs`: `searchIndexUrl` on `DocsPage`, `DocsMarketingPage`, `DocsTopBar` and `DocsSearch`, and a `DocsSearchIndexEntry` type.
