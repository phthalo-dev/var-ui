---
'@var-ui/docs': minor
---

Top nav fixes (#339, #340):

- When several `topNav` items' `match` prefixes the current path, only the longest is selected (`/docs` and `/docs/changelog` no longer both select on changelog pages), in `DocsTopBar`, `DocsMobileMenu` and the client-side selection sync.
- `TopNavItem.match` is optional; items without it never select.
- New `external` (opens in a new tab with `rel="noopener noreferrer"`), `icon` (inline SVG) and `iconOnly` options on `TopNavItem`.
