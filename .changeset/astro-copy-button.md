---
'@var-ui/astro': minor
'@var-ui/cli': patch
---

Add `CopyButton` to `@var-ui/astro`, closing the React/Astro parity gap. Static pages can render a copyable one-liner (install command, API key, share link) without hydrating a React island: the component renders the same `copyButton` recipe markup and labels as React (`value`, `timeout`, `copyLabel`, `copiedLabel`, `errorLabel`) and copies via a small progressive-enhancement script that reuses the `codeBlockCopy` clipboard logic. The render-prop `children` chrome remains React-only. The CLI patch republishes the docs catalog with the new component.
