---
'@var-ui/core': patch
---

Depend on TypeStyles 0.36. Theme presets no longer register their tokens on `:root`, so the dev server and extraction stop logging a "Skipped a rule: dedupe key" warning for each token group in every preset (#208). Design tokens now only come from the theme surface: the `theme-var-ui-default` class, which `DesignSystemProvider` applies. The README always said this was required, but 0.35 also put the default theme's values on `:root`, so pages without the class happened to work.
