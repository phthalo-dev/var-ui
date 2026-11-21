---
'@var-ui/core': minor
'@var-ui/docs': patch
---

New reading type tokens: `fontSize.prose.{body, lead, h1, h2, h3}` (16 / 19 / 44 / 28 / 20px) and the paired fixed line heights `lineHeight.prose.*` (26 / 28 / 48 / 34 / 28px), so themes can tune long-form type apart from the 14px control scale. The docs kit (`docsProse`, the page header lead) uses them instead of hard-coded rems. `Prose` itself stays relative to its inherited font size.
