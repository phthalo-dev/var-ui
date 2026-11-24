---
'@var-ui/docs': minor
---

`varDocs({ typestyles: { entry, extract: false } })` skips the kit's own `@typestyles/vite` extractor, for sites that already run one (for example `@typestyles/astro`); two extractors both emitted `typestyles.css`. The kit's extractor now sets `mode: 'build'` explicitly (#333).
