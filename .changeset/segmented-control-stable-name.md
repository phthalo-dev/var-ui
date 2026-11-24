---
'@var-ui/astro': patch
---

Astro `SegmentedControl`'s default `name` is now derived from the page path and the control's position on the page instead of a random value, so static HTML is the same on every build. `nextSegmentedControlName()` is replaced by `segmentedControlName(render, pathname)`. The change event is documented on the component page (#342).
