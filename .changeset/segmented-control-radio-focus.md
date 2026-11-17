---
'@var-ui/core': patch
'@var-ui/react': patch
---

Fix SegmentedControl keyboard focus to follow the APG radio group pattern

`SegmentedControl` now builds on React Aria `RadioGroup` instead of `ToggleButtonGroup`. Tab enters the group on the checked segment (or the first segment when none is checked), and arrow keys move selection as expected for a `role="radiogroup"`. The sliding indicator and segment styling are unchanged.
