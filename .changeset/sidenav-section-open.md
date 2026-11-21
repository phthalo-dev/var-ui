---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': patch
---

Collapsible `SideNav` sections can be controlled and remembered.

- **react** `SideNav.Section` takes `open` / `onOpenChange` (controlled). A parent that ignores the change keeps the section as it is.
- **react, astro** `SideNav persistKey` remembers which collapsible sections the reader opened or closed, in `localStorage`. Sections are keyed by `id`, or else their title. The section holding the current page always starts open. Astro `SideNav` also initializes navs swapped in by the client router (`astro:page-load`).
- **core** `persistDisclosures(root, key)` (`@var-ui/core/shared/disclosureState`) is the framework-agnostic helper behind both.
- **docs** The sidebar uses `persistKey`. The custom `docsSidebarState` script is removed.
