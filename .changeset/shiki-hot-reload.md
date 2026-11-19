---
'@var-ui/docs': patch
---

In `astro dev`, markdown code blocks follow `@var-ui/core` source. The Shiki transformer used to take `codeBlockMarkup` (labels, classes) from the built `dist` the Astro config imported, which Node's module cache kept until a full restart. The integration now loads it through Vite. When one of its files changes, it reloads it, invalidates compiled markdown and reloads the page. Builds are unchanged.
