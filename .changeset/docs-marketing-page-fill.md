---
'@var-ui/docs': minor
---

`DocsMarketingPage` takes `fill` for full-height tool pages (editor + preview): the content fills the area under the top bar, unpadded and without the page scroller, and the `footer` slot is not rendered. Sites no longer have to compose `AppShell`, `DocsTopBar`, `DocsMobileMenu` and the `<head>` wiring by hand (#338).
