export { default } from './src/integration';
export { default as varDocs } from './src/integration';

export type { VarDocsConfig, VarDocsUserConfig } from './src/config';
export {
  parseVarDocsConfig,
  VarDocsUserConfigSchema,
  VarDocsThemeConfigSchema,
  VarDocsThemePresetSchema,
} from './src/config';

export type {
  DocsBrand,
  DocsGuideLayoutProps,
  DocsSearchItem,
  SidebarItem,
  SidebarSection,
  TopNavItem,
  VarDocsRoute,
} from './src/types';
