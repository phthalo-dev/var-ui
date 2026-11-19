export type Catalog = {
  version: string; // @var-ui/cli package version
  // Absent in older catalogs and hand-written test fixtures.
  meta?: CatalogMeta;
  components: ComponentRecord[];
  guides: GuideRecord[];
  // Absent in catalogs generated before `var-ui tokens` (#218).
  tokens?: TokenRecord[];
};

/** One design token, from `listDesignTokens()` in `@var-ui/core`. */
export type TokenRecord = {
  path: string; // 'space.md', 'color.text.primary'
  cssVar: string; // '--var-ui-space-md'
  // Built-in default; colours carry `{ light, dark }`.
  value: string | number | { light?: string | number; dark?: string | number };
};

export type CatalogMeta = {
  generatedAt: string; // ISO timestamp of when the catalog was built
  commit?: string; // git commit the docs content was read from
  packages: {
    react: string;
    core: string;
    icons: string;
    astro: string;
  };
};

export type ComponentRecord = {
  slug: string; // 'button'
  name: string; // 'Button'
  category: string; // registry category key
  description: string;
  importLine: string;
  packages: Array<'react' | 'astro' | 'core'>;
  docsPath: string; // '/components/button'
  markdown: string; // MDX transformed to markdown
  examples: ComponentExample[];
  props: PropRow[]; // empty array if extract has no entry
};

export type ComponentExample = {
  id: string; // 'button.default'
  react: string;
  astro?: string;
  html?: string;
};

export type PropRow = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description?: string;
  // Absent in catalogs generated before the source field was threaded through;
  // treated as Var UI's own props (never filtered out).
  source?: 'var-ui' | 'react-aria' | 'dom';
};

export type GuideRecord = {
  id: string; // collection-relative id, e.g. 'getting-started' or 'customize'
  title: string;
  description: string;
  docsPath: string; // '/docs/getting-started' or '/theming/customize'
  markdown: string;
};
