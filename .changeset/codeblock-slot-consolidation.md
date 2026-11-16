---
'@var-ui/core': minor
---

Consolidate the `code-block` recipe's state and modifier slots into `data-*` hooks styled by the recipe, removing slots whose only job was to be merged onto an already-styled element: `bodyScrollable`, `preWrap`, `preScrollX`, `lines`, `lineHighlighted`, `lineAdded`, `lineDeleted`, `copyButtonIdle`, `copyButtonCopied`, `copyButtonError`, `feedbackInline`, `feedbackSuccess`, `feedbackError`. State styling now comes from `data-copied`/`data-error` (already present), plus new `data-wrap`, `data-line-numbers`, `data-highlighted`, `data-line-tone` and `data-tone` selectors; `body` always scrolls and `feedback` is always inline. This is a breaking change for anyone overriding the removed classes — the remaining slot classes are unchanged.
