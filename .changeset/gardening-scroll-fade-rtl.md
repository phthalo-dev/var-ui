---
'@var-ui/core': patch
---

Scroll-driven edge fades (`scrollFade`, code blocks, the TopNav start zone) fade the correct edges in right-to-left layouts. The mask gradient was physical (`to right`), so in RTL the "more content" fade showed on the wrong side.
