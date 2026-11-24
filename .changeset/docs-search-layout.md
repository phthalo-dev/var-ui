---
'@var-ui/docs': patch
'@var-ui/astro': patch
---

Forward search empty hint and expose guide layout props

- `DocsPage`, `DocsMarketingPage`, and `DocsTopBar` now forward a `searchEmptyHint` prop to `DocsSearch`.
- `DocsSearchItem` gains an optional `href` field so the stable `id` and destination URL can differ.
- `DocsGuidePage` passes `entry`, `headings`, `eyebrow`, and `varDocsRoute` to the configured layout.
- Export `VarDocsRoute` and `DocsGuideLayoutProps` from `@var-ui/docs`, and expose `@var-ui/docs/env` for consumer `env.d.ts` references.
