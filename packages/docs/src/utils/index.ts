export type {
  DocsBrand,
  DocsSearchIndexEntry,
  DocsSearchItem,
  SidebarItem,
  SidebarSection,
  TopNavItem,
} from '../types';

export {
  DOCS_TOC_CONTENT_SELECTOR,
  DOCS_TOC_HEADING_SELECTOR,
  normalizeDocsPath,
  shouldShowDocsToc,
  type DocsTocOptions,
} from './docs-toc';

export { reattachTypestyles } from './reattachTypestyles';

export {
  markdownHref,
  markdownPrefixes,
  publicMarkdownRelPath,
  resolveMarkdownViews,
  type ResolvedMarkdownViews,
} from './markdown-href';

export {
  transformMdx,
  type TransformMdxInput,
  type TransformMdxResult,
  type TransformPropRow,
} from './transform-mdx';

export { writeMarkdownViews } from './write-markdown-views';

export {
  DEFAULT_GUIDE_ROUTES,
  STATIC_MULTI_PREFIX_ERROR,
  assertSingleStaticGuidePrefix,
  guideCatchAllStaticPaths,
  guideInjectPatterns,
  matchGuideRoute,
  prerenderGuideRoutes,
  resolveGuideRouteConfig,
  stripAstroBase,
  type GuideRoutePrefix,
  type ResolvedGuideRoute,
} from './routing';

export {
  createDocsThemeController,
  ensureDocsThemeStyles,
  resetDocsThemeStylesForTests,
  type DocsThemeController,
} from './theme/docs-theme';

export {
  createThemeClassMap,
  getAllThemeClassNames,
  getDocsThemeStylesHref,
  getLazyThemePresets,
  resolveThemePresets,
  type DocsThemePreset,
  type ResolvedDocsThemePreset,
} from './theme/presets';

export {
  extractFontFaces,
  extractThemeOnlyCss,
  type ExtractThemeOnlyCssOptions,
} from './theme/extract-theme-css';

export { highlightCode, highlightCodeClassName } from './highlightCode';
export { highlightCodeBlockContent, type HighlightedCodeBlockContent } from './highlightCodeBlock';
