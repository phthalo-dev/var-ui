---
'@var-ui/docs': minor
---

New browser-safe entry `@var-ui/docs/theme-client` with `ensureDocsThemeStyles`, `createDocsThemeController` and the theme preset helpers (#169). `@var-ui/docs/utils` also re-exports Node-only modules, so importing it from a client island pulled `node:` imports into the browser bundle.
