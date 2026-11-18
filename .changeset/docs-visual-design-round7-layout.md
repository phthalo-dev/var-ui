---
'@var-ui/core': minor
'@var-ui/docs': minor
---

Docs visual design, round 7 (layout and hero):

- `@var-ui/docs`: below `lg` the section sidebar moves into the mobile drawer (the shell switches to `mobileBreakpoint="lg"` on pages with a sidebar, and the header hamburger shows from there). The `DocsPageHeader` hero hangs its text from the top and, with a showcase, is a fixed-height slot, so the H1 and page tabs land at the same y on every page; below `xl` the showcase is dropped so the lead, import line and metadata keep the full frame. The showcase halo stays inside the page frame.
- `stage`: the neutral dot field is stronger in light mode (19% ink; 13% in dark).
- `select` and `combobox`: the selected option shows a trailing check mark, so selection does not rely on colour alone (`dropdownSelectedCheck` in the shared field chrome).
