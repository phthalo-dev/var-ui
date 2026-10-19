import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import '../../src/components';
import { typestyles } from '../../src/runtime';

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export function entryPathFor(subpath: 'index' | 'internal' = 'index'): string {
  return join(pkgRoot, 'src', subpath === 'internal' ? 'internal.ts' : 'index.ts');
}

const defaultEntryPath = entryPathFor('index');

export type ExportCategory =
  | 'recipe'
  | 'recipe-adjacent'
  | 'prop-docs'
  | 'chrome'
  | 'semantic-tone'
  | 'tokens'
  | 'theme'
  | 'runtime'
  | 'toc'
  | 'fonts'
  | 'icons'
  | 'layout'
  | 'registry'
  | 'helper'
  | 'object'
  | 'constant';

export type RuntimeExportEntry = {
  name: string;
  kind: 'function' | 'object' | 'string' | 'number' | 'boolean' | 'symbol' | 'undefined';
  category: ExportCategory;
};

export type PackageExportsAudit = {
  summary: {
    typeOnlyExports: number;
    runtimeExports: number;
    runtimeByCategory: Record<ExportCategory, number>;
    runtimeByKind: Record<RuntimeExportEntry['kind'], number>;
  };
  typeOnlyExports: string[];
  runtimeExports: Record<ExportCategory, string[]>;
};

const recipeNames = new Set(typestyles.getThemeableComponents().keys());

const recipeAdjacent = new Set([
  'linkButton',
  'switchStyles',
  'layoutUtility',
  'text',
  'fieldChrome',
  'dateFieldChrome',
  'calendarGridChrome',
  'avatarGroup',
  'layoutHeader',
  'layoutFooter',
  'layoutContent',
  'layoutPanel',
  'namedContainerQuery',
  'proseContent',
]);

const semanticToneExports = new Set([
  'semanticTone',
  'subtleMix',
  'subtleHoverMix',
  'subtleBackgroundColor',
  'subtleBorderColor',
  'filledHoverColor',
  'semanticChannelAssignments',
  'neutralChannelAssignments',
  'controlAppearancePaint',
  'tonePaint',
  'badgeTonePaint',
  'appearanceSurface',
  'mapTone',
  'surfaceAppearance',
  'tone',
  'toneChannelAssignments',
  'toneValues',
  'toneWithDefault',
  'buttonTonePaint',
  'resolveButtonProps',
]);

function categorizeRuntimeExport(name: string): ExportCategory {
  if (recipeNames.has(name)) return 'recipe';
  if (recipeAdjacent.has(name)) return 'recipe-adjacent';
  if (name.endsWith('VariantPropDocs')) return 'prop-docs';
  if (name.endsWith('Chrome')) return 'chrome';
  if (semanticToneExports.has(name)) return 'semantic-tone';
  if (
    /^(designTokens|tokenValues|palette|generateColors|createToneFace|buildToneFace|onBackground|TONE_|shadowElevation|darkSyntaxValues|lightSyntaxValues|PALETTE_)/.test(
      name,
    ) ||
    name.startsWith('Palette')
  ) {
    return 'tokens';
  }
  if (
    /^(createDesignTheme|disposeDesignTheme|defaultTheme|registerDefaultTheme|mergeThemeOverrides|themeWhen|when|atReducedMotion|DEFAULT_THEME_NAME|SURFACE_ATTRIBUTE|defaultThemeClassName|colorModes|conditional)/.test(
      name,
    ) ||
    name.startsWith('Theme')
  ) {
    return 'theme';
  }
  if (/^(typestyles|style|recipe|tokens|global|override|breakpoint|media)$/.test(name)) {
    return 'runtime';
  }
  if (
    /^(toc|Toc|positionToc|TOC_|collectArticle|createTocSpy|findScrollContainer|pickActive|resolveActive)/.test(
      name,
    )
  ) {
    return 'toc';
  }
  if (
    /^(defineFonts|groteskMono|fontFaceKey|registerFontFace|resetRegisteredFontFaces|Font)/.test(
      name,
    )
  ) {
    return 'fonts';
  }
  if (/^(icon|Icon|defaultGlyph|defaultIcon)/.test(name)) return 'icons';
  if (/^(register|reset)/.test(name)) return 'registry';
  if (
    /Breakpoint|layoutShell|layoutContentWidth|layoutBreakpoint|getLayoutShellVars|SIDE_NAV_COLLAPSED_WIDTH/.test(
      name,
    )
  ) {
    return 'layout';
  }
  return 'helper';
}

