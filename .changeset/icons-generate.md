---
'@var-ui/icons': patch
---

Adding a glyph is a data file, a name in core, and `vp run @var-ui/icons#generate`. The generator, which already existed but was undocumented and unchecked, now has a package script that also formats its output. A new `generated.test.ts` fails with that command when the React entries, maps, index or `package.json` subpaths drift from `src/glyph-data`. The README has an "Adding a glyph" section.
