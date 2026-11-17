---
'@var-ui/docs': patch
---

Drop base-theme `@font-face` rules from lazy theme stylesheets. The theme CSS extract now builds the main TypeStyles entry once, collects its font faces, and omits faces it already defines from every `/themes/<id>.css`. Matching uses family + weight + style + src, so descriptor differences such as `unicode-range` or `font-display` cannot leave duplicates behind.
