---
'@var-ui/docs': patch
---

Pin the typestyles extract to the stable `typestyles.css` filename. `@typestyles/vite` 0.7+ hashes the emitted sheet when no `fileName` is configured, and its HTML retargeting only runs for Vite HTML inputs — Astro SSR pages keep linking `/typestyles.css`, which 404'd in production (served as `text/html`, rejected by strict MIME checking).
