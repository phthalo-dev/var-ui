---
'@var-ui/cli': patch
---

`var-ui component <Name>` now shows only the component's own props by default: the inlined table lists Var UI and React Aria props, with a one-line note that the component also accepts all standard HTML attributes, and `--all-props` prints the complete inherited list (text and `--json`). Prop rows now carry their `source` so the filter is exact, and props declared in `@var-ui/core` recipe types (e.g. Badge's `tone`/`appearance`) are classified as the component's own instead of DOM attributes.
