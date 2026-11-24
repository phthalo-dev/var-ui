---
'@var-ui/docs': patch
---

Fix docs shell layout and slot forwarding bugs

- Forward brand/tools/preview slots only when they render non-empty content, preventing empty brand links and demo stages.
- Remove the duplicate `<main>` landmark in `DocsMarketingPage`.
- Stop the collapsed page bar from painting briefly on load.
- Add `scroll-margin-top` to guide headings and retry hash scrolling after the nested scroller has layout.
- Always extract `@var-ui/docs/styles` in the Typestyles plugin and add fallback sizing to the TOC action icon.
