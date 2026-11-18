---
'@var-ui/core': patch
'@var-ui/react': patch
'@var-ui/astro': patch
'@var-ui/docs': patch
'@var-ui/cli': patch
---

CommandPalette ranks results by relevance in React and Astro: exact title, then title prefix, title word-start, title substring, keyword and description matches. Groups are ordered by their best hit and the top hit is active. A description-only match shows the highlighted snippet around it in the subtitle. On touch-first devices no row is pre-highlighted while the query is empty. The shared helpers live in `@var-ui/core/shared/commandSearch` and `@var-ui/core/shared/pointer`.
