---
'@var-ui/astro': minor
---

Astro `Tabs`: the list and panels can live in different layout regions. The controller finds a tab's panel by `aria-controls` anywhere in the document, `Tabs` takes `id` and `panels={false}` (list only), and the new `TabPanel` (`tabs`, `value`, `selected`) renders a panel anywhere. Tab and panel ids are scoped by the `Tabs` id (`<id>-tab-<value>`), fixing collisions between two tab sets with the same values on one page. Arrow keys follow the reading direction (RTL), and navs swapped in by the client router initialize.