function runtimeKind(value: unknown): RuntimeExportEntry['kind'] {
  const kind = typeof value;
  if (
    kind === 'function' ||
    kind === 'object' ||
    kind === 'string' ||
    kind === 'number' ||
    kind === 'boolean'
  ) {
    return kind;
  }
  if (kind === 'symbol') return 'symbol';
  return 'undefined';
}

function finalizeCategory(name: string, value: unknown, category: ExportCategory): ExportCategory {
  if (category === 'helper') {
    if (typeof value === 'object' && value !== null) return 'object';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return 'constant';
    }
  }
  return category;
}

export function collectRuntimeExports(module: Record<string, unknown>): RuntimeExportEntry[] {
  return Object.keys(module)
    .sort()
    .map((name) => {
      const value = module[name];
      const category = finalizeCategory(name, value, categorizeRuntimeExport(name));
      return { name, kind: runtimeKind(value), category };
    });
}

export function collectTypeOnlyExports(entryPath = defaultEntryPath): string[] {
  const configPath = join(pkgRoot, 'tsconfig.json');
  const configFile = ts.readConfigFile(configPath, (path) => ts.sys.readFile(path));
  if (configFile.error) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext([configFile.error], {
        getCurrentDirectory: () => pkgRoot,
        getCanonicalFileName: (fileName) => fileName,
        getNewLine: () => '\n',
      }),
    );
  }

  const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, pkgRoot);
  const program = ts.createProgram([entryPath], parsedConfig.options);
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(entryPath);
  if (!sourceFile) throw new Error(`Missing entry file: ${entryPath}`);

  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) throw new Error('Could not resolve module symbol for package entry');

  const typeOnly: string[] = [];

  for (const exportSymbol of checker.getExportsOfModule(moduleSymbol)) {
    let symbol = exportSymbol;
    if (symbol.flags & ts.SymbolFlags.Alias) {
      symbol = checker.getAliasedSymbol(symbol);
    }

    const isTypeOnly =
      (symbol.flags & ts.SymbolFlags.Type) !== 0 && (symbol.flags & ts.SymbolFlags.Value) === 0;

    if (isTypeOnly) {
      typeOnly.push(symbol.name);
    }
  }

  return typeOnly.sort();
}

export function buildPackageExportsAudit(
  module: Record<string, unknown>,
  entryPath = defaultEntryPath,
): PackageExportsAudit {
  const runtimeEntries = collectRuntimeExports(module);
  const typeOnlyExports = collectTypeOnlyExports(entryPath);

  const runtimeExports = {} as Record<ExportCategory, string[]>;
  const runtimeByCategory = {} as Record<ExportCategory, number>;
  const runtimeByKind = {} as Record<RuntimeExportEntry['kind'], number>;

  for (const entry of runtimeEntries) {
    runtimeExports[entry.category] ??= [];
    runtimeExports[entry.category].push(entry.name);
    runtimeByCategory[entry.category] = (runtimeByCategory[entry.category] ?? 0) + 1;
    runtimeByKind[entry.kind] = (runtimeByKind[entry.kind] ?? 0) + 1;
  }

  for (const names of Object.values(runtimeExports)) {
    names.sort();
  }

  return {
    summary: {
      typeOnlyExports: typeOnlyExports.length,
      runtimeExports: runtimeEntries.length,
      runtimeByCategory,
      runtimeByKind,
    },
    typeOnlyExports,
    runtimeExports,
  };
}
