---
'@var-ui/icons': patch
'@var-ui/docs': patch
---

Add the Var UI brand mark: `(-)`, the `var(--)` call in miniature, drawn from Inconsolata's proportions on the 24×24 icon grid. `@var-ui/icons/brand` exports the strings (`varUiMarkInnerHtml`, `varUiMarkSvg`, `varUiFaviconSvg()`), for Astro and plain HTML; `varUiMark` is the React element.

`varDocs()` takes a `favicon` option. `DocsPage` and `DocsMarketingPage` emit it in `<head>`, and `DocsFavicon` covers site layouts that write their own `<head>`.
