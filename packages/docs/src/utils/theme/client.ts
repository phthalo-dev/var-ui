/**
 * Browser-safe theme helpers: `@var-ui/docs/theme-client`. Import this from client islands and
 * `<script>`s instead of `@var-ui/docs/utils`, whose barrel also re-exports Node-only modules
 * (`writeMarkdownViews`, the theme CSS extractor) that would end up in the client bundle.
 * Everything here is DOM- or data-only; `client.test.ts` guards that.
 */
export {
  createDocsThemeController,
  ensureDocsThemeStyles,
  type DocsThemeController,
} from './docs-theme';
export {
  createThemeClassMap,
  getAllThemeClassNames,
  getDocsThemeStylesHref,
  getLazyThemePresets,
  resolveThemePresets,
  type DocsThemePreset,
  type ResolvedDocsThemePreset,
} from './presets';
