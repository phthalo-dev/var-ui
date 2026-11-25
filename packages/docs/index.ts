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
  DocsSearchIndexEntry,
  DocsSearchItem,
  SidebarItem,
  SidebarSection,
  TopNavItem,
} from './src/types';
